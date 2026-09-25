/**
 * The WebGL2 half of the dot field (DotField.tsx): the context, the shaders,
 * the point buffer, the program, colour tokens as GL colours, and one draw per
 * frame. Each point is one vertex whose place down the tunnel is a function of
 * time, so the points are uploaded once and a frame is one draw call.
 */

/** Share of points drawn in --accent instead of --dot. */
const ACCENT_SHARE = 0.18;
/** Tunnel radii in world units; the square-root spread puts most points near the wall. */
const RADIUS_MIN = 0.3;
const RADIUS_MAX = 1;
/** The most Uint32 values one getRandomValues call fills: its limit is 65,536 bytes. */
const RANDOM_CHUNK = 16_384;
/** Focal length as a share of the canvas's longer side. */
const FOCAL = 0.35;
/** CSS px over which the quiet zone's alpha ceiling rises back to full. */
const QUIET_FEATHER = 24;
/** Attribute slot of each point: angle, radius, depth phase, accent flag. */
const POINT_ATTRIBUTE = 0;

/**
 * Moves each point down a tunnel toward the viewer (depth FAR to NEAR, looping)
 * while the tunnel rolls, projects it through the centre, then pulls it toward
 * the pointer by up to LEAN of the distance, fading out beyond LEAN_RADIUS CSS px.
 * Points fade in far away and out just before they wrap, so none pops.
 */
const VERTEX_SHADER = `#version 300 es
in vec4 a_point;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_center;
uniform vec3 u_pointer;
uniform float u_focal;
uniform float u_scale;

out float v_alpha;
out float v_accent;

const float NEAR = 0.35;
const float FAR = 6.0;
const float DRIFT = 0.018;
const float ROLL = 0.035;
const float LEAN = 0.18;
const float LEAN_RADIUS = 240.0;
const float PEAK_ALPHA = 0.85;

void main() {
    float travel = fract(a_point.z + u_time * DRIFT);
    float depth = mix(FAR, NEAR, travel);
    float angle = a_point.x + u_time * ROLL;
    vec2 position = u_center + vec2(cos(angle), sin(angle)) * a_point.y * u_focal / depth;
    vec2 toward = u_pointer.xy - position;
    float reach = 1.0 - smoothstep(0.0, LEAN_RADIUS * u_scale, length(toward));
    position += toward * reach * LEAN * u_pointer.z;
    vec2 clip = position / u_resolution * 2.0 - 1.0;
    gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
    gl_PointSize = clamp(1.1 / depth, 1.0, 3.2) * u_scale;
    float fade = smoothstep(0.0, 0.2, travel) * (1.0 - smoothstep(0.85, 1.0, travel));
    v_alpha = PEAK_ALPHA * fade * mix(0.35, 1.0, travel);
    v_accent = a_point.w;
}
`;

/**
 * Round points, premultiplied. Inside the quiet zone (the Reading text plus its
 * margin) no fragment's alpha exceeds QUIET_ALPHA; the ceiling rises back to 1
 * over u_feather px outside it. The test runs per fragment, so a point that
 * straddles the edge is capped on the inside part only.
 */
const FRAGMENT_SHADER = `#version 300 es
precision highp float;

in float v_alpha;
in float v_accent;

uniform vec3 u_dot;
uniform vec3 u_accent;
uniform vec4 u_quiet;
uniform float u_feather;

out vec4 outColor;

const float QUIET_ALPHA = 0.06;

void main() {
    float edge = 1.0 - smoothstep(0.35, 0.5, length(gl_PointCoord - 0.5));
    vec2 outside = max(u_quiet.xy - gl_FragCoord.xy, gl_FragCoord.xy - u_quiet.zw);
    float away = length(max(outside, 0.0));
    float ceiling = mix(QUIET_ALPHA, 1.0, smoothstep(0.0, u_feather, away));
    float alpha = min(v_alpha * edge, ceiling);
    outColor = vec4(mix(u_dot, u_accent, v_accent) * alpha, alpha);
}
`;

const UNIFORMS = ['u_time', 'u_resolution', 'u_center', 'u_pointer', 'u_focal', 'u_scale', 'u_dot', 'u_accent', 'u_quiet', 'u_feather'] as const;

type UniformName = (typeof UNIFORMS)[number];

/** Red, green, blue as 0–1 sRGB channels. */
export type Rgb = readonly [number, number, number];

/** Everything one GL context holds for the field. */
export interface DotScene {
    readonly program: WebGLProgram;
    readonly vao: WebGLVertexArrayObject;
    readonly buffer: WebGLBuffer;
    readonly count: number;
    readonly uniforms: Readonly<Record<UniformName, WebGLUniformLocation | null>>;
}

/** One frame's inputs in CSS px from the canvas's top left; drawScene converts them to buffer px. */
export interface DotFrame {
    /** Seconds of motion so far. */
    readonly time: number;
    /** The canvas's CSS width and height. */
    readonly size: readonly [number, number];
    /** The tunnel's centre. */
    readonly center: readonly [number, number];
    /** Pointer position, then its lean from 0 to 1. */
    readonly pointer: readonly [number, number, number];
    /** The quiet zone: left, top, right, bottom. */
    readonly quiet: readonly [number, number, number, number];
    readonly dot: Rgb;
    readonly accent: Rgb;
}

/**
 * Flat points need no depth, stencil or multisampling. The buffer is preserved
 * so the last frame, the only one under reduced motion, stays readable after
 * it is shown (print, page snapshots, pixel reads).
 */
const CONTEXT_OPTIONS: WebGLContextAttributes = {
    antialias: false, depth: false, stencil: false, preserveDrawingBuffer: true, powerPreference: 'low-power',
};

/** The canvas's WebGL2 context, or null where WebGL2 is unavailable. */
export function openContext(canvas: HTMLCanvasElement): WebGL2RenderingContext | null {
    return canvas.getContext('webgl2', CONTEXT_OPTIONS);
}

/** Reads a colour token as an Rgb by painting it on a 1 x 1 canvas, so any CSS colour syntax works. */
export function createColourReader(): (style: CSSStyleDeclaration, name: string) => Rgb {
    const probe = document.createElement('canvas');
    probe.width = 1;
    probe.height = 1;
    const context = probe.getContext('2d', { willReadFrequently: true });
    return (style, name) => {
        if (!context) {
            return [0, 0, 0];
        }
        context.clearRect(0, 0, 1, 1);
        context.fillStyle = '#000';
        // An unparsable value is ignored by the canvas, which leaves the black above.
        context.fillStyle = style.getPropertyValue(name).trim() || '#000';
        context.fillRect(0, 0, 1, 1);
        const [red, green, blue] = context.getImageData(0, 0, 1, 1).data;
        return [red / 255, green / 255, blue / 255];
    };
}

/**
 * The points: angle, radius, depth phase and accent flag. The randomness is
 * decorative; crypto.getRandomValues keeps it clear of the S2245 rule at no cost.
 */
function createPoints(count: number): Float32Array {
    const random = new Uint32Array(count * 4);
    for (let start = 0; start < random.length; start += RANDOM_CHUNK) {
        crypto.getRandomValues(random.subarray(start, start + RANDOM_CHUNK));
    }
    const unit = (index: number) => random[index] / 2 ** 32;
    const points = new Float32Array(count * 4);
    for (let i = 0; i < points.length; i += 4) {
        points[i] = unit(i) * Math.PI * 2;
        points[i + 1] = RADIUS_MIN + (RADIUS_MAX - RADIUS_MIN) * Math.sqrt(unit(i + 1));
        points[i + 2] = unit(i + 2);
        points[i + 3] = unit(i + 3) < ACCENT_SHARE ? 1 : 0;
    }
    return points;
}

/** Logs a failed compile or link. A lost context fails both with no log, and is rebuilt on restore instead. */
function reportFailure(gl: WebGL2RenderingContext, stage: string, log: string | null): void {
    if (!gl.isContextLost()) {
        console.error(`DotField: ${stage} failed`, log);
    }
}

function compileShader(gl: WebGL2RenderingContext, type: GLenum, source: string): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) {
        return null;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        return shader;
    }
    reportFailure(gl, 'shader compile', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
}

function createProgram(gl: WebGL2RenderingContext): WebGLProgram | null {
    const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertex || !fragment) {
        gl.deleteShader(vertex);
        gl.deleteShader(fragment);
        return null;
    }
    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.bindAttribLocation(program, POINT_ATTRIBUTE, 'a_point');
    gl.linkProgram(program);
    // Attached shaders live on inside the program; these only drop the handles.
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        return program;
    }
    reportFailure(gl, 'program link', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
}

function locateUniforms(gl: WebGL2RenderingContext, program: WebGLProgram): DotScene['uniforms'] {
    const entries = UNIFORMS.map((name) => [name, gl.getUniformLocation(program, name)] as const);
    return Object.fromEntries(entries) as DotScene['uniforms'];
}

/**
 * Builds the field for `count` points, or returns null when the program does
 * not build. Blending takes the maximum rather than adding: overlapping points
 * never stack up, so no pixel is more opaque than the most opaque point on it,
 * and the quiet zone's ceiling holds however many points overlap there.
 */
export function createScene(gl: WebGL2RenderingContext, count: number): DotScene | null {
    const program = createProgram(gl);
    if (!program) {
        return null;
    }
    const vao = gl.createVertexArray();
    const buffer = gl.createBuffer();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, createPoints(count), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(POINT_ATTRIBUTE);
    gl.vertexAttribPointer(POINT_ATTRIBUTE, 4, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.MAX);
    return { program, vao, buffer, count, uniforms: locateUniforms(gl, program) };
}

/** Frees the scene's GL objects. Call only while the context is live. */
export function destroyScene(gl: WebGL2RenderingContext, scene: DotScene): void {
    gl.deleteVertexArray(scene.vao);
    gl.deleteBuffer(scene.buffer);
    gl.deleteProgram(scene.program);
}

/** Clears the canvas and draws every point once. */
export function drawScene(gl: WebGL2RenderingContext, scene: DotScene, frame: DotFrame): void {
    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;
    const scaleX = width / Math.max(frame.size[0], 1);
    const scaleY = height / Math.max(frame.size[1], 1);
    const [left, top, right, bottom] = frame.quiet;
    const [pointerX, pointerY, lean] = frame.pointer;
    const u = scene.uniforms;
    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(scene.program);
    gl.uniform1f(u.u_time, frame.time);
    gl.uniform2f(u.u_resolution, width, height);
    gl.uniform2f(u.u_center, frame.center[0] * scaleX, frame.center[1] * scaleY);
    gl.uniform3f(u.u_pointer, pointerX * scaleX, pointerY * scaleY, lean);
    gl.uniform1f(u.u_focal, FOCAL * Math.max(width, height));
    gl.uniform1f(u.u_scale, scaleX);
    gl.uniform3f(u.u_dot, ...frame.dot);
    gl.uniform3f(u.u_accent, ...frame.accent);
    // Left, bottom, right, top: gl_FragCoord counts up from the bottom left.
    gl.uniform4f(u.u_quiet, left * scaleX, height - bottom * scaleY, right * scaleX, height - top * scaleY);
    gl.uniform1f(u.u_feather, QUIET_FEATHER * scaleX);
    gl.bindVertexArray(scene.vao);
    gl.drawArrays(gl.POINTS, 0, scene.count);
    gl.bindVertexArray(null);
}

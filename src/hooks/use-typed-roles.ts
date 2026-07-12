'use client';

import { useEffect, useState } from 'react';

const TYPE_MS = 62;
const DELETE_MS = 34;
const HOLD_MS = 2200;

type SetTyped = (value: string) => void;

/** Runs the type/hold/delete state machine; returns a stop function. */
function startTypingLoop(roles: readonly string[], setTyped: SetTyped): () => void {
    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
        const word = roles[roleIdx];
        if (!deleting) {
            charIdx++;
            if (charIdx >= word.length) {
                deleting = true;
                setTyped(word);
                timer = setTimeout(tick, HOLD_MS);
                return;
            }
        } else {
            charIdx--;
            if (charIdx <= 0) {
                deleting = false;
                roleIdx = (roleIdx + 1) % roles.length;
            }
        }
        setTyped(word.slice(0, charIdx));
        timer = setTimeout(tick, deleting ? DELETE_MS : TYPE_MS);
    };

    tick();
    return () => clearTimeout(timer);
}

/**
 * Cycles through `roles` with a typewriter effect: type forward, hold, delete,
 * advance to the next role. Under prefers-reduced-motion the first role is
 * shown statically instead.
 */
export function useTypedRoles(roles: readonly string[]): string {
    const [typed, setTyped] = useState('');

    useEffect(() => {
        if (roles.length === 0) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setTyped(roles[0]);
            return;
        }
        return startTypingLoop(roles, setTyped);
    }, [roles]);

    return typed;
}

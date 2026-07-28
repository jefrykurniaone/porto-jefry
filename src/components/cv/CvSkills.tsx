import { View, Text } from '@react-pdf/renderer';
import { skillCategories, type SkillCategory } from '@/data/skills';
import { styles } from './cv-styles';
import { type Messages } from './cv-types';

interface SkillRowProps {
    cat: SkillCategory;
    label: string;
}

function SkillRow({ cat, label }: Readonly<SkillRowProps>) {
    // Without wrap={false} a category whose chips run to two lines is split
    // across the page boundary, clipping the second line of chips in half.
    return (
        <View style={styles.skillRow} wrap={false}>
            <Text style={styles.skillCategory}>{label}</Text>
            <View style={styles.skillList}>
                {cat.skills.map((s) => (
                    <Text key={`${cat.category}-${s}`} style={styles.tag}>
                        {s}
                    </Text>
                ))}
                {cat.working?.map((s) => (
                    <Text
                        key={`${cat.category}-w-${s}`}
                        style={styles.tagWorking}>
                        {s}
                    </Text>
                ))}
            </View>
        </View>
    );
}

interface CvSkillsProps {
    messages: Pick<Messages, 'skills'>;
}

export default function CvSkills({ messages }: Readonly<CvSkillsProps>) {
    const [first, ...rest] = skillCategories;
    const labelFor = (cat: SkillCategory) =>
        messages.skills.categories[cat.category] ?? cat.category;

    return (
        <View style={styles.section}>
            {/* Title, legend, and first row kept together — the legend explains
                the solid/dashed distinction and is useless on its own page. */}
            <View wrap={false}>
                <Text style={styles.sectionTitle}>{messages.skills.title}</Text>
                <Text style={styles.skillsNote}>{messages.skills.working_note}</Text>
                {first && <SkillRow cat={first} label={labelFor(first)} />}
            </View>
            {rest.map((cat) => (
                <SkillRow key={cat.category} cat={cat} label={labelFor(cat)} />
            ))}
        </View>
    );
}

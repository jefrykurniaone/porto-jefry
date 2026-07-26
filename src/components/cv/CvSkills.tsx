import { View, Text } from '@react-pdf/renderer';
import { skillCategories, type SkillCategory } from '@/data/skills';
import { styles } from './cv-styles';
import { type Messages } from './cv-types';

interface SkillRowProps {
    cat: SkillCategory;
    label: string;
}

function SkillRow({ cat, label }: Readonly<SkillRowProps>) {
    return (
        <View style={styles.skillRow}>
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
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{messages.skills.title}</Text>
            <Text style={styles.skillsNote}>{messages.skills.working_note}</Text>
            {skillCategories.map((cat) => (
                <SkillRow
                    key={cat.category}
                    cat={cat}
                    label={messages.skills.categories[cat.category] ?? cat.category}
                />
            ))}
        </View>
    );
}

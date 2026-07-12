import { View, Text } from '@react-pdf/renderer';
import { skillCategories } from '@/data/skills';
import { styles } from './cv-styles';
import { type Messages } from './cv-types';

interface CvSkillsProps {
    messages: Pick<Messages, 'skills'>;
}

export default function CvSkills({ messages }: Readonly<CvSkillsProps>) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{messages.skills.title}</Text>
            {skillCategories.map((cat) => (
                <View key={cat.category} style={styles.skillRow}>
                    <Text style={styles.skillCategory}>
                        {messages.skills.categories[cat.category] ?? cat.category}
                    </Text>
                    <View style={styles.skillList}>
                        {cat.skills.map((s) => (
                            <Text key={`${cat.category}-${s}`} style={styles.tag}>
                                {s}
                            </Text>
                        ))}
                    </View>
                </View>
            ))}
        </View>
    );
}

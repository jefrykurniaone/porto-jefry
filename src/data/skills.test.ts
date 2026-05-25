import { describe, it, expect } from 'vitest';
import { skillCategories } from './skills';

describe('skillCategories data', () => {
    it('is a non-empty array', () => {
        expect(skillCategories.length).toBeGreaterThan(0);
    });

    it('every category has a non-empty string category field', () => {
        skillCategories.forEach((cat) => {
            expect(typeof cat.category).toBe('string');
            expect(cat.category.length).toBeGreaterThan(0);
        });
    });

    it('every category has at least one skill', () => {
        skillCategories.forEach((cat) => {
            expect(cat.skills.length).toBeGreaterThan(0);
        });
    });

    it('every skill is a non-empty string', () => {
        skillCategories.forEach((cat) => {
            cat.skills.forEach((skill) => {
                expect(typeof skill).toBe('string');
                expect(skill.length).toBeGreaterThan(0);
            });
        });
    });

    it('category names are unique', () => {
        const names = skillCategories.map((c) => c.category);
        expect(new Set(names).size).toBe(names.length);
    });
});

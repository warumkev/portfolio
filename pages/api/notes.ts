import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { NextApiRequest, NextApiResponse } from 'next';

const NOTES_DIR = path.join(process.cwd(), 'features/notes/content');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const files = fs.readdirSync(NOTES_DIR).filter(f => f.endsWith('.md'));
        const notes = files.map(filename => {
            const filePath = path.join(NOTES_DIR, filename);
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const { data, content } = matter(fileContents);
            return {
                slug: filename.replace(/\.md$/, ''),
                title: data.title || '',
                date: data.date || '',
                content,
            };
        });
        // Sort by date descending
        notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        res.status(200).json(notes);
    } catch (e) {
        res.status(500).json({ error: 'Failed to load notes.' });
    }
}

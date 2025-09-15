import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const dir = path.join(process.cwd(), 'features/projects/content');
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
    const projects = files.map(file => {
        const filePath = path.join(dir, file);
        const raw = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(raw);
    });
    res.status(200).json(projects);
}

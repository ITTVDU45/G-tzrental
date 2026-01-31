import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'src/data/cms/cms-data.json');

export async function readDb() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading DB:', error);
        return null;
    }
}

export async function writeDb(data: any) {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 4), 'utf-8');
        return true;
    } catch (error) {
        console.error('Error writing DB:', error);
        return false;
    }
}

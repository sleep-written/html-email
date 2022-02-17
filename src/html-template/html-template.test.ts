import { assert } from 'chai';
import { readFile } from 'fs/promises';
import { HtmlTemplate } from './html-template';

async function execute(index: number): Promise<void> {
    const i = index.toString(10).padStart(2, '0');
    const path = `./templates/html-parser/${i}/`;

    const temp = new HtmlTemplate(
        path + 'temp.html',
        'utf-8'
    );

    const data = JSON.parse(await readFile(
        path + 'data.json',
        temp.encoding
    ));

    const spec = await readFile(
        path + 'spec.html',
        temp.encoding
    );

    await temp.load();
    const resp = temp.parse(data);
    assert.strictEqual(resp, spec);
}

describe('Testing "./html-template"', () => {
    it('Template 01', async () => {
        await execute(1);
    });

    it('Template 02', async () => {
        await execute(2);
    });

    it('Template 03', async () => {
        await execute(3);
    });
});
import { assert } from 'chai';
import { readFile } from 'fs/promises';
import { HtmlTemplate } from './html-template';

async function execute(index: number): Promise<void> {
    const num = index.toString(10).padStart(2, '0');
    const url = `./templates/html-parser/${num}/`;
    const enc = 'utf-8';

    const temp = await HtmlTemplate.load(url + 'temp.html', enc);
    const data = JSON.parse(await readFile(url + 'data.json', enc));
    const spec = await readFile(url + 'spec.html', enc);

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

    it('Template 04', async () => {
        await execute(4);
    });
});
import * as htmlParser from 'node-html-parser';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { assert } from 'chai';

import { CssTemplate } from './css-template';

async function execute(index: number): Promise<void> {
    const num = index.toString(10).padStart(2, '0');
    const url = resolve(`./templates/css-template/css-template/${num}`);

    const targHtml = await readFile(`${url}/target.html`, 'utf-8');
    const specHtml = await readFile(`${url}/expect.html`, 'utf-8');
    
    const temp = await CssTemplate.load(`${url}/target.css`);
    const html = htmlParser.parse(targHtml);

    temp.apply(html);
    const resp = html.toString();
    assert.strictEqual(resp, specHtml);
}

describe('Testing "./css-template"', () => {
    it('Template 01', () => execute(1));
});
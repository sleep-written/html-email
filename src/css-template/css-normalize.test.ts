import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { assert } from 'chai';

import { cssNormalize } from './css-normalize';

/**
 * Executes a test using an specific folder.
 * @param index The number of the folder do you want to execute.
 * @param pretty If you want to format with an standard spacing.
 */
async function execute(
    index: number,
    pretty?: boolean
): Promise<void> {
    const num = index.toString(10).padStart(2, '0');
    const url = resolve(`./templates/css-template/css-normalize/${num}`);

    const targ = await readFile(`${url}/target.css`, 'utf-8');
    const spec = await readFile(`${url}/expect.css`, 'utf-8');

    const resp = cssNormalize(targ, pretty);
    assert.strictEqual(resp, spec);
}

describe('Testing "./css-template/css-normalize"', () => {
    it('File CSS 01', () => execute(1, true));
    it('File CSS 02', () => execute(2, true));
    it('File CSS 03', () => execute(3, true));
});
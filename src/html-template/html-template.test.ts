import { assert } from 'chai';
import { readFile } from 'fs/promises';
import { Literal } from '../flatten-obj';
import { HtmlTemplate } from './html-template';

/**
 * Executes the test with the given paramenters.
 * @param o Options to launch the test.
 */
async function execute(o: {
    resp: string,
    spec: string,
    data: Literal
}): Promise<void> {
    const html = new HtmlTemplate(`./templates/${o.resp}`);
    const resp = await html.parse({
        text: 'jajaja',
        value: 555
    });

    const spec = await readFile(`./templates/${o.spec}`, 'utf-8');
    assert.strictEqual(resp, spec);
}

describe('Testing "./html-template"', () => {
    it('Case 01.', async () => {
        await execute({
            resp: '01-resp.html',
            spec: '01-spec.html',
            data: {
                text: 'jajaja',
                value: 555
            }
        });
    });
});
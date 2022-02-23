import { resolve } from 'path';
import { readFile } from 'fs/promises';
import { HTMLElement } from 'node-html-parser';

import { Fetch } from '../fetch';
import { CssBlock } from './css-block';
import { cssNormalize } from './css-normalize';

export class CssTemplate {
    static async load(location: string | URL, encoding?: BufferEncoding): Promise<CssTemplate> {
        const enc = encoding ?? 'utf-8';
        if (location instanceof URL) {
            // Remote location
            const requ = new Fetch(location, 'GET');
            const resp = await requ.write();
            if (resp.status === 200) {
                const text = resp.toString();
                return new CssTemplate(text);
            } else {
                throw new Error('GET request failed.');
            }
        } else {
            // Local location
            const text = await readFile(resolve(location), enc);
            return new CssTemplate(text);
        }
    }
    
    private _blocks: CssBlock[];
    get blocks(): CssBlock[] {
        return this._blocks;
    }

    constructor(css: string) {
        const text = cssNormalize(css);
        const match = text
            .split(/(?<=\})\s+/gi)

        this._blocks = [];
        for (const base of match) {
            const rawProps = base.match(/(?<=(\{\s*|;\s*))[a-z0-9\-_]+\s*:\s*[^;]+(?=(;|;?\}))/gi) ?? [];
            const props: Record<string, string> = Object.fromEntries(
                rawProps.map(x => x.split(/\s*:\s*/gi))
            );

            const target = base
                .replace(/(^\s*|\s*\{.*$)/gis, '')
                .replace(/\s+/gi, ' ');

            this._blocks.push(new CssBlock(target, props));
        }
    }

    applyInline(html: HTMLElement): void {
        for (const block of this._blocks) {
            const nodes = html.querySelectorAll(block.target);
            nodes.forEach(node => {
                const cssOld = node.getAttribute('style');
                const cssNew = block.getStyle();

                node.setAttribute(
                    'style',
                    cssOld
                        ? `${cssOld} ${cssNew}`
                        : cssNew
                );
            });
        }
    }
}
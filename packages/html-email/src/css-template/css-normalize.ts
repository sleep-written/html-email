export function cssNormalize(input: string, pretty?: boolean): string {
    // Remove all unnecessary whitespaces
    let txt01 = input
        .replace(/\/\*.*\*\//gis, '')
        .replace(/(?<=(\{|\}|;|,))\s*/gi, ' ')
        .replace(/(?<=\{[^\{\}]+):\s*/gi, ': ')
        .replace(/\s*(?=(\{|\>|\*))/gi, ' ');

    // Remove media queryes
    while (txt01.match(/@media\s+.+\{.+$/gis)) {
        let lvl = 0;
        let txtQu = '';
        let txtTm = '';
        const chars = txt01.split('');

        while (chars.length) {
            const char = chars.shift();

            if (
                (char === '@') ||
                (txtQu.length)
            ) {
                // Add to the query text cache
                txtQu += char;

                if (txtQu.match(/^@media\s+[^\{]+\{/gi)) {
                    // It's a media query!
                    if (char === '{') {
                        ++lvl;
                    } else if (char === '}') {
                        --lvl;

                        if (lvl === 0) {
                            // End of media query
                            txtTm = txtTm.replace(/@media\s+.+$/gis, '');
                            txtQu   = '';
                            continue;
                        }
                    }
                } else {
                    // Probably not
                    txtTm += char;
                }
            } else {
                // Add to the temporal text
                txtTm += char;
            }

        }

        txt01 = txtTm.trim();
    }

    if (pretty) {
        // Add whitespaces and stuff
        txt01 = txt01
            .replace(/\s+(?=(\{|\>|\*))/gi, ' ')
            .replace(/(?<=(\{|\}|;|,))\s+/gi, ' ')
            .replace(/(?<=(\{|;))\s+/gi, '\n    ')
            .replace(/\s+(?=\})/gi, '\n')
            .replace(/(?<=[^\s;])\s*\}/gi, ';\n}')
            .replace(/(?<=\})\s+/gi, '\n\n');
    }
    
    // Return the result
    return txt01.trimEnd();
}
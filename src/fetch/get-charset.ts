import { IncomingHttpHeaders, OutgoingHttpHeader } from 'http';
import { OutgoingHttpHeaders } from 'http2';

export function getCharset(headers: OutgoingHttpHeaders | undefined): BufferEncoding {
    if (headers == null) {
        return 'utf-8';
    }

    let contentType: OutgoingHttpHeader | undefined;
    for (const entry of Object.entries(headers)) {
        if (entry[0].toLowerCase() === 'content-type') {
            contentType = entry[1];
            break;
        }
    }

    const regex = /(?<=charset=)[0-9a-z\-_]+/gi;
    if (contentType instanceof Array) {
        const match = contentType
            ?.find(x => x.match(/charset=[0-9a-z\-_]+/gi))
            ?.match(regex);

        if (match) {
            return match[0].toLowerCase() as BufferEncoding;
        } else {
            return 'utf-8';
        }
    } else if (typeof contentType === 'string') {
        const match = contentType
            ?.match(regex);

        if (match) {
            return match[0].toLowerCase() as BufferEncoding;
        } else {
            return 'utf-8';
        }
    } else {
        return 'utf-8';
    }
}

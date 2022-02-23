# html-ng-temp

Parses HTML for email like if is Angular templates, and apply CSS as inline styles in it.

## Installation

Add this package as local dependency:
```bash
npm i --save html-ng-temp
```

## How to use

### __1. Make the template__

First make a file with the html (and optionally your *.css) do you want to send by email, for example:

`./template-01.html`:
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>Package Shipped</title>
        <link rel="stylesheet" href="./template-01.css">
    </head>
    <body>
        <h3>Hi John Titor:</h3>

        <p>
            Your package 6573765853 has been shipped to your destination address. click <a href="https://test.com/package/6573765853">here</a> for tracking.
        </p>

        <p>
            Regards....
        </p>
    </body>
</html>
```

`./template-01.css`:
```css
h3 {
    color: #fff;
    background: #ff7f35;
}

p {
    color: #202020;
}
```

### __2. Identify the dynamic data__

For this case, that HTML will be sended to a lot of people, so the name and the package number will be change for every distinct person and package. For that case, our dynamic data is:

```ts
export interface TemplateData {
    // The name of the client.
    name: string;
    
    // The number of the package.
    package: number;
}
```

### __3. Add the wildcards__

Replace the dynamic data with wildcards using this format: `{{ variableName }}`, as __variableName__ is the key of the interface above. For example:

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>Package Shipped</title>
        <link rel="stylesheet" href="./template-01.css">
    </head>
    <body>
        <h3>Hi {{ name }}:</h3>

        <p>
            Your package {{ package }} has been shipped to your destination address. click <a href="https://test.com/package/{{ package }}">here</a> for tracking.
        </p>

        <p>
            Regards....
        </p>
    </body>
</html>
```


### __4. Parse the template__

Now in your progran you only need to load the html file, and give the dynamic data to the `parse` method:
```ts
import { HtmlTemplate } from 'html-ng-temp';
import { TemplateData } from './template-data';

export async function sendEmail(): Promise<void> {
    // Read the HTML template
    const temp = await HtmlTemplate.load<TemplateData>('./template-01.html');

    // Parse the data
    const html = temp.parse({
        name: 'Buckethead',
        package: 999999999
    });

    // Now you can make anything with the parsed html
    console.log(html);
}
```

The result is below these lines, look how the CSS has been attached to its respective elements, ready to be sent as email:

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>Package Shipped</title>

    </head>
    <body>
        <h3 style="color: #fff; background: #ff7f35;">Hi Buckethead:</h3>

        <p style="color: #202020;">
            Your package 999999999 has been shipped to your destination address. click <a href="https://test.com/package/999999999">here</a> for tracking.
        </p>

        <p style="color: #202020;">
            Regards....
        </p>
    </body>
</html>
```

## Notes

### __1. Complex data__
You can parse documents with a more complex structure, for example:
```ts
export interface TemplateData {
    user: {
        name: string;
        dni: string;
    };
    package: {
        trackN: number;
        dateOut: string;
    }
}
```
To use that structure in the html:
```html
<!DOCTYPE html>
<html>
    <body>
        <h3>Hi {{ user.name }}</h3>

        <ul>
            <li>DNI: {{ user.dni }}</li>
            <li>Tracking Number: {{ package.trackN }}</li>
            <li>Date Shipped: {{ package.dateOut }}</li>
        </ul>
    </body>
</html>
```

### __2. Multiple CSS files__
You can use `n` CSS files as you needs, for example:

```html
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="./template-1.css">
        <link rel="stylesheet" href="./template-2.css">
        <!-- ... --->
        <link rel="stylesheet" href="./template-n.css">
    </head>
    <body>
        <!-- bla bla bla --->
        <!-- bla bla bla --->
        <!-- bla bla bla --->
    </body>
</html>
```

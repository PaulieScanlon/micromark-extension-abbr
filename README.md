# micromark-extension-abbr

micromark extension to support abbreviations.

## Use

Say we have the following file, example.md:

```md
    This is an abbreviation: HTML.

    *[HTML]: HyperText Markup Language
```

And the script looks as follows:

```javascript
import fs from 'node:fs'

import micromarkAbbr from 'tbd/micromark-extension-abbr'

micromarkAbbr(fs.readFileSync('example.md')

```

The output would be:

```html
<p>This is an abbreviation: HTML. <abbr title="HyperText Markup Language">HTML</abbr>.</p>
```

## TODO:

- Refs as part of links: `[REF](http://example.com)`

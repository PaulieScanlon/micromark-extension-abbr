import dedent from 'dedent';

import { micromark } from 'micromark';
import { directive, directiveHtml } from 'micromark-extension-directive';

import micromarkAbbr from '../../src/index';

const configToTest = {
  'no-config': undefined,
  'empty object': {},
  expandFirst: { expandFirst: true }
};

for (const [configName, config] of Object.entries(configToTest)) {
  it(`${configName} renders references`, () => {
    const contents = micromarkAbbr(
      dedent`
        This is an abbreviation: HTML.
        ref and REFERENCE should be ignored.
  
        *[HTML]: HyperText Markup Language
      `,
      config
    );
    expect(contents).toMatchSnapshot();
  });

  it.skip(`${configName} renders references`, () => {
    const contents = micromarkAbbr(
      dedent`
        This is a link abbreviation: [REF](http://example.com).
  
        *[REF]: Reference
      `,
      config
    );
    expect(contents).toMatchSnapshot();
  });
}

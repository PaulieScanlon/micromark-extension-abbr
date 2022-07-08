import dedent from 'dedent';

import { micromark } from 'micromark';
import { directive, directiveHtml } from 'micromark-extension-directive';

import micromarkAbbr from '../../src/index';

it('no-config renders references', () => {
  const contents = micromarkAbbr(
    dedent`
      This is an abbreviation: HTML.

      *[HTML]: HyperText Markup Language
    `
  );

  expect(contents).toMatchSnapshot();
});

it('empty object renders references', () => {
  const contents = micromarkAbbr(
    dedent`
      This is an abbreviation: HTML.

      *[HTML]: HyperText Markup Language
    `,
    {}
  );

  expect(contents).toMatchSnapshot();
});

it('expandFirst renders references', () => {
  const contents = micromarkAbbr(
    dedent`
      This is an abbreviation: HTML.

      *[HTML]: HyperText Markup Language
    `,
    {
      expandFirst: true
    }
  );

  expect(contents).toMatchSnapshot();
});

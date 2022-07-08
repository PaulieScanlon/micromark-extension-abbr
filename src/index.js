import { micromark } from 'micromark';
import { directive, directiveHtml } from 'micromark-extension-directive';

import { fromMarkdown } from 'mdast-util-from-markdown';
import { toMarkdown } from 'mdast-util-to-markdown';

function extension(text, options) {
  const opts = options || {};
  function matchReference(string) {
    return Boolean(string.match(/\[*.*?\]/g));
  }

  function recursiveFindReferences(node) {
    let newNode = node.children;

    if (matchReference(newNode[0].value)) {
      const matchedReferences = newNode[0].value.split(/\r?\n/);

      return matchedReferences.map((ref) => {
        const arr = ref.split(/\r?\:/);
        return {
          ref: arr[0].replace(/[\*\[\]']+/g, ''),
          text: arr[1].replace(/\s/, '')
        };
      });
    }

    if (Array.isArray(newNode)) {
      newNode.forEach((childNode) => {
        if (childNode.children) {
          recursiveFindReferences(childNode);
        }
      });
    }
  }

  function replaceString(node, refs) {
    refs.forEach((stored) => {
      if (node.value.includes(stored.ref)) {
        node.value = node.value.replace(stored.ref, `:abbr[${stored.ref}]{title="${stored.text}"}`);
      }
    });
  }

  function recursiveReplaceReferences(node, refs) {
    let newNode = node.children;
    if (!matchReference(newNode[0].value)) {
      newNode.forEach((item) => {
        if (Array.isArray(item.children)) {
          replaceString(item.children[0], refs);
        } else {
          replaceString(item, refs);
        }
      });

      return newNode;
    }

    if (Array.isArray(newNode)) {
      newNode.forEach((childNode) => {
        if (childNode.children) {
          recursiveReplaceReferences(childNode, refs);
        }
      });
    }
  }

  function transformer() {
    const storedReferences = fromMarkdown(text)
      .children.map((node) => recursiveFindReferences(node))
      .filter(Boolean)
      .flat();

    const AST = {
      type: 'root',
      children: fromMarkdown(text)
        .children.map((node) => recursiveReplaceReferences(node, storedReferences))
        .filter(Boolean)
        .flat()
    };

    const MD = toMarkdown(AST);

    // https://github.com/micromark/micromark-extension-directive#use
    function abbr(d) {
      if (d.type !== 'textDirective') return false;

      this.tag('<abbr');

      if (d.attributes && 'title' in d.attributes) {
        this.tag(' title="' + this.encode(d.attributes.title) + '"');
      }

      this.tag('>');
      this.raw(d.label || '');
      this.tag('</abbr>');
    }

    const HTML = micromark(MD, {
      ...opts,
      extensions: [directive()],
      htmlExtensions: [directiveHtml({ abbr })]
    });

    return HTML;
  }

  return transformer();
}

export default extension;

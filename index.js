'use strict';
var prefix = 'mathjax-';
var divIndex = 0;
require('./lib/polyfills');
function inlineParser(state, silent) {
  var content,
      token,
      found = false,
      max = state.posMax,
      start = state.pos,
      open = '$$',
      close = '$$';

  if (state.src.slice(state.pos, state.pos + open.length) !== open) {
    return false;
  }
  if (silent) {
    return false;
  } // don't run any pairs in validation mode
  if (start + open.length >= max) {
    return false;
  }

  state.pos = start + open.length;

  while (state.pos < max) {
    if (state.src.slice(state.pos, state.pos + close.length) === close) {
      found = true;
      break;
    }
    state.md.inline.skipToken(state);
  }

  if (!found) {
    state.pos = start;
    return false;
  }

  content = state.src.slice(start + open.length, state.pos);

  if (content.indexOf('\n') > -1) {
    state.pos = start;
    return false;
  }

  // found!
  state.posMax = state.pos;
  state.pos = start + open.length;

  // Earlier we checked !silent, but this implementation does not need it
  token         = state.push('math_inline', 'math', 0);
  token.content = content;
  state.pos = state.posMax + close.length;
  state.posMax = max;
  return true;
}

function blockParser(state, startLine, endLine, silent) {
  var params, nextLine, token,
      haveEndMarker = false,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      open = '$$\n',
      close = '$$\n';

  /* need enough room for full sequence:
  $$                startLine
  \begin{aligned}
  \end{aligned}
  $$                endLine = startLine + 3
  */
  if (endLine <= startLine + 3 || state.src.slice(pos, pos + open.length) !== open) {
    return false;
  }

  // Since start is found, we can report success here in validation mode
  if (silent) { return true; }

  // search end of block
  nextLine = startLine;

  for (;;) {
    if (haveEndMarker) {
      break;
    }

    nextLine++;

    if (nextLine > endLine) {
      // unclosed block is not valid
      return false;
    }

    pos = state.bMarks[nextLine] + state.tShift[nextLine];

    // on last line, pattern may end without newline
    if (nextLine === endLine) {
      if (state.src.slice(pos - close.trim().length, pos) !== close.trim()) {
        return false;
      }
    } else if (state.src.slice(pos, pos + close.length) !== close) {
      // max + 1 to grab newline character
      continue;
    }

    pos += pos + close.length;

    // make sure tail has spaces only
    pos = state.skipSpaces(pos);

    // found!
    haveEndMarker = true;
  }

  state.line = nextLine + (haveEndMarker ? 1 : 0);
  token = state.push('math_block', 'math', 0);
  token.block = true;
  token.content = state.getLines(startLine + 1, nextLine, 0, true);
  token.info = params;
  token.map = [ startLine, state.line ];
  token.markup = open;
  return true;
}

function makeInlineMathRenderer(suffix) {
  return function(tokens, idx) {
    return '<span id="' + prefix + divIndex++ + suffix +
     '" class="math inline">' + tokens[idx].content + '</span>';
  };
}

function makeBlockMathRenderer(suffix) {
  return function(tokens, idx) {
    return '<span id="' + prefix + divIndex++ + suffix +
     '" class="math block">' + tokens[idx].content + '</span>';
  };
}

module.exports = function math_plugin(md, suffix) {
  divIndex = 0;
  // Default options
  md.inline.ruler.before('escape', 'math_inline', inlineParser);
  md.block.ruler.after('blockquote', 'math_block', blockParser, {
    alt: [ 'paragraph', 'reference', 'blockquote', 'list' ]
  });
  md.renderer.rules.math_inline = makeInlineMathRenderer(suffix);
  md.renderer.rules.math_block = makeBlockMathRenderer(suffix);
};

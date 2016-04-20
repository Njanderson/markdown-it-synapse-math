"use strict";

var assert = require('assert');

describe('Parser', function() {
  it('should pass basic inline rendering', function() {
    var md = require('markdown-it')()
          .use(require('../'), 'test');
    var res1 = md.render('$$\(1+1=2\)$$');
    assert.equal(res1, '<p><span id=\"mathjax-0test\" class=\"math\">(1+1=2)</span></p>\n');
  });
  it('should pass basic inline rendering with single markers', function() {
    var md = require('markdown-it')()
          .use(require('../'), 'test');
    var res1 = md.render('$\(1+1=2\)$');
    assert.equal(res1, '<p><span id=\"mathjax-0test\" class=\"math\">(1+1=2)</span></p>\n');
  });
  it('should pass inline rendering with adjacent inline rendering', function() {
    var md = require('markdown-it')()
          .use(require('../'), 'test');
    var res1 = md.render('$$\(1+1=2\)$$$$\(1+1=2\)$$');
    assert.equal(res1, '<p><span id=\"mathjax-0test\" class=\"math\">(1+1=2)</span><span id=\"mathjax-1test\" class=\"math\">(1+1=2)</span></p>\n');
  });
  it('should pass inline rendering with adjacent text', function() {
    var md = require('markdown-it')()
          .use(require('../'), 'test');
    var res1 = md.render('1+1=2$$\(1+1=2\)$$1+1=2');
    assert.equal(res1, '<p>1+1=2<span id=\"mathjax-0test\" class=\"math\">(1+1=2)</span>1+1=2</p>\n');
  });
  it('should pass inline rendering with prior different markdown', function() {
    var md = require('markdown-it')()
          .use(require('../'), 'test');
    var res1 = md.render('_text above_\n$$\(1+1=2\)$$');
    assert.equal(res1, '<p><em>text above</em>\n<span id=\"mathjax-0test\" class=\"math\">(1+1=2)</span></p>\n');
  });
  it('should pass basic block rendering', function() {
    var md = require('markdown-it')()
          .use(require('../'), 'test');

    var res1 = md.render('$$\n\begin{aligned}\n\end{aligned}\n$$\n');
    assert.equal(res1, '<span id=\"mathjax-0test\" class=\"math\">\begin{aligned}\nend{aligned}\n</span>');
  });
  it('should fail if block is too few lines', function() {
    var md = require('markdown-it')()
          .use(require('../'), 'test');
    // if there isn't room for \end{aligned} on a newline, it won't be rendered
    // properly by MathJax
    var res1 = md.render('$$\n\\begin{aligned}\n$$\n');
    assert.equal(res1, '<p>$$\n\\begin{aligned}\n$$</p>\n');
  });
  it('should fail if block is not closed', function() {
    var md = require('markdown-it')()
          .use(require('../'), 'test');
    var res1 = md.render('$$\n\\begin{aligned}\n\end{aligned}\n');
    assert.equal(res1, '<p>$$\n\\begin{aligned}\nend{aligned}</p>\n');
  });
  it('should pass if block is closed but without a newline', function() {
    var md = require('markdown-it')()
          .use(require('../'), 'test');
    var res1 = md.render('$$\n\begin{aligned}\n\end{aligned}\n$$');
    assert.equal(res1, '<span id=\"mathjax-0test\" class=\"math\">\begin{aligned}\nend{aligned}\n</span>');
  });
  it('should pass block rendering and end previous block level tokens', function() {
    var md = require('markdown-it')()
          .use(require('../'), 'test');
    var res1 = md.render('_text above_\n$$\n\begin{aligned}\n\end{aligned}\n$$');
    // should pass on the '\begin{aligned}\nend{aligned}\n' to the MathJax library, as it uses this for creating block level
    assert.equal(res1, '<p><em>text above</em></p>\n<span id=\"mathjax-0test\" class=\"math\">\begin{aligned}\nend{aligned}\n</span>');
  });
  it('should not attempt to process synapse widgets', function() {
    var md = require('markdown-it')()
          .use(require('../'), 'test');
    var res1 = md.render('${reference?text=a} ${reference?text=b} ${reference?text=c}');
    assert.equal(res1, '<p>${reference?text=a} ${reference?text=b} ${reference?text=c}</p>\n');
  });
});
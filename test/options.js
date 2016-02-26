"use strict";

var assert = require('assert');

describe('Parser', function() {
  it('Should pass basic inline rendering', function() {
    var md = require('markdown-it')()
          .use(require('../'), 'test');
    var res1 = md.render('$$\(1+1=2\)$$');
    assert.equal(res1, '<p><span id=\"mathjax-0test\" class=\"math inline\">(1+1=2)</span></p>\n');
  });
  it('Should pass inline rendering with adjacent inline rendering', function() {
    var md = require('markdown-it')()
          .use(require('../'), 'test');
    var res1 = md.render('$$\(1+1=2\)$$$$\(1+1=2\)$$');
    assert.equal(res1, '<p><span id=\"mathjax-0test\" class=\"math inline\">(1+1=2)</span><span id=\"mathjax-1test\" class=\"math inline\">(1+1=2)</span></p>\n');
  });
  it('Should pass inline rendering with adjacent text', function() {
    var md = require('markdown-it')()
          .use(require('../'), 'test');
    var res1 = md.render('1+1=2$$\(1+1=2\)$$1+1=2');
    assert.equal(res1, '<p>1+1=2<span id=\"mathjax-0test\" class=\"math inline\">(1+1=2)</span>1+1=2</p>\n');
  });
  it('Should pass basic block rendering', function() {
    var md = require('markdown-it')()
          .use(require('../'), 'test');

    var res1 = md.render('$$\n\begin{aligned}\n\end{aligned}\n$$\n');
    assert.equal(res1, '<span id=\"mathjax-0test\" class=\"math block\">\begin{aligned}\nend{aligned}\n</span>');
  });
  it('Should fail if block is too few lines', function() {
    var md = require('markdown-it')()
          .use(require('../'), 'test');
    // if there isn't room for \end{aligned} on a newline, it won't be rendered
    // properly by MathJax
    var res1 = md.render('$$\n\\begin{aligned}\n$$\n');
    assert.equal(res1, '<p>$$\n\\begin{aligned}\n$$</p>\n');
  });
  it('Should fail if block is not closed', function() {
    var md = require('markdown-it')()
          .use(require('../'), 'test');
    var res1 = md.render('$$\n\\begin{aligned}\n\end{aligned}\n');
    assert.equal(res1, '<p>$$\n\\begin{aligned}\nend{aligned}</p>\n');
  });
  it('Should pass if block is closed but without a newline', function() {
    var md = require('markdown-it')()
          .use(require('../'), 'test');
    var res1 = md.render('$$\n\begin{aligned}\n\end{aligned}\n$$');
    assert.equal(res1, '<span id=\"mathjax-0test\" class=\"math block\">\begin{aligned}\nend{aligned}\n$$</span>');
  });
});
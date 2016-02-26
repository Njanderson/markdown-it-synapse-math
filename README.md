markdown-it-synapse-math
================
Based very loosely on markdown-it-math for integration with Synapse and our MathJax workflow.

```md
Pythagoran theorem is $$/(a^2 + b^2 = c^2/)$$ will render to:
```
```TeX
a^2 + b^2 = c^2
```
```md
Bayes theorem:

$$
\begin{aligned}
P(A | B) = (P(B | A)P(A)) / P(B)
\end{aligned}
$$

will render to a block with:
```
```TeX
P(A | B) = (P(B | A)P(A)) / P(B)
```

Installation
------------

```sh
npm install
```

Usage
-----

```javascript
var md = require('markdown-it')()
        .use(require('markdown-it-math'), suffix);
// rendering relies on suffix for MathJax to be pointed to the correct DOM elements
```

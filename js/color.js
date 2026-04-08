/**
 * color.js - Java Syntax Highlighter
 * Highlights code inside .code-block elements
 */

(function () {
    'use strict';

    // Java keywords
    const KEYWORDS = [
        'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch',
        'char', 'class', 'const', 'continue', 'default', 'do', 'double',
        'else', 'enum', 'extends', 'final', 'finally', 'float', 'for',
        'goto', 'if', 'implements', 'import', 'instanceof', 'int', 'interface',
        'long', 'native', 'new', 'null', 'package', 'private', 'protected',
        'public', 'return', 'short', 'static', 'strictfp', 'super', 'switch',
        'synchronized', 'this', 'throw', 'throws', 'transient', 'try', 'void',
        'volatile', 'while', 'true', 'false', 'var', 'record', 'sealed',
        'permits', 'yield'
    ];

    // Built-in types and common classes
    const TYPES = [
        'String', 'Integer', 'Double', 'Float', 'Long', 'Short', 'Byte',
        'Character', 'Boolean', 'Object', 'System', 'Math', 'Array',
        'ArrayList', 'HashMap', 'HashSet', 'LinkedList', 'Scanner',
        'StringBuilder', 'StringBuffer', 'Exception', 'RuntimeException',
        'NullPointerException', 'NumberFormatException', 'Thread', 'Runnable',
        'Comparable', 'Iterable', 'Iterator', 'List', 'Map', 'Set',
        'Collection', 'Collections', 'Arrays', 'Optional', 'Stream'
    ];

    /**
     * Escape HTML special chars before highlighting
     */
    function escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    /**
     * Main highlight function - processes one line at a time
     */
    function highlight(code) {
        // Split into lines to handle each line safely
        const lines = code.split('\n');
        const result = lines.map(line => highlightLine(line));
        return result.join('\n');
    }

    function highlightLine(line) {
        // 1. Single-line comment  //...
        const commentIdx = findCommentStart(line);
        let codePart = commentIdx === -1 ? line : line.slice(0, commentIdx);
        let commentPart = commentIdx === -1 ? '' : line.slice(commentIdx);

        // Process code part token by token
        codePart = highlightCode(codePart);

        // Wrap comment
        if (commentPart) {
            commentPart = '<span class="comment">' + escapeHtml(commentPart) + '</span>';
        }

        return codePart + commentPart;
    }

    /**
     * Find // comment start index, ignoring // inside strings
     */
    function findCommentStart(line) {
        let inString = false;
        let inChar = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"' && !inChar) inString = !inString;
            else if (ch === "'" && !inString) inChar = !inChar;
            else if (!inString && !inChar && ch === '/' && line[i + 1] === '/') {
                return i;
            }
        }
        return -1;
    }

    /**
     * Highlight code tokens: strings, chars, numbers, keywords, types, methods
     */
    function highlightCode(code) {
        let result = '';
        let i = 0;

        while (i < code.length) {
            // String literal "..."
            if (code[i] === '"') {
                let j = i + 1;
                while (j < code.length) {
                    if (code[j] === '\\') { j += 2; continue; }
                    if (code[j] === '"') { j++; break; }
                    j++;
                }
                result += '<span class="string">' + escapeHtml(code.slice(i, j)) + '</span>';
                i = j;
                continue;
            }

            // Char literal '.'
            if (code[i] === "'") {
                let j = i + 1;
                while (j < code.length) {
                    if (code[j] === '\\') { j += 2; continue; }
                    if (code[j] === "'") { j++; break; }
                    j++;
                }
                result += '<span class="string">' + escapeHtml(code.slice(i, j)) + '</span>';
                i = j;
                continue;
            }

            // Number  (digits, decimals, hex 0x..., long suffix L/l, float f/d)
            if (/[0-9]/.test(code[i]) ||
                (code[i] === '.' && /[0-9]/.test(code[i + 1] || ''))) {
                let j = i;
                // hex
                if (code[i] === '0' && (code[i + 1] === 'x' || code[i + 1] === 'X')) {
                    j += 2;
                    while (j < code.length && /[0-9a-fA-F_]/.test(code[j])) j++;
                } else {
                    while (j < code.length && /[0-9_]/.test(code[j])) j++;
                    if (code[j] === '.') {
                        j++;
                        while (j < code.length && /[0-9_]/.test(code[j])) j++;
                    }
                    if (/[eE]/.test(code[j])) {
                        j++;
                        if (/[+\-]/.test(code[j])) j++;
                        while (j < code.length && /[0-9]/.test(code[j])) j++;
                    }
                    if (/[fFdDlL]/.test(code[j])) j++;
                }
                result += '<span class="number">' + escapeHtml(code.slice(i, j)) + '</span>';
                i = j;
                continue;
            }

            // Word (identifier / keyword / type / method)
            if (/[a-zA-Z_$]/.test(code[i])) {
                let j = i;
                while (j < code.length && /[a-zA-Z0-9_$]/.test(code[j])) j++;
                const word = code.slice(i, j);

                // Look ahead: method call?
                let lookahead = j;
                while (lookahead < code.length && code[lookahead] === ' ') lookahead++;
                const isMethod = code[lookahead] === '(';

                if (KEYWORDS.includes(word)) {
                    result += '<span class="keyword">' + escapeHtml(word) + '</span>';
                } else if (TYPES.includes(word)) {
                    result += '<span class="type">' + escapeHtml(word) + '</span>';
                } else if (isMethod) {
                    result += '<span class="method">' + escapeHtml(word) + '</span>';
                } else if (/^[A-Z]/.test(word)) {
                    // PascalCase = class name
                    result += '<span class="class-name">' + escapeHtml(word) + '</span>';
                } else {
                    result += '<span class="variable">' + escapeHtml(word) + '</span>';
                }
                i = j;
                continue;
            }

            // Operators  + - * / % = ! < > & | ^ ~ ? :
            if (/[+\-*/%=!<>&|^~?:]/.test(code[i])) {
                // Grab multi-char operators: ==, !=, <=, >=, &&, ||, ++, --, ->, =>
                let op = code[i];
                const next = code[i + 1] || '';
                if ((op === '=' && next === '=') ||
                    (op === '!' && next === '=') ||
                    (op === '<' && next === '=') ||
                    (op === '>' && next === '=') ||
                    (op === '&' && next === '&') ||
                    (op === '|' && next === '|') ||
                    (op === '+' && next === '+') ||
                    (op === '-' && next === '-') ||
                    (op === '-' && next === '>') ||
                    (op === '=' && next === '>')) {
                    op = op + next;
                    i++;
                }
                result += '<span class="operator">' + escapeHtml(op) + '</span>';
                i++;
                continue;
            }

            // Punctuation  { } ( ) [ ] ; , .
            if (/[{}()[\];,.]/.test(code[i])) {
                result += '<span class="punctuation">' + escapeHtml(code[i]) + '</span>';
                i++;
                continue;
            }

            // Anything else (spaces, tabs, etc.) — escape & output as-is
            result += escapeHtml(code[i]);
            i++;
        }

        return result;
    }

    /**
     * Process all .code-block elements on the page
     */
    function highlightAll() {
        const blocks = document.querySelectorAll('.code-block code');

        blocks.forEach(function (block) {
            // Skip if already highlighted
            if (block.dataset.highlighted) return;

            // Get raw text (not innerHTML — avoids double-escaping)
            const raw = block.textContent || block.innerText;

            // Highlight and set
            block.innerHTML = highlight(raw);
            block.dataset.highlighted = 'true';
        });
    }

    /**
     * Wire up copy buttons
     */
    function initCopyButtons() {
        document.querySelectorAll('.code-copy').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const block = this.closest('.code-block');
                if (!block) return;
                const code = block.querySelector('code');
                if (!code) return;

                const text = code.textContent || code.innerText;
                navigator.clipboard.writeText(text).then(() => {
                    const orig = this.textContent;
                    this.textContent = '✓ Copied!';
                    this.style.color = '#00ff88';
                    setTimeout(() => {
                        this.textContent = orig;
                        this.style.color = '';
                    }, 2000);
                }).catch(() => {
                    this.textContent = 'Failed';
                    setTimeout(() => { this.textContent = 'Copy'; }, 2000);
                });
            });
        });
    }

    /**
     * Init
     */
    function init() {
        highlightAll();
        initCopyButtons();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
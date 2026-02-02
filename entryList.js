document.addEventListener('DOMContentLoaded', function() {

    // Use Marked + highlight.js if available, with custom ::: block support
    marked.setOptions({
        highlight: function(code, lang) {
            if (window.hljs && lang && hljs.getLanguage(lang)) {
                return hljs.highlight(code, { language: lang }).value;
            }
            if (window.hljs) {
                return hljs.highlightAuto(code).value;
            }
            return code;
        }
    });

    marked.use({
        extensions: [
            {
                name: 'warning',
                level: 'block',
                start(src) { return src.match(/:::/)?.index; },
                tokenizer(src) {
                    const rule = /^:::warning\s+([\s\S]+?):::/;
                    const match = rule.exec(src);
                    if (match) {
                        return {
                            type: 'warning',
                            raw: match[0],
                            text: match[1].trim(),
                            tokens: this.lexer.inlineTokens(match[1].trim()),
                        };
                    }
                },
                renderer(token) {
                    return `<div class="warning-block">${marked.parser(token.tokens)}</div>`;
                }
            },
            {
                name: 'info',
                level: 'block',
                start(src) { return src.match(/:::/)?.index; },
                tokenizer(src) {
                    const rule = /^:::info\s+([\s\S]+?):::/;
                    const match = rule.exec(src);
                    if (match) {
                        return {
                            type: 'info',
                            raw: match[0],
                            text: match[1].trim(),
                            tokens: this.lexer.inlineTokens(match[1].trim()),
                        };
                    }
                },
                renderer(token) {
                    return `<div class="info-block">${marked.parser(token.tokens)}</div>`;
                }
            }
        ]
    });

    // Get config from window or set defaults
    const config = window.entryConfig || {
        type: "notes",
        list: [],
        backLabel: "Notes",
        backLink: "/notes"
    };

    const entryList = document.getElementById('entry-list');
    const content = document.getElementById('content');

    // Make sure containers exist
    if (!entryList || !content) {
        console.error("Missing #entry-list or #content");
        return;
    }

    // Build list
    const ul = document.createElement('ul');
    config.list.forEach(item => {
        const li = document.createElement('li');
        li.className = 'entry-item';

        const span = document.createElement('span');
        const a = document.createElement('a');
        a.className = 'list-link';
        a.href = '#';
        a.textContent = item.title;
        a.onclick = (e) => {
            e.preventDefault();
            loadEntry(item.file);
        };
        span.appendChild(a);

        const metaDiv = document.createElement('div');
        metaDiv.className = 'entry-meta';
        const dateSpan = document.createElement('span');
        dateSpan.className = 'entry-date';
        dateSpan.textContent = item.date;
        metaDiv.appendChild(dateSpan);

        li.appendChild(span);
        li.appendChild(metaDiv);
        ul.appendChild(li);
    });
    entryList.appendChild(ul);

    async function loadEntry(file) {
        const response = await fetch(file);
        const markdown = await response.text();
        content.innerHTML = `<h1><a href="${config.backLink}" class="back-link">${config.backLabel}</a></h1>` + marked.parse(markdown);
        document.querySelectorAll('pre code').forEach(block => {
            if (window.hljs) hljs.highlightElement(block);
        });
    }
});

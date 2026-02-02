document.addEventListener('DOMContentLoaded', function() {
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

    // Add ::: block extensions
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

    const logs = [
        { title: 'MCUs & MPUs: RP2040-Zero', file: 'rp2040zero.md', date: 'Feb 1st, 2026' },
    ];

    const logList = document.getElementById('log-list');
    const content = document.getElementById('content');

    // Create timeline list
    const ul = document.createElement('ul');
    logs.forEach(log => {
        const li = document.createElement('li');
        li.className = 'entry-item';

        const span = document.createElement('span');
        const a = document.createElement('a');
        a.className = 'list-link';
        a.href = '#';
        a.textContent = log.title;
        a.onclick = (e) => {
            e.preventDefault();
            loadLog(log.file);
        };
        span.appendChild(a);

        const metaDiv = document.createElement('div');
        metaDiv.className = 'entry-meta';
        const dateSpan = document.createElement('span');
        dateSpan.className = 'entry-date';
        dateSpan.textContent = log.date;
        metaDiv.appendChild(dateSpan);

        li.appendChild(span);
        li.appendChild(metaDiv);
        ul.appendChild(li);
    });
    noteList.appendChild(ul);

    async function loadLog(file) {
        const response = await fetch(file);
        const markdown = await response.text();
        content.innerHTML = '<h1><a href="/logs" class="back-link">Logs</a></h1>' + marked.parse(markdown);
        // Highlight code blocks after HTML
        document.querySelectorAll('pre code').forEach(block => {
            if (window.hljs) hljs.highlightElement(block);
        })
    }
});

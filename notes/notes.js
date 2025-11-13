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

    const notes = [
        { title: 'Arch STM32 Guide', file: 'archstm32.md', date: 'August 8th, 2024' },
        { title: 'Arm GIC Enabler', file: 'armgicenabler.md', date: 'August 11th, 2024' },
        { title: 'BeagleBone Quick Build', file: 'bbb_quickbuild.md', date: 'March 2nd, 2025' },
        { title: 'STM32 - MPU-6050', file: 'stm32mpu-6050.md', date: 'March 2nd, 2025' },
        { title: 'BeagleBone Black BusyBox', file: 'busyboxrfs.md', date: 'June 6th, 2024' },
        { title: 'C - Function Pointers', file: 'funcptrs.md', date: 'June 15th, 2024' },
        { title: 'sed Quick Reference', file: 'sed.md', date: 'June 15th, 2024' },
        { title: 'Sysfs Kernel Programming', file: 'sysfs.md', date: 'June 15th, 2024' },
        { title: 'SVN Quick Reference', file: 'svn.md', date: 'August 4th, 2023' },
        { title: 'Stack Growth Direction', file: 'stackdirection.md', date: 'August 4th, 2023' },
        { title: 'Baremetal Arm QEMU', file: 'qemu_baremetal.md', date: 'August 4th, 2023' },
    ];

    const noteList = document.getElementById('note-list');
    const content = document.getElementById('content');

    // Create timeline list
    const ul = document.createElement('ul');
    notes.forEach(note => {
        const li = document.createElement('li');
        li.className = 'entry-item';

        const span = document.createElement('span');
        const a = document.createElement('a');
        a.className = 'list-link';
        a.href = '#';
        a.textContent = note.title;
        a.onclick = (e) => {
            e.preventDefault();
            loadNote(note.file);
        };
        span.appendChild(a);

        const metaDiv = document.createElement('div');
        metaDiv.className = 'entry-meta';
        const dateSpan = document.createElement('span');
        dateSpan.className = 'entry-date';
        dateSpan.textContent = note.date;
        metaDiv.appendChild(dateSpan);

        li.appendChild(span);
        li.appendChild(metaDiv);
        ul.appendChild(li);
    });
    noteList.appendChild(ul);

    async function loadNote(file) {
        const response = await fetch(file);
        const markdown = await response.text();
        content.innerHTML = '<h1><a href="/notes" class="back-link">Notes</a></h1>' + marked.parse(markdown);

        // Highlight code blocks after HTML
        document.querySelectorAll('pre code').forEach(block => {
            if (window.hljs) hljs.highlightElement(block);
        })
    }
});

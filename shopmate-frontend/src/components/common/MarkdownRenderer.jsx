import React from 'react';

/**
 * Format inline markdown tokens:
 * - Code: `code`
 * - Bold + Italic: ***text***
 * - Bold: **text**
 * - Italic: *text*
 */
const renderInline = (text) => {
  if (!text) return null;

  // Split by inline code backticks first
  const codeSegments = text.split(/(`[^`]+`)/g);

  return codeSegments.map((segment, segIdx) => {
    if (segment.startsWith('`') && segment.endsWith('`') && segment.length >= 2) {
      return (
        <code
          key={segIdx}
          className="px-1.5 py-0.5 rounded bg-ivory-200 dark:bg-charcoal-700 font-mono text-[11px] text-sage-800 dark:text-sage-300 font-medium"
        >
          {segment.slice(1, -1)}
        </code>
      );
    }

    // Parse bold & italic tokens
    const regex = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*)/g;
    const parts = segment.split(regex);

    return parts.map((part, partIdx) => {
      const key = `${segIdx}-${partIdx}`;

      // Bold + Italic: ***text***
      if (part.startsWith('***') && part.endsWith('***') && part.length >= 6) {
        return (
          <strong key={key} className="font-bold text-charcoal-900 dark:text-white">
            <em className="italic">{part.slice(3, -3)}</em>
          </strong>
        );
      }

      // Bold: **text**
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        return (
          <strong key={key} className="font-bold text-charcoal-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }

      // Italic: *text*
      if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
        return (
          <em key={key} className="italic text-charcoal-700 dark:text-charcoal-200">
            {part.slice(1, -1)}
          </em>
        );
      }

      return part;
    });
  });
};

/**
 * Robust, lightweight Markdown Block Renderer
 * Supports:
 * - Headings: #, ##, ###
 * - Tables: | col1 | col2 |
 * - Lists: - item, * item, 1. item
 * - Blockquotes: > quote
 * - Paragraphs
 */
export const MarkdownRenderer = ({ content, className = '' }) => {
  if (!content) return null;

  const lines = String(content).split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // 1. Empty lines -> spacing
    if (!line) {
      elements.push(<div key={`empty-${i}`} className="h-2" />);
      i++;
      continue;
    }

    // 2. Headings
    if (line.startsWith('### ')) {
      elements.push(
        <h3
          key={`h3-${i}`}
          className="text-sm font-bold text-charcoal-900 dark:text-white mt-3 mb-1.5 flex items-center gap-1.5"
        >
          {renderInline(line.slice(4))}
        </h3>
      );
      i++;
      continue;
    }

    if (line.startsWith('## ')) {
      elements.push(
        <h2
          key={`h2-${i}`}
          className="text-base font-bold text-charcoal-900 dark:text-white mt-3 mb-2"
        >
          {renderInline(line.slice(3))}
        </h2>
      );
      i++;
      continue;
    }

    if (line.startsWith('# ')) {
      elements.push(
        <h1
          key={`h1-${i}`}
          className="text-lg font-extrabold text-charcoal-900 dark:text-white mt-3 mb-2"
        >
          {renderInline(line.slice(2))}
        </h1>
      );
      i++;
      continue;
    }

    // 3. Blockquotes
    if (line.startsWith('> ')) {
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="border-l-2 border-sage-500 pl-3 my-2 text-xs italic text-charcoal-600 dark:text-charcoal-300"
        >
          {renderInline(line.slice(2))}
        </blockquote>
      );
      i++;
      continue;
    }

    // 4. Tables: Lines containing '|'
    if (line.startsWith('|') && line.endsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerCols = tableLines[0]
          .split('|')
          .slice(1, -1)
          .map((c) => c.trim());

        // Line 1 is usually separator: | :--- | :--- |
        const startRowIdx = tableLines[1].includes('---') ? 2 : 1;
        const rowData = tableLines.slice(startRowIdx).map((rowLine) =>
          rowLine
            .split('|')
            .slice(1, -1)
            .map((c) => c.trim())
        );

        elements.push(
          <div
            key={`table-${i}`}
            className="overflow-x-auto my-3 rounded-xl border border-taupe-200 dark:border-charcoal-700 shadow-sm"
          >
            <table className="min-w-full divide-y divide-taupe-200 dark:divide-charcoal-700 text-xs">
              <thead className="bg-ivory-100 dark:bg-charcoal-800">
                <tr>
                  {headerCols.map((h, hIdx) => (
                    <th
                      key={hIdx}
                      className="px-3 py-2 text-left font-bold text-charcoal-900 dark:text-white tracking-wider"
                    >
                      {renderInline(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-taupe-100 dark:divide-charcoal-700/60 bg-white dark:bg-charcoal-800/50">
                {rowData.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="hover:bg-ivory-50/50 dark:hover:bg-charcoal-700/30 transition-colors"
                  >
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className="px-3 py-2 text-charcoal-700 dark:text-charcoal-200 whitespace-nowrap"
                      >
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // 5. Unordered List Items: line starts with - or * or •
    const bulletMatch = line.match(/^[-*•]\s+(.*)$/);
    if (bulletMatch) {
      const listItems = [];
      while (i < lines.length) {
        const itemLine = lines[i].trim();
        const itemMatch = itemLine.match(/^[-*•]\s+(.*)$/);
        if (!itemMatch) break;
        listItems.push(itemMatch[1]);
        i++;
      }

      elements.push(
        <ul key={`ul-${i}`} className="my-1.5 space-y-1">
          {listItems.map((item, itemIdx) => (
            <li
              key={itemIdx}
              className="flex items-start gap-2 text-xs sm:text-sm text-charcoal-700 dark:text-charcoal-200"
            >
              <span className="text-sage-600 dark:text-sage-400 font-bold shrink-0 mt-0.5">•</span>
              <span className="leading-relaxed">{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 6. Ordered List Items: line starts with 1. or 2.
    const numMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      const listItems = [];
      while (i < lines.length) {
        const itemLine = lines[i].trim();
        const itemMatch = itemLine.match(/^(\d+)\.\s+(.*)$/);
        if (!itemMatch) break;
        listItems.push({ num: itemMatch[1], text: itemMatch[2] });
        i++;
      }

      elements.push(
        <ol key={`ol-${i}`} className="my-1.5 space-y-1">
          {listItems.map((item, itemIdx) => (
            <li
              key={itemIdx}
              className="flex items-start gap-2 text-xs sm:text-sm text-charcoal-700 dark:text-charcoal-200"
            >
              <span className="text-sage-700 dark:text-sage-300 font-bold shrink-0 text-xs mt-0.5">
                {item.num}.
              </span>
              <span className="leading-relaxed">{renderInline(item.text)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 7. Regular paragraph text
    elements.push(
      <p
        key={`p-${i}`}
        className="text-xs sm:text-sm leading-relaxed text-charcoal-800 dark:text-charcoal-100"
      >
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return <div className={`space-y-1 text-left ${className}`}>{elements}</div>;
};

export default MarkdownRenderer;

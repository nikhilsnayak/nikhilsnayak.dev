'use client';

import { useEffect } from 'react';

import { NAME_MARK_GLYPHS } from '~/lib/constants';

let printed = false;

function buildMark() {
  return Array.from({ length: 7 }, (_, row) =>
    NAME_MARK_GLYPHS.map((letter) =>
      (letter[row] ?? '00000')
        .split('')
        .map((dot) => (dot === '1' ? '██' : '  '))
        .join(''),
    ).join('  '),
  ).join('\n');
}

export function ConsoleSignature() {
  useEffect(() => {
    if (printed) return;
    printed = true;

    const mark = 'font-family:monospace;line-height:1;color:#a1a1aa';
    const accent = 'font-family:monospace;line-height:1;color:#e52b35';

    console.log(`%c${buildMark()}%c  ██`, mark, accent);
  }, []);

  return null;
}

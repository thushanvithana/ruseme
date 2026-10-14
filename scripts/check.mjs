import { readdir, readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { root } from './build.mjs';

let failures = 0;
for (const name of await readdir(path.join(root, 'src/pages'))) {
  const html = await readFile(path.join(root, 'src/pages', name), 'utf8');
  if (/<style\b/i.test(html)) { console.error(`${name}: inline stylesheet`); failures++; }
  for (const match of html.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)) {
    const url = match[1];
    if (/^(?:[a-z]+:|\/\/|#)/i.test(url) || url.startsWith('forms/')) continue;
    let relative = decodeURIComponent(url.split(/[?#]/)[0]).replace(/^\//, '');
    if (!relative) continue;
    let directory = 'public';
    if (relative.startsWith('assets/css/')) { directory = 'src/styles'; relative = relative.slice(11); }
    else if (relative.startsWith('assets/js/')) { directory = 'src/scripts'; relative = relative.slice(10); }
    else if (relative.endsWith('.html')) directory = 'src/pages';
    try { await access(path.join(root, directory, relative)); }
    catch { console.error(`${name}: missing ${url}`); failures++; }
  }
}
console.log(`Page and asset validation: ${failures} issue(s)`);
process.exitCode = failures ? 1 : 0;

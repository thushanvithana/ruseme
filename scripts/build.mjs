import { cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
export const root = fileURLToPath(new URL('../', import.meta.url));
export async function build() {
  const output = new URL('../dist/', import.meta.url);
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  await cp(new URL('../public/', import.meta.url), output, { recursive: true });
  await cp(new URL('../src/pages/', import.meta.url), output, { recursive: true });
  await cp(new URL('../src/styles/', import.meta.url), new URL('assets/css/', output), { recursive: true });
  await cp(new URL('../src/scripts/', import.meta.url), new URL('assets/js/', output), { recursive: true });
  console.log('Built portfolio into dist/');
}
if (process.argv[1] === fileURLToPath(import.meta.url)) await build();

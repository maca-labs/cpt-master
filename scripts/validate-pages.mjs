import { readFile, access } from 'node:fs/promises';
import assert from 'node:assert/strict';
const root = new URL('../dist-pages/', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');
assert(html.includes('/cpt-master/assets/'), '公開用assetsパスが必要です');
assert(!html.includes('@vite/client'), '開発サーバーのHTMLは公開しません');
const manifest = JSON.parse(await readFile(new URL('manifest.webmanifest', root), 'utf8'));
assert.equal(manifest.start_url, '/cpt-master/');
assert.equal(manifest.scope, '/cpt-master/');
for (const icon of manifest.icons) {
  assert(!icon.src.startsWith('http'), 'アイコンは自サイトのファイルを使用');
  await access(new URL(icon.src.replace(/^\/cpt-master\//, ''), root));
}
const scripts = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map((match) => match[1]);
assert(scripts.length > 0, '公開するアプリのJavaScriptが必要です');
const scriptBodies = await Promise.all(
  scripts.map(async (src) => {
    assert(src.startsWith('/cpt-master/'), 'JavaScriptはプロジェクト配下から読み込みます');
    return readFile(new URL(src.slice('/cpt-master/'.length), root), 'utf8');
  }),
);
const registration =
  scriptBodies.join('\n') +
  (await readFile(new URL('registerSW.js', root), 'utf8').catch(() => ''));
assert(registration.includes('"/cpt-master/sw.js"'), 'アプリのSW登録先を確認');
assert(
  /scope\s*:\s*["']\/cpt-master\/["']/.test(registration),
  'SWのscopeはプロジェクト配下に限定します',
);
const sw = await readFile(new URL('sw.js', root), 'utf8');
assert(sw.includes('index.html'), 'オフライン用indexの保存を確認');
assert(!/["']\/sw\.js["']/.test(registration), 'サイトルートへ誤登録しません');
console.log('GitHub Pages用のassets・manifest・PWAファイル検査に合格');

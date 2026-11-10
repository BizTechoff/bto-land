# Mockup build: inlines the shared head / nav / footer partials into each page (one place per partial)
import pathlib
root = pathlib.Path(__file__).parent
parts = {k: (root / f'_{k}.html').read_text(encoding='utf-8') for k in ('head', 'nav', 'footer')}
for src in root.glob('*.src.html'):
    html = src.read_text(encoding='utf-8')
    for k, v in parts.items():
        html = html.replace(f'<!--@{k}-->', v)
    (root / src.name.replace('.src', '')).write_text(html, encoding='utf-8')
    print('built', src.name.replace('.src', ''))

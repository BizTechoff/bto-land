#!/usr/bin/env python3
# בס"ד
"""
============================================================
Malach HaZchuyot - Architecture Bundler
============================================================

This script reads:
  - architecture/index.html
  - architecture/src/styles.css
  - architecture/src/app.js
  - architecture/src/data/architecture.js

And produces:
  - architecture/dist/architecture.html

A single self-contained HTML file with everything inlined.
Send this file by WhatsApp / email / save anywhere — works offline.

Usage:
  cd architecture/
  python3 build.py

============================================================
"""

import os
import sys
from pathlib import Path

# ------------------------------------------------------------
# Paths
# ------------------------------------------------------------
SCRIPT_DIR = Path(__file__).parent.resolve()
SRC_DIR = SCRIPT_DIR / 'src'
DIST_DIR = SCRIPT_DIR / 'dist'

INDEX_HTML = SCRIPT_DIR / 'index.html'
STYLES_CSS = SRC_DIR / 'styles.css'
DATA_JS = SRC_DIR / 'data' / 'architecture.js'
APP_JS = SRC_DIR / 'app.js'

OUTPUT_HTML = DIST_DIR / 'architecture.html'


def read_file(path):
    """Read a file, fail gracefully with a clear message."""
    if not path.exists():
        print(f"ERROR: File not found: {path}", file=sys.stderr)
        sys.exit(1)
    return path.read_text(encoding='utf-8')


def build():
    print("בס\"ד")
    print("=" * 60)
    print("Malach HaZchuyot - Architecture Bundler")
    print("=" * 60)

    # Read all source files
    print(f"\n[1/5] Reading index.html...")
    html = read_file(INDEX_HTML)

    print(f"[2/5] Reading styles.css ({STYLES_CSS.stat().st_size:,} bytes)...")
    css = read_file(STYLES_CSS)

    print(f"[3/5] Reading data/architecture.js ({DATA_JS.stat().st_size:,} bytes)...")
    data_js = read_file(DATA_JS)

    print(f"[4/5] Reading app.js ({APP_JS.stat().st_size:,} bytes)...")
    app_js = read_file(APP_JS)

    # Inline everything
    print("\n[5/5] Bundling into single HTML...")

    # Replace external CSS link with inline <style>
    css_inline = f'<style>\n{css}\n</style>'
    html = html.replace('<link rel="stylesheet" href="src/styles.css">', css_inline)

    # Replace external script tags with inline scripts
    data_inline = f'<script>\n{data_js}\n</script>'
    app_inline = f'<script>\n{app_js}\n</script>'
    html = html.replace('<script src="src/data/architecture.js"></script>', data_inline)
    html = html.replace('<script src="src/app.js"></script>', app_inline)

    # Ensure dist directory exists
    DIST_DIR.mkdir(parents=True, exist_ok=True)

    # Write output
    OUTPUT_HTML.write_text(html, encoding='utf-8')

    output_size = OUTPUT_HTML.stat().st_size
    print(f"\n✓ Done!")
    print(f"  Output: {OUTPUT_HTML}")
    print(f"  Size:   {output_size:,} bytes ({output_size / 1024:.1f} KB)")
    print(f"\nThe file is self-contained and ready to:")
    print(f"  - Send via WhatsApp / email")
    print(f"  - Upload to any web server")
    print(f"  - Open directly in browser (works offline)")
    print()


if __name__ == '__main__':
    build()

#!/usr/bin/env python3
"""
Script para corrigir beforeEach com 2 argumentos (Jasmine timeout pattern)
"""
import os
import re
from pathlib import Path

def fix_beforeEach_timeout(content):
    """Fix beforeEach with timeout parameter"""

    # Pattern 1: beforeEach(() => { ... }, timeout);
    # Remove the timeout parameter
    content = re.sub(
        r'beforeEach\s*\(\s*\(\s*\)\s*=>\s*\{([^}]*)\}\s*,\s*\d+\s*\)',
        r'beforeEach(() => {\1})',
        content,
        flags=re.DOTALL
    )

    # Pattern 2: beforeEach(async () => { ... }, timeout);
    content = re.sub(
        r'beforeEach\s*\(\s*async\s*\(\s*\)\s*=>\s*\{([^}]*)\}\s*,\s*\d+\s*\)',
        r'beforeEach(async () => {\1})',
        content,
        flags=re.DOTALL
    )

    # Pattern 3: beforeEach(function() { ... }, timeout);
    content = re.sub(
        r'beforeEach\s*\(\s*function\s*\(\s*\)\s*\{([^}]*)\}\s*,\s*\d+\s*\)',
        r'beforeEach(function() {\1})',
        content,
        flags=re.DOTALL
    )

    return content

def process_file(file_path):
    """Process a single spec file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        content = fix_beforeEach_timeout(content)

        if content != original:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"OK {file_path}")
            return True
        return False
    except Exception as e:
        print(f"ERROR processing {file_path}: {e}")
        return False

def main():
    """Main function"""
    src_path = Path('src/app')
    spec_files = list(src_path.glob('**/*.spec.ts'))

    print(f"Scanning {len(spec_files)} spec files...")
    modified = 0

    for spec_file in spec_files:
        if process_file(spec_file):
            modified += 1

    print(f"\nFixed {modified} files with beforeEach timeout issues")

if __name__ == '__main__':
    main()

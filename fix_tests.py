#!/usr/bin/env python3
"""
Script para corrigir parênteses extras em mockReturnValue
"""
import os
import re
from pathlib import Path

def fix_extra_parens(content):
    """Remove extra closing parentheses in mockReturnValue"""

    # Pattern: }))) → }));
    content = content.replace('})));', '}));')

    return content

def process_file(file_path):
    """Process a single spec file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        content = fix_extra_parens(content)

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

    print(f"\nFixed {modified} files with extra parentheses")

if __name__ == '__main__':
    main()

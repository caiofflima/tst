#!/usr/bin/env python3
"""
Script para corrigir erros de sintaxe em testes
"""
import os
import re
from pathlib import Path

def fix_syntax_issues(content):
    """Fix various syntax issues in test files"""

    # 1. Fix .compileComponents()); → .compileComponents();
    content = re.sub(r'\.compileComponents\(\)\);', '.compileComponents();', content)

    # 2. Fix mockReturnValue(of({}) without closing paren
    # Pattern: mockReturnValue(of({}); → mockReturnValue(of({}));
    content = re.sub(r'\.mockReturnValue\(of\(\{\}\);', '.mockReturnValue(of({}));', content)

    # 3. Fix mockReturnValue(of({}))); (extra paren) → mockReturnValue(of({}));
    content = re.sub(r'\.mockReturnValue\(of\(\{\}\)\)\);', '.mockReturnValue(of({}));', content)

    # 4. Fix mockReturnValue(of({})) without semicolon at end of line
    # Only if it's at the end of a line
    content = re.sub(r'\.mockReturnValue\(of\(\{\}\)\)$', '.mockReturnValue(of({}));', content, flags=re.MULTILINE)

    return content

def process_file(file_path):
    """Process a single spec file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        content = fix_syntax_issues(content)

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

    print(f"\nFixed {modified} files with syntax issues")

if __name__ == '__main__':
    main()

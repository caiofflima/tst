#!/usr/bin/env python3
"""
Script para corrigir parênteses faltando em mockReturnValue
"""
import os
import re
from pathlib import Path

def fix_missing_closing_parens(content):
    """Fix missing closing parentheses in various patterns"""

    # Pattern 1: .mockReturnValue(of({...}); → .mockReturnValue(of({...}));
    # This handles cases where the closing ) for mockReturnValue is missing
    content = re.sub(
        r'\.mockReturnValue\(of\(\{[^}]+\}\);',
        lambda m: m.group(0).replace(';', '));'),
        content
    )

    # Pattern 2: .mockReturnValue(of({}); → .mockReturnValue(of({}));
    content = re.sub(
        r'\.mockReturnValue\(of\(\{\}\);',
        '.mockReturnValue(of({}));',
        content
    )

    # Pattern 3: activatedRouteSpy.params.mockReturnValue(of({id: 1});
    # Missing closing paren for of()
    content = re.sub(
        r'\.params\.mockReturnValue\(of\(\{[^}]+\}\);',
        lambda m: m.group(0).replace(';', '));'),
        content
    )

    # Pattern 4: expect.objectContaining({...}); → expect.objectContaining({...}));
    # Missing closing paren for expect.objectContaining
    content = re.sub(
        r'expect\.objectContaining\(\{[^}]+\}\);',
        lambda m: m.group(0).replace(';', '));'),
        content
    )

    return content

def process_file(file_path):
    """Process a single spec file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        content = fix_missing_closing_parens(content)

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

    print(f"\nFixed {modified} files with missing closing parentheses")

if __name__ == '__main__':
    main()

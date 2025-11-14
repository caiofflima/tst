#!/usr/bin/env python3
"""
Script para corrigir duplicatas de jest. e outros problemas
"""
import os
import re
from pathlib import Path

def fix_jest_issues(content):
    """Fix various Jest conversion issues"""

    # 1. Fix jest.jest.jest... duplicates → jest.
    content = re.sub(r'jest\.(?:jest\.)+', 'jest.', content)

    # 2. Fix standalone spyOn → jest.spyOn (but avoid duplicates)
    # Only replace if not already preceded by jest.
    content = re.sub(r'(?<!jest\.)(?<!\.)\bspyOn\(', 'jest.spyOn(', content)

    # 3. Fix beforeEach with async parameter (Jasmine pattern)
    # beforeEach(async () => { ... }, timeout) → beforeEach(async () => { ... })
    # This removes the timeout parameter which is not valid in Jest
    content = re.sub(
        r'beforeEach\(\s*async\s*\(\s*\)\s*=>\s*\{([^}]*)\}\s*,\s*\d+\s*\)',
        r'beforeEach(async () => {\1})',
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
        content = fix_jest_issues(content)

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

    print(f"\nFixed {modified} files with Jest issues")

if __name__ == '__main__':
    main()

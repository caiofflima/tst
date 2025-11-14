#!/usr/bin/env python3
"""
Script para corrigir problemas com spyOn e sintaxe de testes
"""
import os
import re
from pathlib import Path

def fix_test_issues(content):
    """Fix various test issues"""

    # 1. Fix spyOn without jest prefix (but avoid duplicates)
    # Matches: spyOn<any>(obj, 'method') or spyOn(obj, 'method')
    content = re.sub(r'(?<!jest\.)(?<!\.)\bspyOn\b', 'jest.spyOn', content)

    # 2. Fix .and.callThrough() → .mockImplementation()
    # In Jest, callThrough is the default behavior, so we can just remove it
    content = re.sub(r'\.and\.callThrough\(\)', '', content)

    # 3. Fix double closing parentheses in beforeEach
    # beforeEach(() => { ... })); → beforeEach(() => { ... });
    content = re.sub(r'\}\)\);[\s]*$', '});', content, flags=re.MULTILINE)

    # 4. Fix .and.stub() → .mockImplementation(() => {})
    content = re.sub(r'\.and\.stub\(\)', '.mockImplementation(() => {})', content)

    return content

def process_file(file_path):
    """Process a single spec file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        content = fix_test_issues(content)

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

    print(f"\nFixed {modified} files with spyOn issues")

if __name__ == '__main__':
    main()

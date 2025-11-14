#!/usr/bin/env python3
"""
Script para corrigir atribuições diretas de Observable que deveriam usar mockReturnValue
"""
import os
import re
from pathlib import Path

def fix_observable_assignments(content):
    """Fix Observable assignments to use mockReturnValue"""

    # Pattern 1: spy.method = of(...) → spy.method.mockReturnValue(of(...))
    # Example: prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro = of({})
    pattern1 = r'(\w+Spy)\.(\w+)\s*=\s*(of\([^;]+\))'

    def replace_assignment(match):
        spy_name = match.group(1)
        method_name = match.group(2)
        of_call = match.group(3)

        return f'{spy_name}.{method_name}.mockReturnValue({of_call})'

    content = re.sub(pattern1, replace_assignment, content)

    # Pattern 2: spy.method = of(...) for service mocks (not ending in Spy)
    pattern2 = r'(\w+Service(?:Mock|Spy)?)\.(\w+)\s*=\s*(of\([^;]+\))'
    content = re.sub(pattern2, replace_assignment, content)

    return content

def process_file(file_path):
    """Process a single spec file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        content = fix_observable_assignments(content)

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

    print(f"\nFixed {modified} files with Observable assignment errors")

if __name__ == '__main__':
    main()

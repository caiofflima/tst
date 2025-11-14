#!/usr/bin/env python3
"""
Script para converter jasmine.createSpyObj para Jest mocks
"""
import os
import re
from pathlib import Path

def convert_jasmine_to_jest(content):
    """Convert jasmine.createSpyObj to Jest format"""

    # Pattern: const spy = jasmine.createSpyObj('ServiceName', ['method1', 'method2']);
    # Convert to: const spy = { method1: jest.fn(), method2: jest.fn() };

    pattern = r"const\s+(\w+)\s*=\s*jasmine\.createSpyObj\s*\(\s*['\"](\w+)['\"]\s*,\s*\[(.*?)\]\s*\)"

    def replace_spy(match):
        var_name = match.group(1)
        service_name = match.group(2)
        methods_str = match.group(3)

        # Parse methods
        methods = re.findall(r"['\"](\w+)['\"]", methods_str)

        # Build Jest mock object
        jest_methods = ', '.join([f"{method}: jest.fn()" for method in methods])

        return f"const {var_name} = {{ {jest_methods} }}"

    content = re.sub(pattern, replace_spy, content, flags=re.MULTILINE)

    return content

def process_file(file_path):
    """Process a single spec file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        content = convert_jasmine_to_jest(content)

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

    print(f"\nConverted {modified} files from Jasmine to Jest")

if __name__ == '__main__':
    main()

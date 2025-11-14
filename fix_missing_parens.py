#!/usr/bin/env python3
"""
Script para corrigir parênteses faltantes em mockReturnValue
"""
import os
import re
from pathlib import Path

def fix_missing_parens(content):
    """Fix missing closing parens in mockReturnValue"""

    # Pattern: .mockReturnValue(of({}) followed by newline
    # Should be: .mockReturnValue(of({}));
    content = re.sub(
        r'\.mockReturnValue\(of\(\{\}\)\)\s*\n(\s*)([a-zA-Z])',
        r'.mockReturnValue(of({}));\n\1\2',
        content
    )

    # Pattern: .mockReturnValue(of({}) at end of line (no semicolon or closing paren)
    # This handles cases where the line ends without proper closure
    lines = content.split('\n')
    fixed_lines = []

    for line in lines:
        # Check if line has mockReturnValue(of({}) but is missing closing ) or ;
        if '.mockReturnValue(of({}' in line:
            # Count opening and closing parens
            open_count = line.count('(')
            close_count = line.count(')')

            # If we have mockReturnValue(of({}), we need 3 closing parens total
            if '.mockReturnValue(of({})' in line and not line.rstrip().endswith(';'):
                # Needs semicolon
                if line.rstrip().endswith(')'):
                    fixed_lines.append(line.rstrip() + ';')
                else:
                    fixed_lines.append(line)
            elif '.mockReturnValue(of({}' in line and open_count > close_count:
                # Missing closing parens
                missing = open_count - close_count
                fixed_lines.append(line.rstrip() + ')' * missing + ';')
            else:
                fixed_lines.append(line)
        else:
            fixed_lines.append(line)

    return '\n'.join(fixed_lines)

def process_file(file_path):
    """Process a single spec file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        content = fix_missing_parens(content)

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

    print(f"\nFixed {modified} files with missing parentheses")

if __name__ == '__main__':
    main()

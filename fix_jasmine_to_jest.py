#!/usr/bin/env python3
"""
Script para remover chamadas mockReturnValue em Observables
"""
import os
import re
from pathlib import Path

def fix_observable_mock_calls(content):
    """Remove .mockReturnValue() calls on Observable properties"""

    # Remove lines like:
    # documentoPedidoServiceSpy.avisoSituacaoPedido.mockReturnValue(of({}));
    # activatedRouteSpy.paramMap.mockReturnValue(of({}));

    # Pattern 1: Remove avisoSituacaoPedido.mockReturnValue lines
    content = re.sub(
        r'^\s*\w+\.avisoSituacaoPedido\.mockReturnValue\([^;]+\);\s*$',
        '',
        content,
        flags=re.MULTILINE
    )

    # Pattern 2: Remove avisoSituacaoPedidoComplementares.mockReturnValue lines
    content = re.sub(
        r'^\s*\w+\.avisoSituacaoPedidoComplementares\.mockReturnValue\([^;]+\);\s*$',
        '',
        content,
        flags=re.MULTILINE
    )

    # Pattern 3: Remove paramMap.mockReturnValue lines
    content = re.sub(
        r'^\s*\w+\.paramMap\.mockReturnValue\([^;]+\);\s*$',
        '',
        content,
        flags=re.MULTILINE
    )

    return content

def process_file(file_path):
    """Process a single spec file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        content = fix_observable_mock_calls(content)

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

    print(f"\nFixed {modified} files by removing Observable mock calls")

if __name__ == '__main__':
    main()

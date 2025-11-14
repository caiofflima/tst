#!/usr/bin/env python3
"""
Script para converter jest.fn() para Observables onde necessário
"""
import os
import re
from pathlib import Path

def fix_observable_properties(content):
    """Convert jest.fn() to Observables for specific properties"""

    # Check if 'of' is imported from rxjs
    has_of_import = 'from \'rxjs\'' in content or 'from "rxjs"' in content

    # If not, add the import
    if not has_of_import:
        # Find the first import statement
        first_import = re.search(r'^import ', content, re.MULTILINE)
        if first_import:
            # Add the rxjs import at the start
            content = "import { of } from 'rxjs';\n" + content
        else:
            # No imports found, add at the beginning
            content = "import { of } from 'rxjs';\n" + content
    else:
        # Check if 'of' is already in the import
        rxjs_import = re.search(r'import\s*\{([^}]*)\}\s*from\s*[\'"]rxjs[\'"]', content)
        if rxjs_import:
            imports = rxjs_import.group(1)
            if 'of' not in imports:
                # Add 'of' to the existing rxjs import
                new_imports = imports.strip() + ', of'
                content = content.replace(rxjs_import.group(1), new_imports)

    # Fix avisoSituacaoPedido: jest.fn() → avisoSituacaoPedido: of(true)
    content = re.sub(
        r'avisoSituacaoPedido:\s*jest\.fn\(\)',
        'avisoSituacaoPedido: of(true)',
        content
    )

    # Fix avisoSituacaoPedidoComplementares: jest.fn() → avisoSituacaoPedidoComplementares: of(true)
    content = re.sub(
        r'avisoSituacaoPedidoComplementares:\s*jest\.fn\(\)',
        'avisoSituacaoPedidoComplementares: of(true)',
        content
    )

    # Fix paramMap: jest.fn() → paramMap: of({})
    # But be careful - paramMap might be set to null in our fix_required.py
    content = re.sub(
        r'paramMap:\s*jest\.fn\(\)',
        'paramMap: of({})',
        content
    )

    return content

def process_file(file_path):
    """Process a single spec file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        content = fix_observable_properties(content)

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

    print(f"\nFixed {modified} files with Observable property issues")

if __name__ == '__main__':
    main()

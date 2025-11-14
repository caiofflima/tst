#!/usr/bin/env python3
"""
Script para adicionar propriedades faltantes aos spies
"""
import os
import re
from pathlib import Path

def fix_spy_properties(content):
    """Add missing properties to spy objects"""

    # Fix activatedRouteSpy - add snapshot and paramMap
    # Pattern: const activatedRouteSpy = { ... };
    # Need to add snapshot and paramMap if they're missing

    # Find activatedRouteSpy declarations
    activated_route_pattern = r'(const\s+activatedRouteSpy\s*=\s*\{[^}]*)\}'

    def add_activated_route_props(match):
        spy_content = match.group(1)

        # Check if snapshot is already there
        if 'snapshot' not in spy_content:
            # Add snapshot and paramMap
            if spy_content.strip().endswith(','):
                return spy_content + ' snapshot: null, paramMap: jest.fn() }'
            else:
                return spy_content + ', snapshot: null, paramMap: jest.fn() }'
        return match.group(0)

    content = re.sub(activated_route_pattern, add_activated_route_props, content)

    # Fix documentoPedidoServiceSpy - add avisoSituacaoPedido
    doc_pedido_pattern = r'(const\s+documentoPedidoServiceSpy\s*=\s*\{[^}]*)\}'

    def add_doc_pedido_props(match):
        spy_content = match.group(1)

        # Check if avisoSituacaoPedido is already there
        if 'avisoSituacaoPedido' not in spy_content:
            # Add avisoSituacaoPedido and avisoSituacaoPedidoComplementares
            if spy_content.strip().endswith(','):
                return spy_content + ' avisoSituacaoPedido: jest.fn(), avisoSituacaoPedidoComplementares: jest.fn() }'
            else:
                return spy_content + ', avisoSituacaoPedido: jest.fn(), avisoSituacaoPedidoComplementares: jest.fn() }'
        return match.group(0)

    content = re.sub(doc_pedido_pattern, add_doc_pedido_props, content)

    # Fix validacaoDocumentoPedidoServiceSpy - add atualizacaoValidacoes$
    validacao_pattern = r'(const\s+validacaoDocumentoPedidoServiceSpy\s*=\s*\{[^}]*)\}'

    def add_validacao_props(match):
        spy_content = match.group(1)

        if 'atualizacaoValidacoes$' not in spy_content:
            if spy_content.strip().endswith(','):
                return spy_content + ' atualizacaoValidacoes$: null }'
            else:
                return spy_content + ', atualizacaoValidacoes$: null }'
        return match.group(0)

    content = re.sub(validacao_pattern, add_validacao_props, content)

    return content

def process_file(file_path):
    """Process a single spec file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        content = fix_spy_properties(content)

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

    print(f"\nFixed {modified} files with missing spy properties")

if __name__ == '__main__':
    main()

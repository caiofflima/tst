#!/usr/bin/env python3
"""
Script para aplicar correções nos testes Jest
"""
import os
import re
from pathlib import Path

def fix_jasmine_matchers(content):
    """Fix Jasmine matchers to Jest equivalents"""
    content = content.replace('.toBeTrue()', '.toBe(true)')
    content = content.replace('.toBeFalse()', '.toBe(false)')
    return content

def fix_type_assertions(content):
    """Fix type assertions for ActivatedRoute, Router, Location"""
    content = re.sub(r'} as jest\.Mocked<Partial<ActivatedRoute>>', '} as any', content)
    content = re.sub(r'} as jest\.Mocked<Partial<Router>>', '} as any', content)
    content = re.sub(r'} as jest\.Mocked<Partial<Location>>', '} as any', content)
    return content

def fix_mock_return_values(content):
    """Fix mockReturnValue to return arrays where appropriate"""
    # Methods that return arrays
    array_methods = [
        'buscarEmpresas', 'consultarFiliais', 'consultarPorFiltro',
        'consultarUsuarioExternoPorFiltro', 'consultarComboPerfisPrestadoresExternos',
        'consultarComboTiposAuditor', 'consultarComboUF', 'consultarTodos',
        'consultarTodasTransicoesManuais'
    ]

    for method in array_methods:
        content = re.sub(
            rf'{method}\.mockReturnValue\(of\({{}}\)\)',
            f'{method}.mockReturnValue(of([]))',
            content
        )

    # documentoServiceSpy.get and documentoServiceMock.get should return arrays
    content = re.sub(r'documentoService(Spy|Mock)\.get\.mockReturnValue\(of\({{}}\)\)',
                    r'documentoService\1.get.mockReturnValue(of([]))',
                    content)

    # prazoTratamentoService
    content = re.sub(r'prazoTratamentoService(Spy|Mock)\.consultarPorFiltro\.mockReturnValue\(of\({{}}\)\)',
                    r'prazoTratamentoService\1.consultarPorFiltro.mockReturnValue(of([]))',
                    content)

    # tipoDocumentoService
    content = re.sub(r'tipoDocumentoService(Spy|Mock)\.consultarTodos\.mockReturnValue\(of\({{}}\)\)',
                    r'tipoDocumentoService\1.consultarTodos.mockReturnValue(of([]))',
                    content)

    return content

def process_file(file_path):
    """Process a single spec file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        content = fix_jasmine_matchers(content)
        content = fix_type_assertions(content)
        content = fix_mock_return_values(content)

        if content != original:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
    return False

def main():
    """Main function"""
    src_path = Path('src/app')
    spec_files = list(src_path.glob('**/*.spec.ts'))

    print(f"Found {len(spec_files)} spec files")
    modified = 0

    for spec_file in spec_files:
        if process_file(spec_file):
            modified += 1

    print(f"Modified {modified} files")

if __name__ == '__main__':
    main()

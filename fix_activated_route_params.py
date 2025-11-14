#!/usr/bin/env python3
"""
Script para corrigir problema TS2322 com activatedRouteSpy.snapshot e params
"""
import re
from pathlib import Path

def fix_activated_route_spy(content):
    """
    Fix pattern:
    const activatedRouteSpy = { snapshot: jest.fn() };
    activatedRouteSpy.snapshot = {
      params: { id: null }
    }

    To:
    const activatedRouteSpy = {
      snapshot: {
        params: { id: null }
      }
    };
    """

    # Pattern 1: Match the spy creation followed by assignment
    pattern1 = r'(const\s+activatedRouteSpy\s*=\s*\{\s*snapshot:\s*jest\.fn\(\)\s*\};)\s*activatedRouteSpy\.snapshot\s*=\s*(\{[^}]+\})'

    def replace_pattern1(match):
        params_content = match.group(2)
        return f'const activatedRouteSpy = {{\n    snapshot: {params_content}\n  }};'

    content = re.sub(pattern1, replace_pattern1, content, flags=re.DOTALL)

    # Pattern 2: More generic - handle multi-line params
    pattern2 = r'(const\s+activatedRouteSpy\s*=\s*\{\s*snapshot:\s*jest\.fn\(\)\s*\};)\s*activatedRouteSpy\.snapshot\s*=\s*\{([^}]+)\}'

    def replace_pattern2(match):
        params_lines = match.group(2)
        return f'const activatedRouteSpy = {{\n    snapshot: {{{params_lines}}}\n  }};'

    content = re.sub(pattern2, replace_pattern2, content, flags=re.DOTALL)

    return content

def process_file(file_path):
    """Process a single spec file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        content = fix_activated_route_spy(content)

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
    # List of files with the TS2322 error based on test output
    files_to_fix = [
        'src/app/funcionalidades/dependente/cadastro/pagina-inicial/pagina-inicial.component.spec.ts',
        'src/app/funcionalidades/dependente/renovar/renovar-dependente/renovar-dependente.component.spec.ts',
        'src/app/funcionalidades/dependente/cadastro/etapa-tipo-dependente/etapa-tipo-dependente.component.spec.ts',
        'src/app/funcionalidades/dependente/cadastro/cadastro-dependente/cadastro-dependente.component.spec.ts',
        'src/app/funcionalidades/dependente/cadastro/etapa-selecao-dependente/etapa-selecao-dependente.component.spec.ts',
        'src/app/funcionalidades/dependente/cadastro/etapa-complemento-dependente/etapa-complemento-dependente.component.spec.ts',
        'src/app/funcionalidades/dependente/cadastro/etapa-resumo-incluir/etapa-resumo-incluir.component.spec.ts',
        'src/app/funcionalidades/dependente/cancelar/cancelar-dependente/cancelar-dependente.component.spec.ts',
    ]

    modified = 0
    for file_path in files_to_fix:
        file_obj = Path(file_path)
        if file_obj.exists():
            if process_file(file_obj):
                modified += 1
        else:
            print(f"NOT FOUND: {file_path}")

    print(f"\nFixed {modified} files with TS2322 activatedRouteSpy.snapshot error")

if __name__ == '__main__':
    main()

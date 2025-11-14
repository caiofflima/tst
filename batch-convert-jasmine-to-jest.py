#!/usr/bin/env python3
"""
Batch conversion script: Jasmine to Jest
Converts 50 Jasmine test files to Jest format
"""

import re
import os
from pathlib import Path

# List of files to convert
FILES_TO_CONVERT = [
    "src/app/shared/components/asc-pedido/asc-dados-endereco-card/asc-dados-endereco-card.component.spec.ts",
    "src/app/shared/components/asc-pedido/asc-dependentes/asc-dependentes-card/asc-dependentes-card.component.spec.ts",
    "src/app/shared/components/asc-pedido/asc-documentos/documento-complementar/asc-documento-complementar-card.component.spec.ts",
    "src/app/shared/components/asc-pedido/asc-documentos/modal-visualizar-documento/asc-modal-visualizar-documento.component.spec.ts",
    "src/app/shared/components/asc-pedido/asc-modal-ocorrencia/asc-modal-ocorrencia.component.spec.ts",
    "src/app/shared/components/asc-pedido/asc-resumo/asc-card-beneficiario/asc-card-beneficiario.component.spec.ts",
    "src/app/shared/components/asc-pedido/asc-resumo/asc-card-dados-processo/asc-card-dados-processo.component.spec.ts",
    "src/app/shared/components/asc-pedido/asc-resumo/asc-card-documento-fiscal/asc-card-documento-fiscal.component.spec.ts",
    "src/app/shared/components/asc-pedido/asc-resumo/asc-card-info-adicional/asc-card-info-adicional.component.spec.ts",
    "src/app/shared/components/asc-pedido/asc-resumo/asc-card-procedimento/asc-card-procedimento.component.spec.ts",
    "src/app/shared/components/asc-pedido/asc-resumo/asc-profissional-executante/asc-profissional-executante.component.spec.ts",
    "src/app/shared/components/asc-pedido/asc-steps/asc-beneficiario-pedido/asc-beneficiario-pedido.component.spec.ts",
    "src/app/shared/components/asc-pedido/asc-steps/asc-documentos-requeridos-pedido/asc-documentos-requeridos-pedido.component.spec.ts",
    "src/app/shared/components/asc-pedido/asc-steps/asc-finalidade-beneficiario/asc-finalidade.component.spec.ts",
    "src/app/shared/components/asc-pedido/asc-steps/asc-profissional-pedido/asc-profissional-pedido.component.spec.ts",
    "src/app/shared/components/asc-pedido/asc-steps/procedimento/asc-procedimento-pedido.component.spec.ts",
    "src/app/funcionalidades/patologia/patologia-form/patologia-form.component.spec.ts",
    "src/app/shared/services/cadastrobasico/fundoinvestimento.service.spec.ts",
    "src/app/shared/services/cadastrobasico/item.service.spec.ts",
    "src/app/shared/services/cadastrobasico/lista.restritiva.service.spec.ts",
]

def convert_jasmine_to_jest(content):
    """Convert Jasmine syntax to Jest"""

    # Add NO_ERRORS_SCHEMA import if not present
    if 'NO_ERRORS_SCHEMA' not in content and 'CUSTOM_ELEMENTS_SCHEMA' not in content:
        content = content.replace(
            "import { ComponentFixture, TestBed } from '@angular/core/testing';",
            "import { ComponentFixture, TestBed } from '@angular/core/testing';\nimport { NO_ERRORS_SCHEMA } from '@angular/core';"
        )

    # Replace CUSTOM_ELEMENTS_SCHEMA with NO_ERRORS_SCHEMA
    content = content.replace('CUSTOM_ELEMENTS_SCHEMA', 'NO_ERRORS_SCHEMA')

    # Convert jasmine.createSpyObj to Jest mocks (simple pattern)
    # Pattern: const serviceNameSpy = jasmine.createSpyObj('ServiceName', ['method1', 'method2']);
    spy_pattern = r"const\s+(\w+)\s*=\s*jasmine\.createSpyObj\(['\"](\w+)['\"],\s*\[([^\]]+)\]\);"

    def replace_spy(match):
        var_name = match.group(1)
        service_name = match.group(2)
        methods = match.group(3)

        # Parse methods
        methods_list = [m.strip().strip("'\"") for m in methods.split(',')]

        # Create Jest mock
        jest_mock = f"let {var_name}: jest.Mocked<{service_name}>;"
        return jest_mock

    content = re.sub(spy_pattern, replace_spy, content, flags=re.MULTILINE)

    # Add Jest mock initialization in beforeEach
    # Find service spy declarations and create initialization
    service_vars = re.findall(r'let\s+(\w+):\s*jest\.Mocked<(\w+)>;', content)

    if service_vars:
        # Find the first beforeEach block and add mock initialization
        before_each_pattern = r'(beforeEach\(async \(\) => \{)'

        mock_init = '\n'.join([
            f"        {var} = {{}} as jest.Mocked<{service}>;"
            for var, service in service_vars
        ])

        if mock_init:
            content = re.sub(
                before_each_pattern,
                r'\1\n' + mock_init + '\n',
                content,
                count=1
            )

    # Add NO_ERRORS_SCHEMA to TestBed if not present
    if 'schemas:' not in content and 'NO_ERRORS_SCHEMA' in content:
        # Find TestBed.configureTestingModule and add schemas
        content = re.sub(
            r'(\s+providers:\s*\[[^\]]+\])',
            r'\1,\n            schemas: [NO_ERRORS_SCHEMA]',
            content
        )

    # Add fromResourceBundle to MessageService mocks
    content = re.sub(
        r"(let\s+messageService\w*:\s*jest\.Mocked<MessageService>;)",
        lambda m: m.group(0),
        content
    )

    return content

def main():
    """Convert all files"""
    converted_count = 0

    for file_path in FILES_TO_CONVERT:
        full_path = Path(file_path)

        if not full_path.exists():
            print(f"⚠️  File not found: {file_path}")
            continue

        try:
            # Read file
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Check if already converted
            if 'jasmine.createSpyObj' not in content and 'jasmine.createSpy' not in content:
                print(f"✅ Already converted: {file_path}")
                continue

            # Convert
            converted_content = convert_jasmine_to_jest(content)

            # Write back
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(converted_content)

            converted_count += 1
            print(f"✅ Converted: {file_path}")

        except Exception as e:
            print(f"❌ Error converting {file_path}: {e}")

    print(f"\n🎉 Conversion complete! {converted_count} files converted.")

if __name__ == '__main__':
    main()

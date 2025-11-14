#!/usr/bin/env python3
import re
import sys

def convert_jasmine_to_jest(content):
    """Convert Jasmine test syntax to Jest syntax"""

    # Replace jasmine.createSpyObj with Jest mock declarations
    # Pattern: const serviceSpy = jasmine.createSpyObj('ServiceName',['method1','method2']);
    pattern = r"const\s+(\w+)\s*=\s*jasmine\.createSpyObj\('([^']+)',\s*\[([^\]]+)\]\);"

    def replace_spy_obj(match):
        var_name = match.group(1)
        service_name = match.group(2)
        methods = match.group(3)

        # Extract method names
        method_list = [m.strip().strip("'\"") for m in methods.split(',')]

        # Build Jest mock object
        mock_methods = []
        for method in method_list:
            mock_methods.append(f"    {method}: jest.fn()")

        return f"let {var_name}: jest.Mocked<{service_name}>;\n\n  beforeEach(() => {{\n    {var_name} = {{\n{', '.join(['\\n'] + mock_methods)}\\n    }} as unknown as jest.Mocked<{service_name}>;"

    # Replace jasmine.createSpyObj calls
    content = re.sub(pattern, replace_spy_obj, content)

    # Replace .and.returnValue with .mockReturnValue
    content = re.sub(r'\.and\.returnValue\(', '.mockReturnValue(', content)

    # Replace jasmine.objectContaining with expect.objectContaining
    content = re.sub(r'jasmine\.objectContaining\(', 'expect.objectContaining(', content)

    # Replace spyOn with jest.spyOn
    content = re.sub(r'\bspyOn\(', 'jest.spyOn(', content)

    # Replace spyOnProperty with jest.spyOn for getters/setters
    content = re.sub(r"spyOnProperty\(([^,]+),\s*'([^']+)',\s*'get'\)", r"jest.spyOn(\1, '\2', 'get')", content)

    # Add NO_ERRORS_SCHEMA import if not present
    if 'NO_ERRORS_SCHEMA' not in content and 'TestBed.configureTestingModule' in content:
        content = re.sub(
            r"(import.*from '@angular/core/testing';)",
            r"\1\nimport { NO_ERRORS_SCHEMA } from '@angular/core';",
            content
        )

    # Add fromResourceBundle to MessageService mocks if not present
    if 'MessageService' in content and 'fromResourceBundle' not in content:
        content = re.sub(
            r"(getDescription:\s*jest\.fn\(\))",
            r"\1,\n      fromResourceBundle: jest.fn()",
            content
        )

    # Add schemas: [NO_ERRORS_SCHEMA] to TestBed if not present
    if 'TestBed.configureTestingModule' in content and 'schemas:' not in content:
        content = re.sub(
            r"(\s+)(]\s*)\)\.compileComponents\(\);",
            r"\1\2,\n\1  schemas: [NO_ERRORS_SCHEMA]\n\1}).compileComponents();",
            content
        )

    return content

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python convert-jasmine-batch.py <file_path>")
        sys.exit(1)

    file_path = sys.argv[1]

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    converted = convert_jasmine_to_jest(content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(converted)

    print(f"Converted: {file_path}")

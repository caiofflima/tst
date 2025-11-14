#!/usr/bin/env python3
import sys
import re

def convert_jasmine_to_jest(content):
    # Replace jasmine.createSpyObj patterns
    content = re.sub(
        r'const (\w+) = jasmine\.createSpyObj\([\'"](\w+)[\'"],\s*\[(.*?)\]\);',
        lambda m: f"const {m.group(1)}: jest.Mocked<Partial<{m.group(2)}>> = {{\n" +
                  '\n'.join([f"    {method.strip().strip(\"'\")}: jest.fn(),"
                            for method in m.group(3).split(',')]) + '\n  };',
        content,
        flags=re.DOTALL
    )

    # Replace .and.returnValue with .mockReturnValue
    content = content.replace('.and.returnValue(', '.mockReturnValue(')

    # Replace CUSTOM_ELEMENTS_SCHEMA with NO_ERRORS_SCHEMA
    content = content.replace('CUSTOM_ELEMENTS_SCHEMA', 'NO_ERRORS_SCHEMA')

    # Replace Spy suffix with Mock
    content = re.sub(r'(\w+)Spy\b', r'\1Mock', content)

    return content

if __name__ == '__main__':
    if len(sys.argv) < 2:
        content = sys.stdin.read()
    else:
        with open(sys.argv[1], 'r', encoding='utf-8') as f:
            content = f.read()

    converted = convert_jasmine_to_jest(content)

    if len(sys.argv) < 2:
        print(converted)
    else:
        with open(sys.argv[1], 'w', encoding='utf-8') as f:
            f.write(converted)


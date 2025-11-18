import os
import re

def extract_imports_and_dependencies(component_path):
    """Extract component info, dependencies, and import sources"""
    with open(component_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract component class name
    class_match = re.search(r'export class (\w+Component)', content)
    if not class_match:
        return None, [], {}

    class_name = class_match.group(1)

    # Extract all imports to understand where types come from
    import_map = {}  # type -> import statement
    import_matches = re.findall(r'import\s+{([^}]+)}\s+from\s+[\'"]([^\'"]+)[\'"]', content)

    for imports_str, source in import_matches:
        types = [t.strip() for t in imports_str.split(',')]
        for t in types:
            # Remove any "as" aliases
            actual_type = t.split(' as ')[0].strip()
            import_map[actual_type] = source

    # Extract constructor dependencies
    constructor_match = re.search(r'constructor\s*\((.*?)\)', content, re.DOTALL)
    dependencies = []

    if constructor_match:
        params = constructor_match.group(1)
        # Parse parameters
        param_pattern = r'(?:private|protected|public)?\s*(\w+)\s*:\s*([\w<>]+)'
        for match in re.finditer(param_pattern, params):
            param_name = match.group(1)
            param_type = match.group(2).split('<')[0]  # Remove generics
            dependencies.append((param_name, param_type))

    return class_name, dependencies, import_map

def generate_test_file_v2(component_path):
    """Generate a test file with proper imports"""
    class_name, dependencies, import_map = extract_imports_and_dependencies(component_path)

    if not class_name:
        return None

    component_file = os.path.basename(component_path)
    component_name_part = component_file.replace('.component.ts', '')

    # Collect unique imports needed
    imports_needed = set()
    for _, dep_type in dependencies:
        if dep_type in import_map:
            imports_needed.add((dep_type, import_map[dep_type]))

    # Build imports section
    imports_by_source = {}
    for dep_type, source in imports_needed:
        if source not in imports_by_source:
            imports_by_source[source] = []
        imports_by_source[source].append(dep_type)

    # Start building test content
    test_content = "import { ComponentFixture, TestBed } from '@angular/core/testing';\n"
    test_content += f"import {{ {class_name} }} from './{component_name_part}.component';\n"
    test_content += "import { NO_ERRORS_SCHEMA } from '@angular/core';\n"

    # Add other imports
    for source, types in sorted(imports_by_source.items()):
        test_content += f"import {{ {', '.join(sorted(types))} }} from '{source}';\n"

    test_content += f"\ndescribe('{class_name}', () => {{\n"
    test_content += f"  let component: {class_name};\n"
    test_content += f"  let fixture: ComponentFixture<{class_name}>;\n"

    # Add mock services
    if dependencies:
        test_content += "\n  // Mock services\n"
        for dep_name, dep_type in dependencies:
            test_content += f"  const {dep_name}Spy = {{ /* add methods as needed */ }};\n"

    test_content += "\n  beforeEach(async () => {\n"
    test_content += "    await TestBed.configureTestingModule({\n"
    test_content += f"      declarations: [{class_name}],\n"

    # Add providers
    if dependencies:
        test_content += "      providers: [\n"
        for dep_name, dep_type in dependencies:
            test_content += f"        {{ provide: {dep_type}, useValue: {dep_name}Spy }},\n"
        test_content = test_content.rstrip(',\n') + '\n'
        test_content += "      ],\n"

    test_content += "      schemas: [NO_ERRORS_SCHEMA]\n"
    test_content += "    }).compileComponents();\n"
    test_content += "  });\n\n"

    test_content += "  beforeEach(() => {\n"
    test_content += f"    fixture = TestBed.createComponent({class_name});\n"
    test_content += "    component = fixture.componentInstance;\n"
    test_content += "  });\n\n"

    test_content += "  it('deve criar o componente', () => {\n"
    test_content += "    expect(component).toBeTruthy();\n"
    test_content += "  });\n"
    test_content += "});\n"

    return test_content

def process_components_v2(component_list, start_idx=0, max_count=10):
    """Process components starting from an index"""
    created_count = 0
    current_idx = 0

    for component_path in component_list:
        if current_idx < start_idx:
            current_idx += 1
            continue

        if created_count >= max_count:
            break

        full_path = component_path.strip().replace('`', '').replace('- [ ] ', '')

        if not os.path.exists(full_path):
            current_idx += 1
            continue

        test_path = full_path.replace('.component.ts', '.component.spec.ts')

        # Overwrite existing test if it exists
        test_content = generate_test_file_v2(full_path)

        if test_content:
            with open(test_path, 'w', encoding='utf-8') as f:
                f.write(test_content)

            print(f"Created/Updated: {test_path}")
            created_count += 1

        current_idx += 1

    return created_count

# Read component list
components = []
with open('COMPONENTES-SEM-TESTES.md', 'r', encoding='utf-8') as f:
    for line in f:
        if line.strip().startswith('- [ ]'):
            path = line.split('`')[1] if '`' in line else None
            if path:
                components.append(path)

print(f"Found {len(components)} components")
print("Regenerating first 10 test files with proper imports...")

created = process_components_v2(components, start_idx=0, max_count=10)
print(f"\nSuccessfully updated {created} test files!")

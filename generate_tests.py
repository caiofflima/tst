import os
import re

def extract_component_info(component_path):
    """Extract component name and dependencies from TypeScript file"""
    with open(component_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract component class name
    class_match = re.search(r'export class (\w+Component)', content)
    if not class_match:
        return None, [], []

    class_name = class_match.group(1)

    # Extract constructor dependencies
    constructor_match = re.search(r'constructor\s*\((.*?)\)', content, re.DOTALL)
    dependencies = []
    imports_needed = set()

    if constructor_match:
        params = constructor_match.group(1)
        # Parse parameters like: private router: Router, protected service: MyService
        param_pattern = r'(?:private|protected|public)?\s*(\w+)\s*:\s*([\w<>]+)'
        for match in re.finditer(param_pattern, params):
            param_name = match.group(1)
            param_type = match.group(2).split('<')[0]  # Remove generics
            dependencies.append((param_name, param_type))
            imports_needed.add(param_type)

    # Extract imports to understand what services are used
    import_matches = re.findall(r'import\s+{([^}]+)}\s+from\s+[\'"]([^\'"]+)[\'"]', content)

    return class_name, dependencies, list(imports_needed)

def generate_test_file(component_path):
    """Generate a basic test file for a component"""
    class_name, dependencies, imports_needed = extract_component_info(component_path)

    if not class_name:
        print(f"Could not extract class name from {component_path}")
        return None

    # Component file name without extension
    component_file = os.path.basename(component_path)
    component_name_part = component_file.replace('.component.ts', '')

    # Create test content
    test_content = f"""import {{ ComponentFixture, TestBed }} from '@angular/core/testing';
import {{ {class_name} }} from './{component_name_part}.component';
import {{ NO_ERRORS_SCHEMA }} from '@angular/core';

describe('{class_name}', () => {{
  let component: {class_name};
  let fixture: ComponentFixture<{class_name}>;
"""

    # Add mock services for dependencies
    if dependencies:
        test_content += "\n  // Mock services\n"
        for dep_name, dep_type in dependencies:
            test_content += f"  const {dep_name}Spy = {{ /* add methods as needed */ }};\n"

    test_content += """
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [""" + class_name + """],
"""

    # Add providers if there are dependencies
    if dependencies:
        test_content += "      providers: [\n"
        for dep_name, dep_type in dependencies:
            test_content += f"        {{ provide: {dep_type}, useValue: {dep_name}Spy }},\n"
        test_content = test_content.rstrip(',\n') + '\n      ],\n'

    test_content += """      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(""" + class_name + """);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});
"""

    return test_content

def process_components(component_list, max_count=20):
    """Process a list of component paths and generate tests"""
    created_count = 0

    for component_path in component_list:
        if created_count >= max_count:
            break

        # Normalize path
        full_path = component_path.strip().replace('`', '').replace('- [ ] ', '')

        if not os.path.exists(full_path):
            print(f"File not found: {full_path}")
            continue

        # Generate test file path
        test_path = full_path.replace('.component.ts', '.component.spec.ts')

        if os.path.exists(test_path):
            print(f"Test already exists: {test_path}")
            continue

        # Generate test content
        test_content = generate_test_file(full_path)

        if test_content:
            # Write test file
            with open(test_path, 'w', encoding='utf-8') as f:
                f.write(test_content)

            print(f"Created: {test_path}")
            created_count += 1

    return created_count

# Read component list from MD file
components = []
with open('COMPONENTES-SEM-TESTES.md', 'r', encoding='utf-8') as f:
    for line in f:
        if line.strip().startswith('- [ ]'):
            path = line.split('`')[1] if '`' in line else None
            if path:
                components.append(path)

print(f"Found {len(components)} components without tests")
print("Generating tests for first 10 components...")

created = process_components(components, max_count=10)
print(f"\nSuccessfully created {created} test files!")

const fs = require('fs');
const path = require('path');

const files = [
  'src/app/funcionalidades/dependente/cadastro/cadastro-dependente/cadastro-dependente.component.spec.ts',
  'src/app/funcionalidades/relatorios/procedimentos-solicitados-por-profissional/procedimentos-solicitados-por-profissional-listar/procedimentos-solicitados-por-profissional-listar.component.spec.ts',
  'src/app/funcionalidades/vinc-med-patologia/vinc-med-patologia-home/vinc-med-patologia-home.component.spec.ts',
  'src/app/funcionalidades/relatorios/tempo-medio-processos/tempo-medio-processos-listar/tempo-medio-processos-listar.component.spec.ts',
  'src/app/funcionalidades/relatorios/junta-medica-odontologica/junta-medica-odontologica-listar/junta-medica-odontologica-listar.component.spec.ts',
  'src/app/funcionalidades/relatorios/controle-prazos-processos/controle-prazos-processos-listar/controle-prazos-processos-listar.component.spec.ts',
  'src/app/funcionalidades/relatorios/analitico/analitico-listar/analitico-listar.component.spec.ts',
  'src/app/funcionalidades/processos/reembolso/resumo/resumo.component.spec.ts',
  'src/app/funcionalidades/processos/reembolso/recibo/recibo.component.spec.ts',
  'src/app/funcionalidades/processos/reembolso/profissional/profissional.component.spec.ts',
  'src/app/funcionalidades/processos/reembolso/pagina-inicial/pagina-inicial.component.spec.ts',
  'src/app/funcionalidades/processos/reembolso/procedimento/procedimento.component.spec.ts',
  'src/app/funcionalidades/processos/reembolso/finalidade/finalidade.component.spec.ts',
  'src/app/funcionalidades/processos/reembolso/beneficiario/beneficiario.component.spec.ts',
  'src/app/funcionalidades/procedimentos-cobertos/listar-procedimentos-com-reembolso/listar-procedimentos-com-reembolso.component.spec.ts',
  'src/app/funcionalidades/prestador-externo/prestador-externo-listar/prestador-externo-listar.component.spec.ts'
];

function convertJasmineToJest(content) {
  // Replace jasmine.createSpyObj with Jest mocks
  content = content.replace(/const\s+(\w+)\s*=\s*jasmine\.createSpyObj\('(\w+)',\s*\[(.*?)\]\);/gs, (match, varName, serviceName, methods) => {
    const methodsArray = methods.split(',').map(m => m.trim().replace(/'/g, ''));
    const mockMethods = methodsArray.map(method => `    ${method}: jest.fn()`).join(',\n');
    return `const ${varName} = {\n${mockMethods}\n  } as jest.Mocked<Partial<${serviceName}>>;`;
  });

  // Replace .and.returnValue with .mockReturnValue
  content = content.replace(/(\w+)\.and\.returnValue\(/g, '$1.mockReturnValue(');

  // Replace jasmine.SpyObj<T> with jest.Mocked<Partial<T>>
  content = content.replace(/jasmine\.SpyObj<(\w+)>/g, 'jest.Mocked<Partial<$1>>');

  // Add NO_ERRORS_SCHEMA import if CUSTOM_ELEMENTS_SCHEMA exists
  if (content.includes('CUSTOM_ELEMENTS_SCHEMA') && !content.includes('NO_ERRORS_SCHEMA')) {
    content = content.replace(
      /import\s*{\s*CUSTOM_ELEMENTS_SCHEMA\s*}\s*from\s*'@angular\/core';/,
      "import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';"
    );
  }

  // Add fromResourceBundle to MessageService if it has getDescription
  content = content.replace(
    /(const\s+messageServiceSpy\s*=\s*{\s*\n\s*getDescription:\s*jest\.fn\(\))/,
    "$1,\n    fromResourceBundle: jest.fn()"
  );

  // Replace schemas: [CUSTOM_ELEMENTS_SCHEMA] with schemas: [NO_ERRORS_SCHEMA]
  content = content.replace(/schemas:\s*\[\s*CUSTOM_ELEMENTS_SCHEMA\s*\]/g, 'schemas: [NO_ERRORS_SCHEMA]');

  return content;
}

let summary = [];

files.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);

  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    const hasJasmine = content.includes('jasmine.createSpyObj');

    if (hasJasmine) {
      content = convertJasmineToJest(content);
      fs.writeFileSync(fullPath, content, 'utf8');

      // Count tests
      const testCount = (content.match(/it\(/g) || []).length;
      summary.push({
        file: filePath,
        tests: testCount,
        status: 'Converted'
      });
    } else {
      const testCount = (content.match(/it\(/g) || []).length;
      summary.push({
        file: filePath,
        tests: testCount,
        status: 'Already Jest format or no jasmine.createSpyObj'
      });
    }
  } else {
    summary.push({
      file: filePath,
      tests: 0,
      status: 'File not found'
    });
  }
});

console.log('\n=== CONVERSION SUMMARY ===\n');
summary.forEach(item => {
  console.log(`File: ${item.file}`);
  console.log(`Tests: ${item.tests}`);
  console.log(`Status: ${item.status}`);
  console.log('---');
});
console.log(`\nTotal files processed: ${summary.length}`);
console.log(`Total tests: ${summary.reduce((acc, item) => acc + item.tests, 0)}`);

const fs = require('fs');
const path = require('path');

const files = [
  'src/app/shared/services/meus-dados/meus-dados.service.spec.ts',
  'src/app/funcionalidades/dependente/cadastro/etapa-complemento-dependente/etapa-complemento-dependente.component.spec.ts',
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

files.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);

  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');

    // Fix duplicate fromResourceBundle
    content = content.replace(/fromResourceBundle: jest\.fn\(\),\n\s*fromResourceBundle: jest\.fn\(\)/g, 'fromResourceBundle: jest.fn()');

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
  }
});

console.log('Done fixing duplicates!');

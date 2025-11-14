# Plano de Correções - Testes Jest

**Data:** 2025-11-13
**Status:** 807 testes passando, 38 testes falhando
**Suites:** 151 passando, 66 com erros (218 total)

---

## 📊 Resumo Executivo

### Estatísticas Globais:
- ✅ **807 testes passando** (95.5%)
- ❌ **38 testes falhando** (4.5%)
- ✅ **151 suites passando** (69.3%)
- ❌ **66 suites com erros** (30.3%)
- 🎯 **Taxa de sucesso:** 95.5% dos testes individuais

### Progresso da Migração:
- ✅ **100% dos arquivos Jasmine migrados para Jest** (174 arquivos convertidos)
- ✅ **0 referências a jasmine.createSpyObj restantes**
- ⚠️ **66 arquivos precisam de ajustes** (principalmente erros de tipagem e dependências)

---

## 🔍 Categorização dos Erros (66 arquivos)

### Categoria 1: Erros de Tipagem TypeScript (Principal) - ~45 arquivos

#### Subcategoria 1.1: Mocks de ActivatedRoute/Router/Location (~20 arquivos)
**Problema:** Mocks mal tipados com `jest.Mocked<Partial<T>>`

**Arquivos afetados:**
- src/app/funcionalidades/empresa-prestador-externo/empresa-prestador-externo-home/empresa-prestador-externo-home.component.spec.ts
- src/app/funcionalidades/empresa-prestador-externo/empresa-prestador-externo-listar/empresa-prestador-externo-listar.component.spec.ts
- src/app/funcionalidades/preposto-credenciado/preposto-credenciado-form/empresa-credenciada-form.component.spec.ts
- src/app/funcionalidades/preposto-credenciado/preposto-credenciado-home/empresa-credenciada-home.component.spec.ts
- src/app/funcionalidades/preposto-credenciado/preposto-credenciado-listar/empresa-credenciada-listar.component.spec.ts
- src/app/funcionalidades/prestador-externo/prestador-externo-form/prestador-externo-form.component.spec.ts
- src/app/funcionalidades/prestador-externo/prestador-externo-home/prestador-externo-home.component.spec.ts
- src/app/funcionalidades/prestador-externo/prestador-externo-listar/prestador-externo-listar.component.spec.ts
- src/app/funcionalidades/relatorios/tempo-medio-processos/tempo-medio-processos-listar/tempo-medio-processos-listar.component.spec.ts
- src/app/funcionalidades/relatorios/analitico/analitico-listar/analitico-listar.component.spec.ts
- src/app/funcionalidades/relatorios/controle-prazos-processos/controle-prazos-processos-listar/controle-prazos-processos-listar.component.spec.ts
- src/app/funcionalidades/relatorios/junta-medica-odontologica/junta-medica-odontologica-listar/junta-medica-odontologica-listar.component.spec.ts
- src/app/funcionalidades/relatorios/procedimentos-solicitados-por-profissional/procedimentos-solicitados-por-profissional-listar/procedimentos-solicitados-por-profissional-listar.component.spec.ts
- src/app/funcionalidades/processos/reembolso/beneficiario/beneficiario.component.spec.ts
- src/app/funcionalidades/processos/reembolso/finalidade/finalidade.component.spec.ts
- src/app/funcionalidades/processos/reembolso/pagina-inicial/pagina-inicial.component.spec.ts
- src/app/funcionalidades/processos/reembolso/procedimento/procedimento.component.spec.ts
- src/app/funcionalidades/processos/reembolso/profissional/profissional.component.spec.ts
- src/app/funcionalidades/processos/reembolso/recibo/recibo.component.spec.ts
- src/app/funcionalidades/processos/reembolso/resumo/resumo.component.spec.ts

**Erro típico:**
```typescript
// ❌ PROBLEMA
const activatedRouteSpy = {
  getDescription: jest.fn()
} as jest.Mocked<Partial<ActivatedRoute>>;

// TS2352: Conversion of type '{ getDescription: jest.Mock<...> }' to type 'Mocked<Partial<ActivatedRoute>>' may be a mistake
```

**Solução:**
```typescript
// ✅ SOLUÇÃO
const activatedRouteSpy = {
  snapshot: {
    params: {},
    queryParams: {},
    data: {},
    url: [],
    outlet: 'primary',
    routeConfig: null,
    root: {} as any,
    parent: null,
    firstChild: null,
    children: [],
    pathFromRoot: [],
    paramMap: {
      get: jest.fn(),
      has: jest.fn(),
      getAll: jest.fn(),
      keys: []
    } as any,
    queryParamMap: {
      get: jest.fn(),
      has: jest.fn(),
      getAll: jest.fn(),
      keys: []
    } as any,
    fragment: null,
    title: undefined as any
  },
  paramMap: of({
    get: jest.fn(),
    has: jest.fn(),
    getAll: jest.fn(),
    keys: []
  } as any)
} as any;
```

#### Subcategoria 1.2: mockReturnValue com tipos incompatíveis (~15 arquivos)
**Problema:** `.mockReturnValue(of({}))` esperando arrays ou objetos específicos

**Arquivos afetados:**
- Todos os arquivos da Subcategoria 1.1
- src/app/funcionalidades/processos/reembolso/acompanhamento-reembolso/acompanhamento/acompanhamento.component.spec.ts
- src/app/funcionalidades/processos/reembolso/documentos-fiscal/documentos-fiscal.component.spec.ts
- src/app/funcionalidades/processos/reembolso/reembolso-base/reembolso-base.component.spec.ts

**Erro típico:**
```typescript
// ❌ PROBLEMA
comboServiceSpy.consultarComboUF.mockReturnValue(of({}));
// TS2345: Argument of type 'Observable<{}>' is not assignable to parameter of type 'Observable<DadoComboDTO[]>'

documentoServiceSpy.get.mockReturnValue(of({}));
// TS2345: Type '{}' is not assignable to type 'Documento | Documento[]'
```

**Solução:**
```typescript
// ✅ SOLUÇÃO
comboServiceSpy.consultarComboUF.mockReturnValue(of([]));
// ou
comboServiceSpy.consultarComboUF.mockReturnValue(of([{ id: 1, descricao: 'Test' } as DadoComboDTO]));

documentoServiceSpy.get.mockReturnValue(of([] as Documento[]));
// ou
documentoServiceSpy.get.mockReturnValue(of({ id: 1 } as Documento));
```

#### Subcategoria 1.3: Propriedades read-only (~10 arquivos)
**Problema:** Tentativa de atribuir valor a propriedades read-only

**Arquivos afetados:**
- Todos da Subcategoria 1.1 que usam `paramMap`

**Erro típico:**
```typescript
// ❌ PROBLEMA
activatedRouteSpy.paramMap = of({});
// TS2540: Cannot assign to 'paramMap' because it is a read-only property
```

**Solução:**
```typescript
// ✅ SOLUÇÃO - Definir no mock inicial
const activatedRouteSpy = {
  paramMap: of({
    get: jest.fn(),
    has: jest.fn()
  } as any)
} as any;
```

#### Subcategoria 1.4: Tipos de Pedido incompletos (~2 arquivos)
**Arquivos:**
- src/app/funcionalidades/acompanhamento/acompanhamento.component.spec.ts

**Erro típico:**
```typescript
// ❌ PROBLEMA
const mockPedido: Pedido = { id: 123, numero: 'PED-001' } as Pedido;
// TS2352: Type '{ id: number; numero: string; }' is missing properties: isNovo, pedidoProcedimentoIsNotEmpty, etc.
```

**Solução:**
```typescript
// ✅ SOLUÇÃO
const mockPedido = {
  id: 123,
  numero: 'PED-001',
  isNovo: false,
  pedidoProcedimentoIsNotEmpty: jest.fn(),
  temProtocoloANSValido: jest.fn(),
  verificarEhTitularEPedidoEmAnalise: jest.fn()
} as unknown as Pedido;
```

---

### Categoria 2: Dependências Ausentes/Modules não encontrados - ~8 arquivos

#### Subcategoria 2.1: Imports de PDF/Kendo (~2 arquivos)
**Arquivos:**
- src/app/funcionalidades/cartoes/detail/cartoes-detail.component.spec.ts
- src/app/funcionalidades/dependente/recibo/recibo.component.spec.ts

**Erro:**
```typescript
// TS2306: File 'D:/Projetos/tst/src/assets/fonts/vfs_fonts.js' is not a module
// TS2306: File '.../assets/js/kendo/kendo.all.min.js' is not a module
```

**Solução:**
```typescript
// ✅ Adicionar ao jest.config.js
moduleNameMapper: {
  '^assets/fonts/vfs_fonts$': '<rootDir>/src/__mocks__/vfs_fonts.js',
  '^.*\\.js/kendo\\.all\\.min\\.js$': '<rootDir>/src/__mocks__/kendo.mock.js'
}

// Criar mocks:
// src/__mocks__/vfs_fonts.js
module.exports = { pdfMake: { vfs: {} } };

// src/__mocks__/kendo.mock.js
module.exports = { kendo: {} };
```

#### Subcategoria 2.2: Arquivo fora do projeto (~1 arquivo)
**Arquivos:**
- ./gerar-cronograma-leilao.component.spec.ts (arquivo na raiz, fora de src/)

**Erro:**
```typescript
// TS2307: Cannot find module '@ngx-loading-bar/core'
// TS2307: Cannot find module 'ngx-material-timepicker'
// TS2307: Cannot find module 'ngx-toastr'
```

**Solução:**
```bash
# ✅ Mover arquivo para local correto ou remover
rm ./gerar-cronograma-leilao.component.spec.ts
# ou instalar dependências faltantes
npm install @ngx-loading-bar/core ngx-material-timepicker ngx-toastr
```

---

### Categoria 3: Pipes/Declarations Ausentes - ~3 arquivos

**Arquivos:**
- src/app/funcionalidades/acompanhamento/dados-processo-card/dados-processo-card.component.spec.ts
- src/app/shared/components/asc-pedido/asc-dados-contato-card/asc-dados-contato-card.component.spec.ts

**Erro:**
```
NG0302: The pipe 'campoVazioHifen' could not be found in the 'DadosProcessoCardComponent' component
```

**Solução:**
```typescript
// ✅ SOLUÇÃO - Adicionar pipe nas declarations do TestBed
import { CampoVazioHifen } from 'path/to/pipe';

await TestBed.configureTestingModule({
  declarations: [
    DadosProcessoCardComponent,
    CampoVazioHifen  // ← Adicionar aqui
  ],
  // ...
}).compileComponents();
```

---

### Categoria 4: PrimeNG Value Accessors - ~1 arquivo

**Arquivos:**
- src/app/funcionalidades/beneficiario-pedido/beneficiario-pedido-home/beneficiario-pedido-home.component.spec.ts

**Erro:**
```
NG01203: No value accessor for form control name: 'somenteAtivos'
```

**Solução:**
```typescript
// ✅ SOLUÇÃO - Importar PrimeNG modules ou usar NO_ERRORS_SCHEMA
import { CheckboxModule } from 'primeng/checkbox';

await TestBed.configureTestingModule({
  imports: [CheckboxModule], // ← Para p-checkbox
  schemas: [NO_ERRORS_SCHEMA] // ou simplesmente ignorar com schema
}).compileComponents();
```

---

### Categoria 5: jQuery/ModalUtil - ~1 arquivo

**Arquivos:**
- src/app/funcionalidades/meus-dados/exibir-dados-beneficiario/dados-beneficiario.component.spec.ts

**Erro:**
```
TypeError: jQuery is not a function
```

**Solução:**
```typescript
// ✅ SOLUÇÃO - Mockar jQuery globalmente
beforeEach(() => {
  (global as any).jQuery = jest.fn((selector) => ({
    on: jest.fn(),
    off: jest.fn(),
    modal: jest.fn()
  }));
});

afterEach(() => {
  delete (global as any).jQuery;
});
```

---

### Categoria 6: Erros de Teste/Assertions - ~2 arquivos

#### Subcategoria 6.1: toBeTrue() - Matcher Jasmine
**Arquivos:**
- src/app/shared/services/cadastrobasico/fundoinvestimento.service.spec.ts

**Erro:**
```typescript
// TS2339: Property 'toBeTrue' does not exist on type 'JestMatchers<boolean>'
```

**Solução:**
```typescript
// ❌ PROBLEMA
expect(response).toBeTrue();

// ✅ SOLUÇÃO
expect(response).toBe(true);
```

---

### Categoria 7: Arquivos de Teste Vazios/Incompletos - ~10 arquivos

**Arquivos com estrutura incompleta ou erros de configuração:**
- src/app/arquitetura/seguranca/perfil/cadastro/perfil-cadastro.component.spec.ts
- src/app/arquitetura/shared/templates/cabecalho-padrao.component.spec.ts
- src/app/arquitetura/shared/templates/rodape-padrao.component.spec.ts
- src/app/funcionalidades/acompanhamento/beneficiario-card/beneficiario-card.component.spec.ts
- src/app/funcionalidades/dados-cadastrais/detail/dados-cadastrais-detail.component.spec.ts
- src/app/funcionalidades/dados-cadastrais/informacoes-pedido-detail/informacoes-pedido-detail.component.spec.ts
- src/app/funcionalidades/dependente/acompanhamento-dependente/acompanhamento-dependente.component.spec.ts
- src/app/funcionalidades/dependente/cadastro/cadastro-dependente/cadastro-dependente.component.spec.ts
- (e outros componentes de dependente/)

**Problema:** Falta de mocks adequados, imports faltantes, ou configuração incompleta do TestBed

**Solução:** Revisar caso a caso e aplicar padrões das categorias acima

---

## 📋 Plano de Ação Priorizado

### Fase 1: Correções Rápidas (1-2 horas) - 25 arquivos
**Prioridade ALTA - Padrões repetitivos**

1. **Corrigir Matcher Jasmine (1 arquivo - 5 min)**
   - fundoinvestimento.service.spec.ts: `.toBeTrue()` → `.toBe(true)`

2. **Adicionar Pipes faltantes (3 arquivos - 15 min)**
   - dados-processo-card, asc-dados-contato-card
   - Adicionar `CampoVazioHifen` nas declarations

3. **Corrigir mockReturnValue com arrays vazios (20 arquivos - 45 min)**
   - Todos os arquivos de prestador-externo, preposto-credenciado, relatorios
   - Substituir `of({})` por `of([])`

### Fase 2: Correções Médias (2-3 horas) - 30 arquivos
**Prioridade MÉDIA - Mocks complexos**

4. **Corrigir mocks de ActivatedRoute/Router (20 arquivos - 2 horas)**
   - Criar helper function para gerar mocks completos
   - Aplicar em todos os arquivos de reembolso, relatórios, etc.

5. **Corrigir propriedades read-only (10 arquivos - 1 hora)**
   - Ajustar todos os usos de `paramMap`, `url`, etc.

### Fase 3: Correções Complexas (3-4 horas) - 11 arquivos
**Prioridade BAIXA - Casos específicos**

6. **Resolver dependências PDF/Kendo (2 arquivos - 1 hora)**
   - Criar mocks para vfs_fonts e kendo
   - Adicionar moduleNameMapper no jest.config

7. **Corrigir jQuery/ModalUtil (1 arquivo - 30 min)**
   - Mockar jQuery globalmente

8. **Corrigir PrimeNG Value Accessors (1 arquivo - 30 min)**
   - Importar CheckboxModule ou usar NO_ERRORS_SCHEMA

9. **Revisar arquivos com erros específicos (7 arquivos - 2 horas)**
   - perfil-cadastro, cabecalho-padrao, rodape-padrao, etc.
   - Análise caso a caso

### Fase 4: Limpeza e Validação (1 hora)

10. **Rodar suite completa de testes**
11. **Validar 100% de suites passando**
12. **Documentar casos edge encontrados**

---

## 🎯 Meta Final

**Objetivo:** 218/218 suites passando (100%)
**Status Atual:** 151/218 (69.3%)
**Progresso Necessário:** +67 suites (+30.7%)

**Timeline Estimado:** 7-10 horas de trabalho

---

## 📝 Notas Importantes

1. **Helper Functions Recomendadas:**
   ```typescript
   // Mock completo de ActivatedRoute
   function createActivatedRouteMock(params = {}, queryParams = {}) {
     return {
       snapshot: {
         params,
         queryParams,
         data: {},
         url: [],
         outlet: 'primary',
         routeConfig: null,
         root: {} as any,
         parent: null,
         firstChild: null,
         children: [],
         pathFromRoot: [],
         paramMap: { get: jest.fn(), has: jest.fn(), getAll: jest.fn(), keys: [] } as any,
         queryParamMap: { get: jest.fn(), has: jest.fn(), getAll: jest.fn(), keys: [] } as any,
         fragment: null,
         title: undefined as any
       },
       paramMap: of({ get: jest.fn(), has: jest.fn(), getAll: jest.fn(), keys: [] } as any),
       queryParamMap: of({ get: jest.fn(), has: jest.fn(), getAll: jest.fn(), keys: [] } as any),
       url: of([]),
       params: of(params),
       queryParams: of(queryParams),
       fragment: of(null),
       data: of({}),
       outlet: 'primary',
       component: null as any,
       routeConfig: null,
       root: {} as any,
       parent: null,
       firstChild: null,
       children: [],
       pathFromRoot: [],
       title: of(undefined)
     } as any;
   }
   ```

2. **Padrão de Service Mocks:**
   ```typescript
   // Sempre usar arrays vazios para consultas
   serviceSpyconsultarTodos.mockReturnValue(of([]));

   // Usar objetos parciais com 'as any' quando necessário
   servicespy.get.mockReturnValue(of({ id: 1 } as any));
   ```

3. **NO_ERRORS_SCHEMA vs Imports Completos:**
   - Use `NO_ERRORS_SCHEMA` para testes unitários simples
   - Importe modules completos quando testar interações de template

---

## 🔗 Arquivos de Referência

- **TODOLIST-TESTES-JEST.md** - Progresso geral da migração
- **test-results.txt** - Output completo da última execução
- **arquivos-com-erro.txt** - Lista de 66 arquivos com erro

---

**Última atualização:** 2025-11-13 22:51
**Próxima revisão:** Após Fase 1 de correções

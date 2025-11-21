# Análise de Migração: Componentes ASC-SELECT para DSC-SELECT

## 📋 Objetivo
Substituir os componentes `asc-select` manuais pelos componentes `DscSelectComponent` da biblioteca `sidsc-components`, mantendo:
- ✅ Toda a lógica de negócio existente
- ✅ As interfaces (inputs/outputs) dos componentes
- ✅ O design system da biblioteca DSC (estilos, fontes, tamanhos)
- ✅ Compatibilidade com o resto do sistema (sem quebrar funcionalidades existentes)

---

## 🔍 Situação Atual

### Componentes ASC-SELECT Identificados

#### 1. **Componentes na pasta `asc-input`** (BaseSelectComponent)
Localização: `src/app/shared/components/asc-input/asc-select/`

Componentes que herdam de `BaseSelectComponent`:
- ✅ `asc-select-conselho-profissional`
- ✅ `asc-select-uf`
- ✅ `asc-select-municipio`
- Outros componentes de select nesta estrutura

**Características:**
- Herdam de `BaseSelectComponent<T>` 
- Usam template HTML: `asc-select.component.html`
- Utilizam **PrimeNG Dropdown** (`p-dropdown`)
- Têm lógica de carregamento de dados via Observable
- Emitem eventos: `dadoSelecionado`, `dados`, `dadosCombo`
- Suportam validação com mensagens de erro customizadas
- Integrados com `MessageService` para i18n

#### 2. **Componentes na pasta `asc-select`** (BaseSelectControlValueAcessor)
Localização: `src/app/shared/components/asc-select/`

Componentes específicos:
- ✅ `asc-select-procedimento`
- ✅ `asc-select-tipo-ocorrencia`
- ✅ `asc-select-medicamentos`
- ✅ `asc-select-medicamento-apresentacao`
- ✅ `asc-select-laboratorio`
- ✅ `asc-select-especialidade`
- ✅ `asc-select-autorizacao-previa`
- ✅ `asc-graus-procedimento`

**Características:**
- Herdam de `BaseSelectControlValueAcessor<T, P, O>`
- Implementam `ControlValueAccessor` (integração com Reactive Forms)
- Usam `asc-dropdown` internamente (componente wrapper do PrimeNG)
- Têm lógica complexa de filtragem e busca (alguns com lazy loading)
- Suportam parametrização dinâmica via `@Input() parametro`
- Emitem eventos: `dadoSelecionado`, `dadosBackend`, `change`

#### 3. **Componente ASC-DROPDOWN**
Localização: `src/app/shared/components/asc-select/asc-dropdown/`

**Características:**
- Wrapper customizado do PrimeNG Dropdown
- Gerencia filtros personalizados
- Integrado com validação e mensagens de erro
- Usado pelos componentes da pasta `asc-select`

---

## 🎯 Estratégia de Migração

### Abordagem: **Wrapper Components Pattern**

Criar componentes wrapper que:
1. Mantêm os **mesmos seletores** (`asc-select-*`)
2. Mantêm as **mesmas interfaces** (inputs/outputs)
3. Usam **DscSelectComponent internamente** (para o visual)
4. Preservam **toda a lógica** de negócio existente

### Vantagens:
- ✅ Zero impacto no código que usa os componentes
- ✅ Não é necessário modificar templates existentes
- ✅ Migração gradual e segura
- ✅ Facilita testes e rollback se necessário

---

## 📦 Componentes a Serem Modificados

### **FASE 1: Componentes da pasta `asc-input` (Prioritário)**

#### 1.1. `asc-select-conselho-profissional`
- **Arquivo**: `src/app/shared/components/asc-input/asc-select/asc-select-conselho-profissional.component.ts`
- **Template**: Criar novo template usando `dsc-select`
- **Usado em**: 
  - `asc-profissional-executante.component.html` ✅ (exemplo fornecido)
  - Formulários de profissional
  - Processos de autorização prévia

#### 1.2. `asc-select-uf`
- **Arquivo**: `src/app/shared/components/asc-input/asc-select/asc-select-uf.component.ts`
- **Template**: Criar novo template usando `dsc-select`
- **Usado em**: 
  - `asc-profissional-executante.component.html` ✅ (exemplo fornecido)
  - Formulários de endereço/localização

#### 1.3. `asc-select-municipio`
- **Arquivo**: `src/app/shared/components/asc-input/asc-select/asc-select-municipio.component.ts`
- **Template**: Criar novo template usando `dsc-select`
- **Depende de**: UF selecionada (parametrização)
- **Usado em**: 
  - `asc-profissional-executante.component.html` ✅ (exemplo fornecido)
  - Formulários de endereço/localização

### **FASE 2: Componentes da pasta `asc-select`**

#### 2.1. `asc-dropdown` (Base para outros)
- **Arquivo**: `src/app/shared/components/asc-select/asc-dropdown/asc-dropdown.component.ts`
- **Template**: Substituir `p-dropdown` por `dsc-select`
- **Impacto**: Afeta todos os componentes que o utilizam

#### 2.2. Componentes específicos
- `asc-select-procedimento`
- `asc-select-tipo-ocorrencia`
- `asc-select-medicamentos`
- `asc-select-medicamento-apresentacao`
- `asc-select-laboratorio`
- `asc-select-especialidade`
- `asc-select-autorizacao-previa`
- `asc-graus-procedimento`

---

## 🔧 Alterações Necessárias

### Para cada componente ASC-SELECT:

#### 1. **Criar Novo Template**
```html
<!-- Exemplo: asc-select-conselho-profissional-dsc.component.html -->
<label
  *ngIf="label"
  [for]="id"
  [class.obrigatorio]="required"
>
  {{ label }}
</label>

<dsc-select
  [id]="id"
  [formControl]="control"
  [options]="selectItems"
  [placeholder]="placeholder || 'Selecione uma opção'"
  [disabled]="disabled"
  [required]="required"
  size="standard"
  [loading]="showProgressBar"
  (selectionChange)="changeAction($event)"
>
</dsc-select>

<p-progressBar
  mode="indeterminate"
  *ngIf="showProgressBar"
  [style]="{ height: '6px' }"
></p-progressBar>

<asc-input-error
  [control]="control"
  [requiredMsg]="requiredMsg"
></asc-input-error>
```

#### 2. **Modificar TypeScript (Mínimo)**
```typescript
// Apenas importar DscSelectComponent no módulo
// A lógica do componente permanece INTACTA
// Apenas o template muda
```

#### 3. **Atualizar Módulos**

##### `asc-input.module.ts`
```typescript
import { DscSelectComponent } from 'sidsc-components/dsc-select';

@NgModule({
  imports: [
    // ... outros imports
    DscSelectComponent, // ✅ Adicionar
  ],
  // ...
})
```

##### `asc-select.module.ts`
```typescript
import { DscSelectComponent } from 'sidsc-components/dsc-select';

@NgModule({
  imports: [
    // ... outros imports
    DscSelectComponent, // ✅ Adicionar
    // DropdownModule, // ❌ Pode ser removido gradualmente
  ],
  // ...
})
```

---

## 🎨 Mapeamento de Props: PrimeNG → DSC

### Inputs Comuns

| ASC/PrimeNG | DSC Select | Observações |
|-------------|-----------|-------------|
| `[options]="selectItems"` | `[options]="selectItems"` | ✅ Mesmo formato |
| `[formControl]="control"` | `[formControl]="control"` | ✅ Mesmo formato |
| `[disabled]="disabled"` | `[disabled]="disabled"` | ✅ Mesmo formato |
| `[required]="required"` | `[required]="required"` | ✅ Mesmo formato |
| `[placeholder]="..."` | `[placeholder]="..."` | ✅ Mesmo formato |
| `[filter]="true"` | `[searchable]="true"` | ⚠️ Nome diferente |
| `[id]="id"` | `[id]="id"` | ✅ Mesmo formato |
| `[inputId]="selectId"` | `[inputId]="selectId"` | ✅ Mesmo formato |
| `[tabindex]="index"` | `[tabIndex]="index"` | ✅ Mesmo formato |
| `[style]="compStyle"` | `[ngStyle]="compStyle"` | ⚠️ Usar diretiva |
| N/A | `size="standard"` | ✅ Novo (usar sempre) |

### Outputs/Events

| ASC/PrimeNG | DSC Select | Observações |
|-------------|-----------|-------------|
| `(onChange)="..."` | `(selectionChange)="..."` | ⚠️ Nome diferente |
| `(onFocus)="..."` | `(focus)="..."` | ⚠️ Nome diferente |
| `(onBlur)="..."` | `(blur)="..."` | ⚠️ Nome diferente |

### Estrutura de Dados (SelectItem)

**Formato PrimeNG/Atual:**
```typescript
interface SelectItem {
  label: string;
  value: any;
  disabled?: boolean;
  icon?: string;
  title?: string;
}
```

**Formato DSC (verificar documentação):**
```typescript
// Provavelmente similar ou compatível
// Pode precisar de adapter se diferente
```

---

## ⚠️ Pontos de Atenção

### 1. **Compatibilidade de Dados**
- Verificar se o formato `SelectItem` do DSC é compatível com PrimeNG
- Se não for, criar adapter no wrapper

### 2. **Validação de Formulários**
- Garantir que a validação do Angular Reactive Forms continua funcionando
- Testar exibição de mensagens de erro

### 3. **Eventos Customizados**
- Componentes atuais emitem: `dadoSelecionado`, `dados`, `dadosCombo`
- Manter esses eventos para não quebrar componentes pai

### 4. **Progress Bar**
- Componentes atuais mostram `p-progressBar` durante carregamento
- Verificar se DSC tem loading interno ou manter progressBar externo

### 5. **Filtros e Busca**
- Componentes como `asc-select-procedimento` têm lógica de filtro complexa
- Garantir que `searchable` do DSC suporta essas necessidades

### 6. **Lazy Loading**
- Alguns componentes carregam dados sob demanda (ex: procedimentos)
- Verificar se DSC suporta ou adaptar lógica

### 7. **Templates Customizados**
- PrimeNG usa `ng-template` para customizar items
- Verificar se DSC oferece slot similar

### 8. **Acessibilidade**
- Verificar se DSC mantém atributos ARIA e acessibilidade

### 9. **Estilos Globais**
- Importar CSS/SCSS da biblioteca DSC no projeto
- Verificar se não há conflitos com estilos existentes

---

## 📝 Checklist de Implementação

### Preparação
- [ ] Analisar documentação completa do `DscSelectComponent`
- [ ] Criar branch de desenvolvimento: `feature/migracao-dsc-select`
- [ ] Fazer backup dos componentes originais
- [ ] Configurar ambiente de testes

### Implementação - Fase 1 (asc-input)
- [ ] **asc-select-conselho-profissional**
  - [ ] Criar novo template com `dsc-select`
  - [ ] Testar carregamento de dados
  - [ ] Testar validação de formulário
  - [ ] Testar evento `dadoSelecionado`
  - [ ] Verificar estilos aplicados
  
- [ ] **asc-select-uf**
  - [ ] Criar novo template com `dsc-select`
  - [ ] Testar carregamento do localStorage
  - [ ] Testar seleção e eventos
  - [ ] Verificar estilos aplicados
  
- [ ] **asc-select-municipio**
  - [ ] Criar novo template com `dsc-select`
  - [ ] Testar parametrização (depende de UF)
  - [ ] Testar carregamento dinâmico
  - [ ] Verificar estilos aplicados

### Implementação - Fase 2 (asc-select)
- [ ] **asc-dropdown**
  - [ ] Substituir `p-dropdown` por `dsc-select`
  - [ ] Adaptar lógica de filtro customizado
  - [ ] Testar com todos os componentes dependentes
  
- [ ] **Componentes específicos** (cada um):
  - [ ] asc-select-procedimento
  - [ ] asc-select-tipo-ocorrencia
  - [ ] asc-select-medicamentos
  - [ ] asc-select-medicamento-apresentacao
  - [ ] asc-select-laboratorio
  - [ ] asc-select-especialidade
  - [ ] asc-select-autorizacao-previa
  - [ ] asc-graus-procedimento

### Testes
- [ ] Testes unitários de cada componente modificado
- [ ] Testes de integração com formulários existentes
- [ ] Testes E2E dos fluxos principais
- [ ] Verificação visual em diferentes resoluções
- [ ] Teste de acessibilidade (navegação por teclado)
- [ ] Teste de performance (carregamento de grandes listas)

### Documentação
- [ ] Documentar mudanças no README
- [ ] Atualizar guia de estilo interno
- [ ] Criar exemplos de uso dos novos componentes

### Deploy
- [ ] Code review
- [ ] Merge para develop
- [ ] Teste em ambiente de staging
- [ ] Deploy para produção
- [ ] Monitoramento pós-deploy

---

## 🚀 Estratégia de Rollout

### Opção 1: Big Bang (NÃO RECOMENDADO)
- Substituir todos de uma vez
- ❌ Alto risco
- ❌ Difícil de debugar problemas

### Opção 2: Gradual por Tipo (RECOMENDADO)
1. **Semana 1-2**: Migrar componentes `asc-input` (conselho, uf, municipio)
2. **Semana 3**: Testar intensivamente em staging
3. **Semana 4**: Migrar `asc-dropdown`
4. **Semana 5-6**: Migrar componentes específicos `asc-select`
5. **Semana 7**: Testes finais e ajustes
6. **Semana 8**: Deploy produção

### Opção 3: Feature Flag
- Usar feature toggle para ativar novos componentes
- Permite rollback instantâneo
- ✅ Mais seguro
- ⚠️ Requer infraestrutura adicional

---

## 📊 Estimativa de Esforço

| Tarefa | Esforço | Observações |
|--------|---------|-------------|
| Análise detalhada DSC docs | 4h | Entender API completa |
| Setup e configuração | 2h | Imports, módulos, estilos globais |
| Componente piloto (1º) | 8h | Aprender padrão, resolver issues |
| Componentes subsequentes (cada) | 2-4h | Replicar padrão aprendido |
| asc-dropdown (crítico) | 8h | Muitos dependentes |
| Testes (por componente) | 2h | Unit + integration |
| Testes E2E gerais | 8h | Fluxos completos |
| Documentação | 4h | README, guias |
| **TOTAL Fase 1** | ~30-40h | 3 componentes principais |
| **TOTAL Fase 2** | ~50-70h | 8+ componentes específicos |
| **TOTAL PROJETO** | ~80-110h | 2-3 semanas full-time |

---

## 🔗 Dependências

### Módulos a Importar
```typescript
// Em módulos relevantes
import { DscSelectComponent } from 'sidsc-components/dsc-select';
import { DscCaixaModule } from 'app/shared/dsc-caixa/dsc-caixa.module';
```

### Estilos Globais
```scss
// Em styles.scss ou angular.json
@import 'sidsc-components/styles';
// ou
@import '@caixa/design-system/styles';
```

### Package.json
Verificar se `sidsc-components` está instalado e atualizado:
```json
{
  "dependencies": {
    "sidsc-components": "^x.x.x"
  }
}
```

---

## 🐛 Troubleshooting Previsto

### Problema 1: Estilos não aplicados
**Causa**: ViewEncapsulation ou CSS não importado  
**Solução**: 
```typescript
@Component({
  encapsulation: ViewEncapsulation.None
})
```
Ou importar estilos globalmente.

### Problema 2: SelectItems não reconhecidos
**Causa**: Formato incompatível entre PrimeNG e DSC  
**Solução**: Criar adapter:
```typescript
private adaptToDscFormat(items: SelectItem[]): DscSelectItem[] {
  return items.map(item => ({
    label: item.label,
    value: item.value,
    // ... outros campos
  }));
}
```

### Problema 3: Eventos não disparam
**Causa**: Nome de evento diferente  
**Solução**: Mapear eventos corretamente no template.

### Problema 4: Validação não funciona
**Causa**: DSC não integra bem com FormControl  
**Solução**: Forçar markAsTouched ou adaptar lógica.

---

## ✅ Critérios de Aceitação

Para considerar a migração concluída:

1. ✅ Todos os componentes `asc-select` usam `DscSelectComponent` visualmente
2. ✅ Nenhum código que usa os componentes foi alterado
3. ✅ Todos os testes unitários passam
4. ✅ Testes E2E dos fluxos principais passam
5. ✅ Visual está conforme design system DSC
6. ✅ Fontes e estilos DSC aplicados corretamente
7. ✅ Acessibilidade mantida (WCAG)
8. ✅ Performance equivalente ou melhor
9. ✅ Sem erros no console
10. ✅ Documentação atualizada

---

## 📚 Referências

- Código atual: `src/app/shared/components/asc-select/`
- Código atual: `src/app/shared/components/asc-input/asc-select/`
- DSC Module: `src/app/shared/dsc-caixa/dsc-caixa.module.ts`
- Exemplo de uso: `asc-profissional-executante.component.html`
- PrimeNG Dropdown: https://primeng.org/dropdown
- Angular Reactive Forms: https://angular.io/guide/reactive-forms

---

## 🎯 Próximos Passos

1. **Revisar este documento** com o time
2. **Validar estratégia** de migração
3. **Obter aprovação** para iniciar
4. **Criar task board** com todos os componentes
5. **Implementar componente piloto** (asc-select-conselho-profissional)
6. **Validar padrão** antes de escalar
7. **Proceder com demais componentes**

---

**Documento criado em**: 21/11/2024  
**Versão**: 1.0  
**Status**: 📋 Aguardando Aprovação


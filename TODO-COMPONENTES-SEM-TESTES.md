# TODO - Componentes Sem Testes

**Data:** 2025-11-13
**Status Atual:** 150/321 componentes com testes (46.7%)
**Pendente:** 171 componentes sem testes (53.3%)

---

## 📊 Resumo Executivo

### Estatísticas:
- **321 componentes totais** no projeto
- **150 componentes com testes** (46.7%)
- **171 componentes sem testes** (53.3%)
- **807 testes passando** nos componentes existentes
- **66 suites com erros** para corrigir

### Priorização:
1. **ALTA:** Corrigir 66 suites com erro → 100% de testes funcionais
2. **MÉDIA:** Adicionar testes aos componentes críticos (listados abaixo)
3. **BAIXA:** Completar cobertura para componentes menos críticos

---

## 🎯 Componentes Sem Testes - Por Módulo

### 1. Funcionalidades - Adesão Titular (7 componentes)
- [ ] acompanhamento-adesao.component (instância 1)
- [ ] acompanhamento-adesao.component (instância 2)
- [ ] cadastro-titular.component
- [ ] etapa-complemento-titular.component
- [ ] etapa-contato-titular.component
- [ ] etapa-resumo-titular.component
- [ ] etapa-tipo-titular.component

**Prioridade:** MÉDIA (fluxo de adesão de titular)

---

### 2. Funcionalidades - Beneficiário Pedido (2 componentes)
- [ ] beneficiario-pedido-form.component
- [ ] beneficiario-pedido-listar.component

**Prioridade:** ALTA (gestão de pedidos é crítica)

---

### 3. Funcionalidades - Dependente (11 componentes)
- [ ] cadastro-dependente.component
- [ ] cancelar-dependente.component
- [ ] renovar-dependente.component
- [ ] acompanhamento-dependente.component (NOTA: existe spec com erro)
- [ ] etapa-selecao-dependente.component (NOTA: existe spec com erro)
- [ ] etapa-tipo-dependente.component (NOTA: existe spec com erro)
- [ ] etapa-dados-dependente.component (NOTA: existe spec com erro)
- [ ] etapa-complemento-dependente.component (NOTA: existe spec com erro)
- [ ] etapa-resumo-incluir.component (NOTA: existe spec com erro)
- [ ] etapa-motivo-renovacao.component (NOTA: existe spec com erro)
- [ ] alterar-dependente.component

**Prioridade:** ALTA (fluxo completo de gestão de dependentes)

---

### 4. Processos - Autorização Prévia (12 componentes)
- [ ] autorizacao-previa-base.component
- [ ] acompanhamento-apr.component
- [ ] detalhar-autorizacao-previa.component
- [ ] documentos.component
- [ ] finalidade-beneficiario.component
- [ ] pagina-inicial-apr.component
- [ ] pedido-enviado.component
- [ ] procedimento.component
- [ ] procedimento-form.component
- [ ] profissional.component
- [ ] resumo.component
- [ ] solicitacao.component
- [ ] validar-procedimentos.component (se existir)

**Prioridade:** ALTA (processo crítico de autorização prévia)

---

### 5. Processos - Reembolso (5 componentes)
- [ ] reembolso-base.component (NOTA: existe spec com erro)
- [ ] acompanhamento.component (reembolso) (NOTA: existe spec com erro)
- [ ] documentos.component
- [ ] documentos-fiscal.component (NOTA: existe spec com erro)
- [ ] reembolso-procedimento.component

**Prioridade:** ALTA (processo crítico de reembolso)
**NOTA:** 7 componentes deste módulo JÁ TÊM specs mas com erros de tipagem

---

### 6. Processos - Inscrição Programas Medicamentos (3 componentes)
- [ ] inscricao-programas-medicamentos-base.component (NOTA: existe spec com erro)
- [ ] acompanhamento-pmd.component (NOTA: existe spec com erro)
- [ ] pagina-incial.component (NOTA: existe spec com erro)
- [ ] patologia.component (NOTA: existe spec com erro)
- [ ] recibo.component
- [ ] resumo.component
- [ ] solicitacao.component

**Prioridade:** MÉDIA (funcionalidade específica)

---

### 7. Funcionalidades - Cartões (Vários)
**Prioridade:** BAIXA (visualização)
- Componentes de cartões diversos (listar, detalhar, etc.)

---

### 8. Funcionalidades - Credenciados (Vários)
**Prioridade:** MÉDIA (gestão de credenciados)
- Componentes de credenciados diversos

---

### 9. Funcionalidades - Dados Cadastrais (Vários)
**Prioridade:** ALTA (dados importantes)
- dados-cadastrais-detail.component (NOTA: existe spec com erro)
- informacoes-pedido-detail.component (NOTA: existe spec com erro)

---

### 10. Funcionalidades - Email Situação
**Prioridade:** BAIXA (notificações)
- Componentes de email situação

---

### 11. Funcionalidades - Empresa Prestador Externo
**Prioridade:** MÉDIA (gestão de prestadores)
- (Maioria JÁ TEM specs, alguns com erros)

---

### 12. Funcionalidades - Extrato IRPF
**Prioridade:** MÉDIA (relatório fiscal)
- Componentes de extrato IRPF

---

### 13. Funcionalidades - Medicamentos
**Prioridade:** MÉDIA (gestão de medicamentos)

---

### 14. Funcionalidades - Mensagens
**Prioridade:** BAIXA (comunicações)

---

### 15. Funcionalidades - Meus Dados
**Prioridade:** MÉDIA (dados do usuário)
- dados-titular.component (jQuery/ModalUtil - difícil de mockar)
- dados-beneficiario.component (NOTA: existe spec com erro jQuery)

---

### 16. Funcionalidades - Motivo Solicitação
**Prioridade:** BAIXA (cadastros auxiliares)

---

### 17. Funcionalidades - Navegação Titular
**Prioridade:** BAIXA (navegação)

---

### 18. Funcionalidades - Parametrização
**Prioridade:** BAIXA (configurações)
- (Maioria JÁ TEM specs)

---

### 19. Funcionalidades - Patologia
**Prioridade:** MÉDIA (gestão de patologias)

---

### 20. Funcionalidades - Perfil Usuário Externo
**Prioridade:** MÉDIA (gestão de usuários)
- (JÁ TEM specs)

---

### 21. Funcionalidades - Pesquisar Processos
**Prioridade:** ALTA (busca crítica)
- (Maioria JÁ TEM specs, alguns com erros)

---

### 22. Funcionalidades - Portabilidade
**Prioridade:** MÉDIA
- portabilidade-detail.component (NOTA: existe spec com erro)

---

### 23. Funcionalidades - Preposto Credenciado
**Prioridade:** MÉDIA
- (JÁ TEM specs mas com erros de tipagem)

---

### 24. Funcionalidades - Prestador Externo
**Prioridade:** MÉDIA
- (JÁ TEM specs mas com erros de tipagem)

---

### 25. Funcionalidades - Procedimentos
**Prioridade:** ALTA (gestão de procedimentos)

---

### 26. Funcionalidades - Procedimentos Cobertos
**Prioridade:** MÉDIA
- (Alguns JÁ TEM specs com erros)

---

### 27. Funcionalidades - Relatórios
**Prioridade:** MÉDIA (business intelligence)
- (Maioria JÁ TEM specs mas com erros de tipagem)

---

### 28. Funcionalidades - Trilha Auditoria
**Prioridade:** BAIXA (auditoria)

---

### 29. Shared Components (Vários - ~60 componentes)

#### asc-acompanhamento-processo (15+)
**Prioridade:** MÉDIA
- Componentes de acompanhamento processo

#### asc-auto-complete (3)
**Prioridade:** BAIXA
- Componentes de auto complete

#### asc-input (25+)
**Prioridade:** ALTA (componentes reutilizáveis fundamentais)
- asc-input-text.component
- asc-input-cpf-cnpj.component
- asc-input-date.component
- asc-input-money.component
- asc-input-telefone.component
- asc-input-error.component
- asc-select-beneficiario.component
- asc-select-uf.component
- asc-select-municipio.component
- asc-select-patologia.component
- asc-text-area.component
- asc-input-base.component
- Outros componentes de input...

#### asc-listagem (1)
**Prioridade:** ALTA (componente reutilizável)
- asc-listagem.component

#### asc-modal (3)
**Prioridade:** MÉDIA
- Componentes de modal

#### asc-pedido (20+)
**Prioridade:** ALTA (fluxo de pedidos)
- (Maioria JÁ TEM specs)
- asc-dados-contato-card.component (NOTA: existe spec com erro)

---

### 30. Arquitetura Components (3 com erros)
**Prioridade:** ALTA (componentes base)
- perfil-cadastro.component (NOTA: existe spec com erro)
- cabecalho-padrao.component (NOTA: existe spec com erro)
- rodape-padrao.component (NOTA: existe spec com erro)

---

## 📋 Plano de Ação Sugerido

### Fase 1: Correção (Prioridade URGENTE)
**Objetivo:** 100% de testes funcionais
**Timeline:** 7-10 horas

✅ Corrigir os 66 arquivos com erros existentes (ver PLANO-CORRECOES-TESTES.md)

**Resultado esperado:** 218/218 suites passando

---

### Fase 2: Componentes Críticos (Prioridade ALTA)
**Objetivo:** Cobrir funcionalidades core
**Timeline:** 20-30 horas

Adicionar testes para:
1. **Beneficiário Pedido** (2 componentes)
2. **Dependente** (11 componentes - após corrigir specs existentes)
3. **Autorização Prévia** (12 componentes)
4. **Reembolso** (5 componentes restantes - após corrigir specs)
5. **Pesquisar Processos** (componentes pendentes)
6. **Shared/asc-input** (25+ componentes reutilizáveis)
7. **Shared/asc-listagem** (1 componente crítico)
8. **Dados Cadastrais** (2 componentes)

**Resultado esperado:** ~58 novos componentes testados

---

### Fase 3: Componentes Secundários (Prioridade MÉDIA)
**Objective:** Expandir cobertura
**Timeline:** 30-40 horas

Adicionar testes para:
1. **Adesão Titular** (7 componentes)
2. **Inscrição Programas Medicamentos** (7 componentes)
3. **Empresa Prestador Externo** (componentes restantes)
4. **Prestador Externo** (componentes restantes)
5. **Procedimentos** (componentes diversos)
6. **Relatórios** (componentes restantes)
7. **Shared/asc-acompanhamento-processo** (15+ componentes)

**Resultado esperado:** ~60 novos componentes testados

---

### Fase 4: Componentes de Suporte (Prioridade BAIXA)
**Objetivo:** Cobertura completa
**Timeline:** 20-30 horas

Adicionar testes para:
1. **Cartões** (visualização)
2. **Email Situação** (notificações)
3. **Trilha Auditoria** (auditoria)
4. **Navegação Titular** (navegação)
5. **Shared/asc-auto-complete** (3 componentes)
6. **Shared/asc-modal** (3 componentes)
7. Demais componentes auxiliares

**Resultado esperado:** ~53 novos componentes testados

---

## 🎯 Metas Finais

### Meta Fase 1 (Urgente):
- **218/218 suites passando** (100%)
- **0 erros de teste**
- **~850 testes passando**

### Meta Fase 2 (Curto Prazo):
- **208/321 componentes testados** (64.8%)
- **1200+ testes passando**

### Meta Fase 3 (Médio Prazo):
- **268/321 componentes testados** (83.5%)
- **1800+ testes passando**

### Meta Fase 4 (Longo Prazo):
- **321/321 componentes testados** (100%)
- **2200+ testes passando**
- **Cobertura de código >80%**

---

## 📝 Notas Importantes

1. **Componentes com specs com erro** já foram convertidos para Jest mas precisam de correção de tipagem
2. **Componentes verdadeiramente sem testes** ainda precisam ter os specs criados do zero
3. **Shared components** são alta prioridade por serem reutilizados em todo o projeto
4. **Processos críticos** (Autorização Prévia, Reembolso, Beneficiário Pedido) devem ter cobertura completa

---

## 🔗 Arquivos Relacionados

- **PLANO-CORRECOES-TESTES.md** - Plano para corrigir 66 suites com erro
- **TODOLIST-TESTES-JEST.md** - Progresso geral da migração Jasmine→Jest
- **test-results.txt** - Última execução completa dos testes
- **componentes-sem-testes.txt** - Lista completa de componentes sem testes

---

**Última atualização:** 2025-11-13 22:51
**Próxima revisão:** Após correção dos erros existentes (Fase 1)

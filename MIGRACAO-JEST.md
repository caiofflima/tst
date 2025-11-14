# Migração de Jasmine/Karma para Jest - Completa ✅

## O que foi feito

### 1. Desinstalação de Pacotes Jasmine/Karma
Foram removidos os seguintes pacotes:
- `@types/jasmine`
- `jasmine-core`
- `karma`
- `karma-chrome-launcher`
- `karma-coverage`
- `karma-coverage-istanbul-reporter`
- `karma-jasmine`
- `karma-jasmine-html-reporter`
- `karma-junit-reporter`
- `karma-sonarqube-reporter`
- `karma-spec-reporter`
- `karma-firefox-launcher`

### 2. Instalação de Pacotes Jest
Foram instalados:
- `jest@29.7.0`
- `@types/jest@29.5.14`
- `jest-preset-angular@13.1.6` (compatível com Angular 16)
- `@angular-builders/jest@16.0.1`

### 3. Arquivos Criados

#### jest.config.js
Arquivo de configuração principal do Jest com:
- Preset para Angular
- Setup do ambiente de testes
- Mapeamento de módulos
- Configuração de cobertura
- Serializers para snapshots

#### setup-jest.ts
Configuração do ambiente de testes com:
- Mock de localStorage
- Mock de sessionStorage
- Mock de window.matchMedia
- Mock de getComputedStyle
- Supressão de console warnings

### 4. Arquivos Atualizados

#### tsconfig.spec.json
- Substituído `jasmine` por `jest` em types
- Adicionado `esModuleInterop` e `emitDecoratorMetadata`
- Removida referência a `src/test.ts`
- Incluído `setup-jest.ts`

#### package.json
Novos scripts:
```json
"test": "jest",
"test:watch": "jest --watch",
"test:coverage": "jest --coverage",
"test:ci": "jest --ci --coverage --maxWorkers=2"
```

#### angular.json
- Substituído builder de `@angular-devkit/build-angular:karma` para `@angular-builders/jest:run`
- Simplificada configuração de testes

### 5. Arquivos Removidos
- `karma.conf.js`
- `src/test.ts`

---

## Como Usar

### Executar todos os testes
```bash
npm test
```

### Executar testes em modo watch
```bash
npm run test:watch
```

### Executar testes com cobertura
```bash
npm run test:coverage
```

### Executar testes em CI
```bash
npm run test:ci
```

### Executar testes específicos
```bash
npm test -- app.component.spec.ts
```

### Executar testes com pattern
```bash
npm test -- --testPathPattern=perfil
```

---

## Diferenças entre Jasmine e Jest

### Mocks

**Jasmine:**
```typescript
const service = jasmine.createSpyObj('Service', ['method']);
service.method.and.returnValue(of(data));
```

**Jest:**
```typescript
const service = {
  method: jest.fn()
} as jest.Mocked<Service>;
service.method.mockReturnValue(of(data));
```

### Spies

**Jasmine:**
```typescript
spyOn(console, 'log');
expect(console.log).toHaveBeenCalled();
```

**Jest:**
```typescript
const spy = jest.spyOn(console, 'log').mockImplementation();
expect(spy).toHaveBeenCalled();
spy.mockRestore();
```

### Expect

Ambos são muito similares, mas Jest tem mais matchers:
- `toBeInstanceOf()`
- `toBeGreaterThan()`
- `toContainEqual()`
- etc.

---

## Estrutura de Teste Recomendada

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from './component';
import { Service } from './service';

describe('Component', () => {
    let component: Component;
    let fixture: ComponentFixture<Component>;
    let service: jest.Mocked<Service>;

    beforeEach(async () => {
        service = {
            method: jest.fn()
        } as jest.Mocked<Service>;

        await TestBed.configureTestingModule({
            declarations: [Component],
            providers: [
                { provide: Service, useValue: service }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    // Mais testes...
});
```

---

## Cobertura de Código

A cobertura é gerada na pasta `coverage/`:
- `coverage/index.html` - Relatório HTML interativo
- `coverage/lcov.info` - Formato LCOV para CI/CD
- `coverage/coverage-summary.json` - Resumo em JSON

---

## Troubleshooting

### Erro: Cannot find module
- Verifique o `moduleNameMapper` em `jest.config.js`
- Adicione o mapeamento necessário

### Erro: Unexpected token
- Verifique `transformIgnorePatterns` em `jest.config.js`
- Adicione o módulo que precisa ser transformado

### Testes muito lentos
- Use `npm run test:ci` para testes em CI
- Ajuste `maxWorkers` se necessário

### Mock não funciona
- Certifique-se de usar `jest.Mocked<T>`
- Use `mockReturnValue()` ou `mockImplementation()`

---

## Referências

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Jest Preset Angular](https://github.com/thymikee/jest-preset-angular)
- [Angular Testing Guide](https://angular.io/guide/testing)
- [Jest Matchers](https://jestjs.io/docs/expect)

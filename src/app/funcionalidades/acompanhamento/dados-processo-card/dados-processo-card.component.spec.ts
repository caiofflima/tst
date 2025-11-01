import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CampoVazioHifen } from './../../../shared/pipes/campo-vazio.pipe';
import { DadosProcessoCardComponent } from './dados-processo-card.component';

describe('DadosProcessoCardComponent', () => {
  let component: DadosProcessoCardComponent;
  let fixture: ComponentFixture<DadosProcessoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DadosProcessoCardComponent, CampoVazioHifen],
    })
.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DadosProcessoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Inicializa o componente
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy(); // Verifica se o componente é criado
  });

  it('deve ter uma propriedade de processo inicializada como undefined', () => {
    expect(component.processo).toBeUndefined(); // Verifica se a propriedade processo está inicialmente indefinida
  });

  it('deve permitir a definição da propriedade processo através de @Input()', () => {
    const mockProcesso = { id: 1, nome: 'Processo 1' };
    component.processo = mockProcesso; // Define a propriedade processo
    expect(component.processo).toEqual(mockProcesso); // Verifica se a propriedade foi definida corretamente
  });

  it('deve inicializar a observacao como uma string vazia', () => {
    expect(component.observacao).toBe(''); // Verifica se a observacao é uma string vazia
  });

  it('deve executar goToTop e rolar a página para o topo', () => {
    spyOn(window, 'scrollTo'); // Espiona a função scrollTo do objeto window
    component.goToTop(); // Chama o método
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0); // Verifica se scrollTo foi chamado com os argumentos corretos
  });
});
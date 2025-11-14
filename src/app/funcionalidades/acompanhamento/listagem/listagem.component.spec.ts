import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListagemComponent } from './listagem.component';

describe('ListagemComponent', () => {
  let component: ListagemComponent;
  let fixture: ComponentFixture<ListagemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListagemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Inicializa o componente
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy(); // Verifica se o componente foi criado
  });

  it('deve chamar ngOnInit ao inicializar', () => {
    jest.jest.jest.jest.spyOn(console, 'log'); // Espiona a função console.log
    component.ngOnInit(); // Chama ngOnInit
    expect(console.log).toHaveBeenCalled(); // Verifica se console.log foi chamado
  });
});
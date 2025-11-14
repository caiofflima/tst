import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrestadorExternoService } from 'app/shared/services/services';
import { of } from 'rxjs';
import { ProfissionalCardComponent } from './profissional-card.component';

describe('ProfissionalCardComponent', () => {
  let component: ProfissionalCardComponent;
  let fixture: ComponentFixture<ProfissionalCardComponent>;
  const prestadorExternoServiceSpy = { get: jest.fn(), consultarUsuarioExternoPorFiltro: jest.fn() };
  prestadorExternoServiceSpy.consultarUsuarioExternoPorFiltro.mockReturnValue(of({})

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfissionalCardComponent],
      providers:[  {provide: PrestadorExternoService, useValue: prestadorExternoServiceSpy },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfissionalCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Inicializa o componente
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy(); // Verifica se o componente foi criado
  });

  it('deve ter a propriedade profissional inicializada corretamente', () => {
    expect(component.profissional).toBeDefined(); // Verifica se a propriedade profissional está definida
    expect(component.profissional).toEqual({
      conselho: 'Conselho Regional de Odontologia',
      cpfCnpj: '00.610.980/0001-44',
      conselhoNum: 25876,
      nome: "Hospital Santa Maria",
      conselhoUf: 'DF',
      uf: 'DF',
      municipio: 'Brasília'
    }); // Verifica se a propriedade profissional contém os dados corretos
  });
});
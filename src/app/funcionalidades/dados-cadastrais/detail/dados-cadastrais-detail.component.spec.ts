import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DadosCadastraisDetailComponent } from './dados-cadastrais-detail.component';

describe('DadosCadastraisDetailComponent', () => {
  let component: DadosCadastraisDetailComponent;
  let fixture: ComponentFixture<DadosCadastraisDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DadosCadastraisDetailComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DadosCadastraisDetailComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});

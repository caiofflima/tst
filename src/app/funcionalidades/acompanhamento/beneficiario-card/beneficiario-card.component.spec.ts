import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Beneficiario } from "../../../shared/models/comum/beneficiario";
import { Pedido } from "../../../shared/models/comum/pedido";
import { CampoVazioHifen } from './../../../shared/pipes/campo-vazio.pipe';
import { BeneficiarioCardComponent } from './beneficiario-card.component';

class MockUtil {
  static getDate(dateString: string): Date {
    return new Date(dateString);
  }
}

describe('BeneficiarioCardComponent', () => {
  let component: BeneficiarioCardComponent;
  let fixture: ComponentFixture<BeneficiarioCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BeneficiarioCardComponent, CampoVazioHifen],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiarioCardComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar com idadeBeneficiario igual a 0', () => {
    expect(component.idadeBeneficiario).toBe(0);
  });

  it('deve extrair a idade do beneficiário corretamente', () => {
    const dataNascimento = '2000-01-01'; // data de nascimento fictícia
    const pedido: Pedido = {
      beneficiario: {
        matricula: { 
          dataNascimento: dataNascimento
        }
      }
    } as Pedido;

    component.ngOnInit(); // Chama ngOnInit para executar a lógica
    component.processo = pedido; // Define o input processo
    expect(component.idadeBeneficiario).toBeGreaterThan(0); // A idade deve ser maior que 0
  });

  it('deve extrair o beneficiário do processo corretamente', () => {
    const pedido: Pedido = {
      beneficiario: new Beneficiario() 
    } as Pedido;

    component.processo = pedido; // Define o input processo
    component.ngOnInit(); // Chama ngOnInit para executar a lógica

    expect(component.beneficiario).toEqual(pedido.beneficiario); // Verifica se o beneficiário foi extraído corretamente
  });

  it('deve chamar ngOnDestroy e completar o unsubscribe', () => {
    spyOn(component['unsubscribe'], 'next');
    spyOn(component['unsubscribe'], 'complete');

    component.ngOnDestroy();

    expect(component['unsubscribe'].next).toHaveBeenCalled();
    expect(component['unsubscribe'].complete).toHaveBeenCalled();
  });
});
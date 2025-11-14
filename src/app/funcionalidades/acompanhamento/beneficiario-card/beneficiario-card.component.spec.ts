import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BeneficiarioCardComponent } from './beneficiario-card.component';
import { Pedido } from '../../../shared/models/comum/pedido';
import { Beneficiario } from '../../../shared/models/comum/beneficiario';
import { Matricula } from '../../../shared/models/comum/matricula';

describe('BeneficiarioCardComponent', () => {
    let component: BeneficiarioCardComponent;
    let fixture: ComponentFixture<BeneficiarioCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BeneficiarioCardComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BeneficiarioCardComponent);
        component = fixture.componentInstance;
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve inicializar beneficiario como novo Beneficiario', () => {
        expect(component.beneficiario).toBeInstanceOf(Beneficiario);
    });

    it('deve inicializar idadeBeneficiario como 0', () => {
        expect(component.idadeBeneficiario).toBe(0);
    });

    it('deve inicializar newdate como Date', () => {
        expect(component.newdate).toBeInstanceOf(Date);
    });

    it('setter processo deve atualizar _processo', () => {
        const mockPedido: Pedido = {
            id: 1,
            numero: 'PED-001',
            beneficiario: new Beneficiario()
        } as Pedido;

        component.processo = mockPedido;

        expect(component.processo).toEqual(mockPedido);
    });

    it('setter processo deve emitir evento processo$', (done) => {
        const mockPedido: Pedido = {
            id: 1,
            numero: 'PED-001',
            beneficiario: new Beneficiario()
        } as Pedido;

        component.processo$.subscribe((processo: Pedido) => {
            expect(processo).toEqual(mockPedido);
            done();
        });

        component.processo = mockPedido;
    });

    it('getter processo deve retornar _processo', () => {
        const mockPedido: Pedido = {
            id: 1,
            numero: 'PED-001',
            beneficiario: new Beneficiario()
        } as Pedido;

        component['_processo'] = mockPedido;

        expect(component.processo).toEqual(mockPedido);
    });

    it('deve extrair beneficiario do processo no ngOnInit', (done) => {
        const mockBeneficiario = new Beneficiario();
        mockBeneficiario.nome = 'João Silva';

        const mockMatricula = new Matricula();
        mockMatricula.dataNascimento = '1990-01-01';

        mockBeneficiario.matricula = mockMatricula;

        const mockPedido: Pedido = {
            id: 1,
            beneficiario: mockBeneficiario
        } as Pedido;

        fixture.detectChanges(); // Chama ngOnInit

        component.processo = mockPedido;

        setTimeout(() => {
            expect(component.beneficiario).toEqual(mockBeneficiario);
            done();
        }, 100);
    });

    it('ngOnDestroy deve chamar next e complete no unsubscribe', () => {
        const nextSpy = jest.jest.jest.spyOn(component['unsubscribe'], 'next');
        const completeSpy = jest.jest.jest.spyOn(component['unsubscribe'], 'complete');

        component.ngOnDestroy();

        expect(nextSpy).toHaveBeenCalled();
        expect(completeSpy).toHaveBeenCalled();
    });

    it('deve ter processo$ como EventEmitter', () => {
        expect(component.processo$).toBeDefined();
        expect(typeof component.processo$.emit).toBe('function');
    });

    it('deve aceitar user como Input', () => {
        const mockUser = { id: 1, nome: 'Usuário Teste' };

        component.user = mockUser;

        expect(component.user).toEqual(mockUser);
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MessageService } from 'app/shared/services/services';
import { Perfil } from '../../../shared/models/seguranca/perfil';
import { PerfilService } from '../../../shared/services/seguranca/perfil.service';
import { PerfilConsultaComponent } from './perfil-consulta.component';

describe('PerfilConsultaComponent', () => {
    let component: PerfilConsultaComponent;
    let fixture: ComponentFixture<PerfilConsultaComponent>;
    let messageService: jest.Mocked<MessageService>;
    let router: jest.Mocked<Router>;
    let activatedRoute: any;
    let perfilService: jest.Mocked<PerfilService>;

    beforeEach(async () => {
        messageService = {
            addMsgDanger: jest.fn(),
            addMsgSuccess: jest.fn(),
            addConfirmYesNo: jest.fn()
        } as unknown as jest.Mocked<MessageService>;

        router = {
            navigate: jest.fn()
        } as unknown as jest.Mocked<Router>;

        activatedRoute = {
            parent: {}
        };

        perfilService = {
            consultarPorNome: jest.fn(),
            delete: jest.fn()
        } as unknown as jest.Mocked<PerfilService>;

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [PerfilConsultaComponent],
            providers: [
                FormBuilder,
                { provide: MessageService, useValue: messageService },
                { provide: Router, useValue: router },
                { provide: ActivatedRoute, useValue: activatedRoute },
                { provide: PerfilService, useValue: perfilService }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PerfilConsultaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve inicializar com valores padrão', () => {
        expect(component.pagina).toBe(1);
        expect(component.itens).toBe(5);
        expect(component.nome).toBe('');
        expect(component.perfis).toBeNull();
    });

    it('deve inicializar o formulário com campo nome', () => {
        expect(component.formulario).toBeDefined();
        expect(component.formulario.get('nome')).toBeDefined();
        expect(component.formulario.get('nome')?.value).toBe('');
    });

    it('consultar deve chamar perfilService.consultarPorNome e definir perfis', () => {
        const mockPerfis: Perfil[] = [
            { id: 1, codigo: 'ADMIN', descricao: 'Administrador' } as Perfil,
            { id: 2, codigo: 'USER', descricao: 'Usuário' } as Perfil
        ];
        perfilService.consultarPorNome.mockReturnValue(of(mockPerfis));

        component.nome = 'ADMIN';
        component.consultar();

        expect(perfilService.consultarPorNome).toHaveBeenCalledWith('ADMIN');
        expect(component.perfis).toEqual(mockPerfis);
    });

    it('consultar deve mostrar mensagem de erro ao falhar', () => {
        perfilService.consultarPorNome.mockReturnValue(throwError(() => new Error('Erro')));

        component.consultar();

        expect(messageService.addMsgDanger).toHaveBeenCalledWith('Ocorreu um erro ao pesquisar perfis.');
    });

    it('incluir deve navegar para a rota de novo perfil', () => {
        component.incluir();

        expect(router.navigate).toHaveBeenCalledWith(['novo'], { relativeTo: activatedRoute.parent });
    });

    it('alterar deve navegar para a rota de edição do perfil', () => {
        const mockPerfil: Perfil = { id: 123, codigo: 'ADMIN' } as Perfil;

        component.alterar(mockPerfil);

        expect(router.navigate).toHaveBeenCalledWith([123, 'editar'], { relativeTo: activatedRoute.parent });
    });

    it('excluir deve mostrar confirmação com ID do perfil', () => {
        const mockPerfil: Perfil = { id: 1, codigo: 'ADMIN' } as Perfil;
        component.perfis = [mockPerfil];

        component.excluir(mockPerfil);

        expect(messageService.addConfirmYesNo).toHaveBeenCalledWith(
            'Deseja realmente excluir o perfil de ID 1?',
            expect.any(Function),
            null,
            null,
            'Sim',
            'Não'
        );
    });

    it('excluir deve excluir perfil com sucesso e remover da lista', () => {
        const mockPerfil: Perfil = { id: 1, codigo: 'ADMIN' } as Perfil;
        component.perfis = [mockPerfil];
        perfilService.delete.mockReturnValue(of(null));
        messageService.addConfirmYesNo.mockImplementation((msg: string, listenerYes: () => void) => {
            listenerYes();
        });

        component.excluir(mockPerfil);

        expect(perfilService.delete).toHaveBeenCalledWith(1);
        expect(messageService.addMsgSuccess).toHaveBeenCalledWith('Perfil excluído com sucesso.');
        expect(component.perfis.length).toBe(0);
    });

    it('excluir deve mostrar erro ao falhar ao excluir perfil', () => {
        const mockPerfil: Perfil = { id: 1, codigo: 'ADMIN' } as Perfil;
        component.perfis = [mockPerfil];
        perfilService.delete.mockReturnValue(throwError(() => new Error('Erro')));
        messageService.addConfirmYesNo.mockImplementation((msg: string, listenerYes: () => void) => {
            listenerYes();
        });

        component.excluir(mockPerfil);

        expect(perfilService.delete).toHaveBeenCalledWith(1);
        expect(messageService.addMsgDanger).toHaveBeenCalledWith('Ocorreu um erro ao excluir o perfil.');
    });

    it('excluir deve remover apenas o perfil correto da lista', () => {
        const mockPerfil1: Perfil = { id: 1, codigo: 'ADMIN' } as Perfil;
        const mockPerfil2: Perfil = { id: 2, codigo: 'USER' } as Perfil;
        const mockPerfil3: Perfil = { id: 3, codigo: 'GUEST' } as Perfil;
        component.perfis = [mockPerfil1, mockPerfil2, mockPerfil3];
        perfilService.delete.mockReturnValue(of(null));
        messageService.addConfirmYesNo.mockImplementation((msg: string, listenerYes: () => void) => {
            listenerYes();
        });

        component.excluir(mockPerfil2);

        expect(component.perfis.length).toBe(2);
        expect(component.perfis).toEqual([mockPerfil1, mockPerfil3]);
    });

    it('excluir não deve remover da lista se perfil não for encontrado', () => {
        const mockPerfil1: Perfil = { id: 1, codigo: 'ADMIN' } as Perfil;
        const mockPerfilNaoExiste: Perfil = { id: 999, codigo: 'NAO_EXISTE' } as Perfil;
        component.perfis = [mockPerfil1];
        perfilService.delete.mockReturnValue(of(null));
        messageService.addConfirmYesNo.mockImplementation((msg: string, listenerYes: () => void) => {
            listenerYes();
        });

        component.excluir(mockPerfilNaoExiste);

        expect(component.perfis.length).toBe(1);
        expect(component.perfis).toEqual([mockPerfil1]);
    });

    it('handleSelectElemChange deve atualizar itens com o valor do select', () => {
        const mockEvent = {
            target: {
                value: '10'
            }
        } as unknown as Event;

        component.handleSelectElemChange(mockEvent);

        expect(component.itens).toBe(10);
    });

    it('handleSelectElemChange deve converter string para número', () => {
        const mockEvent = {
            target: {
                value: '25'
            }
        } as unknown as Event;

        component.handleSelectElemChange(mockEvent);

        expect(component.itens).toBe(25);
        expect(typeof component.itens).toBe('number');
    });
});

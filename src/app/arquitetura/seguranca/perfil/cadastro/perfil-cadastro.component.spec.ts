import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { MessageService } from 'app/shared/services/services';
import { Perfil } from '../../../shared/models/seguranca/perfil';
import { PerfilService } from '../../../shared/services/seguranca/perfil.service';
import { PerfilCadastroComponent } from './perfil-cadastro.component';
import { DATAHORA_MASK } from 'app/shared/util/masks';

describe('PerfilCadastroComponent', () => {
    let component: PerfilCadastroComponent;
    let fixture: ComponentFixture<PerfilCadastroComponent>;
    let messageService: jest.Mocked<MessageService>;
    let router: jest.Mocked<Router>;
    let activatedRoute: any;
    let perfilService: jest.Mocked<PerfilService>;
    let paramsSubject: Subject<any>;

    beforeEach(async () => {
        paramsSubject = new Subject<any>();

        messageService = {
            addMsgDanger: jest.fn(),
            addMsgSuccess: jest.fn(),
            addConfirmYesNo: jest.fn()
        } as unknown as jest.Mocked<MessageService>;

        router = {
            navigate: jest.fn()
        } as unknown as jest.Mocked<Router>;

        activatedRoute = {
            params: paramsSubject.asObservable(),
            parent: {}
        };

        perfilService = {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn()
        } as unknown as jest.Mocked<PerfilService>;

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [PerfilCadastroComponent],
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
        fixture = TestBed.createComponent(PerfilCadastroComponent);
        component = fixture.componentInstance;
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve inicializar o formulário com os campos corretos', () => {
        paramsSubject.next({});

        expect(component.formulario).toBeDefined();
        expect(component.formulario.get('id')).toBeDefined();
        expect(component.formulario.get('nome')).toBeDefined();
        expect(component.formulario.get('descricao')).toBeDefined();
        expect(component.formulario.get('usuarioUltimaAtualizacao')).toBeDefined();
        expect(component.formulario.get('terminalUltimaAtualizacao')).toBeDefined();
        expect(component.formulario.get('dataHoraUltimaAtualizacao')).toBeDefined();
    });

    it('deve inicializar maskDataHora com DATAHORA_MASK', () => {
        paramsSubject.next({});

        expect(component.maskDataHora).toBe(DATAHORA_MASK);
    });

    it('deve criar um novo Perfil no constructor', () => {
        paramsSubject.next({});

        expect(component.perfil).toBeInstanceOf(Perfil);
    });

    it('isNew deve retornar true quando perfil não tem id', () => {
        paramsSubject.next({});
        component.perfil = new Perfil();

        const resultado = component.isNew();

        expect(resultado).toBe(true);
    });

    it('isNew deve retornar false quando perfil tem id', () => {
        paramsSubject.next({});
        component.perfil = { id: 1 } as Perfil;

        const resultado = component.isNew();

        expect(resultado).toBe(false);
    });

    it('isAlteracao deve retornar true quando não é novo', () => {
        paramsSubject.next({});
        component.perfil = { id: 1 } as Perfil;

        const resultado = component.isAlteracao();

        expect(resultado).toBe(true);
    });

    it('isAlteracao deve retornar false quando é novo', () => {
        paramsSubject.next({});
        component.perfil = new Perfil();

        const resultado = component.isAlteracao();

        expect(resultado).toBe(false);
    });

    it('deve carregar perfil existente quando tem ID nos params', () => {
        const perfilMock: Perfil = {
            id: 123,
            codigo: 'ADMIN',
            descricao: 'Administrador'
        } as Perfil;

        perfilService.get.mockReturnValue(of(perfilMock));

        paramsSubject.next({ id: 123 });

        expect(perfilService.get).toHaveBeenCalledWith(123);
        expect(component.perfil).toEqual(perfilMock);
    });

    it('deve mostrar mensagem de erro ao falhar ao carregar perfil', () => {
        perfilService.get.mockReturnValue(throwError(() => new Error('Erro')));

        paramsSubject.next({ id: 123 });

        expect(perfilService.get).toHaveBeenCalledWith(123);
        expect(messageService.addMsgDanger).toHaveBeenCalledWith('Ocorreu um erro ao carregar o perfil.');
    });

    it('não deve carregar perfil quando não tem ID nos params', () => {
        paramsSubject.next({});

        expect(perfilService.get).not.toHaveBeenCalled();
    });

    it('gravar deve mostrar mensagem de campos obrigatórios quando formulário inválido', () => {
        paramsSubject.next({});
        component.formulario.patchValue({
            nome: '',
            descricao: ''
        });

        component.gravar();

        expect(messageService.addMsgDanger).toHaveBeenCalledWith('Preencha os campos Obrigatórios.');
        expect(perfilService.post).not.toHaveBeenCalled();
        expect(perfilService.put).not.toHaveBeenCalled();
    });

    it('gravar deve inserir novo perfil com sucesso', () => {
        const perfilRetornado: Perfil = { id: 1, codigo: 'TESTE', descricao: 'Teste' } as Perfil;
        perfilService.post.mockReturnValue(of(perfilRetornado));

        paramsSubject.next({});
        component.perfil = new Perfil();
        component.perfil.codigo = 'TESTE';
        component.perfil.descricao = 'Teste';
        component.formulario.patchValue({
            nome: 'TESTE',
            descricao: 'Teste'
        });

        component.gravar();

        expect(perfilService.post).toHaveBeenCalledWith(component.perfil);
        expect(messageService.addMsgSuccess).toHaveBeenCalledWith('Perfil inserido com sucesso.');
        expect(router.navigate).toHaveBeenCalledWith([1, 'editar'], { relativeTo: activatedRoute.parent });
    });

    it('gravar deve mostrar erro ao falhar ao inserir novo perfil', () => {
        perfilService.post.mockReturnValue(throwError(() => new Error('Erro')));

        paramsSubject.next({});
        component.perfil = new Perfil();
        component.perfil.codigo = 'TESTE';
        component.perfil.descricao = 'Teste';
        component.formulario.patchValue({
            nome: 'TESTE',
            descricao: 'Teste'
        });

        component.gravar();

        expect(perfilService.post).toHaveBeenCalled();
        expect(messageService.addMsgDanger).toHaveBeenCalledWith('Ocorreu um erro ao incluir o perfil.');
    });

    it('gravar deve alterar perfil existente com sucesso', () => {
        const perfilAtualizado: Perfil = { id: 1, codigo: 'TESTE_ALT', descricao: 'Teste Alterado' } as Perfil;
        perfilService.put.mockReturnValue(of(perfilAtualizado));

        paramsSubject.next({});
        component.perfil = { id: 1, codigo: 'TESTE_ALT', descricao: 'Teste Alterado' } as Perfil;
        component.formulario.patchValue({
            nome: 'TESTE_ALT',
            descricao: 'Teste Alterado'
        });

        component.gravar();

        expect(perfilService.put).toHaveBeenCalledWith(component.perfil);
        expect(component.perfil).toEqual(perfilAtualizado);
        expect(messageService.addMsgSuccess).toHaveBeenCalledWith('Perfil alterado com sucesso.');
    });

    it('gravar deve mostrar erro ao falhar ao alterar perfil existente', () => {
        perfilService.put.mockReturnValue(throwError(() => new Error('Erro')));

        paramsSubject.next({});
        component.perfil = { id: 1, codigo: 'TESTE', descricao: 'Teste' } as Perfil;
        component.formulario.patchValue({
            nome: 'TESTE',
            descricao: 'Teste'
        });

        component.gravar();

        expect(perfilService.put).toHaveBeenCalled();
        expect(messageService.addMsgDanger).toHaveBeenCalledWith('Ocorreu um erro ao alterar o perfil.');
    });

    it('excluir deve mostrar confirmação e excluir perfil com sucesso', () => {
        perfilService.delete.mockReturnValue(of(null));
        messageService.addConfirmYesNo.mockImplementation((msg: string, listenerYes: () => void) => {
            listenerYes();
        });

        paramsSubject.next({});
        component.perfil = { id: 1 } as Perfil;

        component.excluir();

        expect(messageService.addConfirmYesNo).toHaveBeenCalledWith(
            'Deseja realmente excluir o perfil?',
            expect.any(Function),
            null,
            null,
            'Sim',
            'Não'
        );
        expect(perfilService.delete).toHaveBeenCalledWith(1);
        expect(messageService.addMsgSuccess).toHaveBeenCalledWith('Perfil excluído com sucesso.');
        expect(router.navigate).toHaveBeenCalledWith(['novo'], { relativeTo: activatedRoute.parent });
    });

    it('excluir deve mostrar erro ao falhar ao excluir perfil', () => {
        perfilService.delete.mockReturnValue(throwError(() => new Error('Erro')));
        messageService.addConfirmYesNo.mockImplementation((msg: string, listenerYes: () => void) => {
            listenerYes();
        });

        paramsSubject.next({});
        component.perfil = { id: 1 } as Perfil;

        component.excluir();

        expect(perfilService.delete).toHaveBeenCalledWith(1);
        expect(messageService.addMsgDanger).toHaveBeenCalledWith('Ocorreu um erro ao excluir o perfil.');
    });

    it('consultar deve navegar para a página de consulta', () => {
        paramsSubject.next({});

        component.consultar();

        expect(router.navigate).toHaveBeenCalledWith(['.'], { relativeTo: activatedRoute.parent });
    });

    it('deve ter campos id, usuarioUltimaAtualizacao, terminalUltimaAtualizacao e dataHoraUltimaAtualizacao desabilitados', () => {
        paramsSubject.next({});

        expect(component.formulario.get('id')?.disabled).toBe(true);
        expect(component.formulario.get('usuarioUltimaAtualizacao')?.disabled).toBe(true);
        expect(component.formulario.get('terminalUltimaAtualizacao')?.disabled).toBe(true);
        expect(component.formulario.get('dataHoraUltimaAtualizacao')?.disabled).toBe(true);
    });

    it('deve ter validators required nos campos nome e descricao', () => {
        paramsSubject.next({});

        const nomeControl = component.formulario.get('nome');
        const descricaoControl = component.formulario.get('descricao');

        nomeControl?.setValue('');
        descricaoControl?.setValue('');

        expect(nomeControl?.hasError('required')).toBe(true);
        expect(descricaoControl?.hasError('required')).toBe(true);
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, SessaoService } from 'app/shared/services/services';
import { of, throwError } from 'rxjs';
import { Perfil } from './../../../shared/models/seguranca/perfil';
import { PerfilService } from './../../../shared/services/seguranca/perfil.service';
import { PerfilCadastroComponent } from './perfil-cadastro.component';

class MockUtil {
  static getDate(dateString: string): Date {
    return new Date(dateString);
  }
}

describe('PerfilCadastroComponent', () => {
  let component: PerfilCadastroComponent;
  let fixture: ComponentFixture<PerfilCadastroComponent>;
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription','addMsgSuccess','addMsgDanger','addConfirmYesNo']);
  const sessaoServiceSpy = jasmine.createSpyObj('SessaoService',['init']);
  const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'url']);
  const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['url']);
  activatedRouteSpy.params = of({id: 1});
  const perfilServiceSpy = jasmine.createSpyObj('PerfilService', ['consultarPorNome','get', 'post', 'put', 'delete']);
  perfilServiceSpy.post.and.returnValue(of({}))
  perfilServiceSpy.put.and.returnValue(of({}))

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerfilCadastroComponent],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: SessaoService, useValue: sessaoServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: PerfilService, useValue: perfilServiceSpy },
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

  it('deve verificar se é um novo cadastro', () => {
    expect(component.isNew()).toBe;
  });

  it('deve verificar se é alteracao', () => {
    component.perfil = {id: 1} as Perfil;
    expect(component.isAlteracao()).toBe;
  });

  it('deve aparecer mensagem de campos obrigatórios', () => {
    component.formulario.setValue({
      id: null,
      nome: 'Teste',
      descricao: null,
      usuarioUltimaAtualizacao : null,
      terminalUltimaAtualizacao: null,
      dataHoraUltimaAtualizacao: null
    });

    component.gravar();
    
    expect(messageServiceSpy.addMsgDanger).toHaveBeenCalledWith('Preencha os campos Obrigatórios.');
  });

  it('deve gravar novo cadastro', () => {
    component.formulario.setValue({
      id: null,
      nome: 'Teste',
      descricao: 'Descricao',
      usuarioUltimaAtualizacao : null,
      terminalUltimaAtualizacao: null,
      dataHoraUltimaAtualizacao: null
    });

    component.gravar();
    
    expect(messageServiceSpy.addMsgSuccess).toHaveBeenCalledWith('Perfil inserido com sucesso.');
  });

  it('deve dar erro ao gravar novo cadastro', () => {
    perfilServiceSpy.post.and.returnValue(throwError(() => new Error('Ocorreu um erro ao incluir o perfil.')));
    component.formulario.setValue({
      id: null,
      nome: 'Teste',
      descricao: 'Descricao',
      usuarioUltimaAtualizacao : null,
      terminalUltimaAtualizacao: null,
      dataHoraUltimaAtualizacao: null
    });

    component.gravar();

    expect(messageServiceSpy.addMsgDanger).toHaveBeenCalledWith('Ocorreu um erro ao incluir o perfil.');
  });

  it('deve gravar cadastro existente', () => {
    component.perfil = {id: 1} as Perfil;
    component.formulario.setValue({
      id: 1,
      nome: 'Teste',
      descricao: 'Descricao',
      usuarioUltimaAtualizacao : null,
      terminalUltimaAtualizacao: null,
      dataHoraUltimaAtualizacao: null
    });

    component.gravar();
    
    expect(messageServiceSpy.addMsgSuccess).toHaveBeenCalledWith('Perfil alterado com sucesso.');
  });

  it('deve dar erro ao gravar novo cadastro', () => {
    perfilServiceSpy.put.and.returnValue(throwError(() => new Error('Ocorreu um erro ao alterar o perfil.')));
    component.perfil = {id: 1} as Perfil;
    component.formulario.setValue({
      id: 1,
      nome: 'Teste',
      descricao: 'Descricao',
      usuarioUltimaAtualizacao : null,
      terminalUltimaAtualizacao: null,
      dataHoraUltimaAtualizacao: null
    });

    component.gravar();

    expect(messageServiceSpy.addMsgDanger).toHaveBeenCalledWith('Ocorreu um erro ao alterar o perfil.');
  });

  it('deve excluir perfil', () => {
    component.perfil = {id: 1} as Perfil;
    perfilServiceSpy.delete.and.returnValue(of(null));
    
    messageServiceSpy.addConfirmYesNo.and.callFake((msg: string, listenerYes: () => void) => {
      listenerYes();
    });
    component.excluir();

    expect(messageServiceSpy.addMsgSuccess).toHaveBeenCalledWith('Perfil excluído com sucesso.');
  });

  it('deve dar erro ao excluir', () => {
    component.perfil = {id: 1} as Perfil;
    perfilServiceSpy.delete.and.returnValue(throwError(() => new Error('Ocorreu um erro ao excluir o perfil.')));
    
    messageServiceSpy.addConfirmYesNo.and.callFake((msg: string, listenerYes: () => void) => {
      listenerYes();
    });
    component.excluir();

    expect(messageServiceSpy.addMsgDanger).toHaveBeenCalledWith('Ocorreu um erro ao excluir o perfil.');
  });

  it('deve ir para o link para consulta', () => {
    component.consultar();
    expect(routerSpy.navigate).toHaveBeenCalled();
  });

});
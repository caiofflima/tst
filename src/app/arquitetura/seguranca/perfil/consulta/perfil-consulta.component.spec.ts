import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { PerfilService } from '../../../../../app/arquitetura/shared/services/seguranca/perfil.service';

import { MessageService } from 'app/shared/services/services';
import { Perfil } from './../../../shared/models/seguranca/perfil';
import { PerfilConsultaComponent } from './perfil-consulta.component';


describe('PerfilConsultaComponent', () => {
  let component: PerfilConsultaComponent;
  let fixture: ComponentFixture<PerfilConsultaComponent>;
  const messageServiceSpy = jasmine.createSpyObj('MessageService', ['addConfirmYesNo', 'addMsgSuccess', 'addMsgDanger']);
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  const activatedRouteSpy = { parent: { url: of('') } } as any;
  const perfilServiceSpy = jasmine.createSpyObj('PerfilService', ['consultarPorNome', 'delete']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerfilConsultaComponent],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: PerfilService, useValue: perfilServiceSpy },
        FormBuilder
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

  it('deve chamar consultar e definir perfis', () => {
    const mockPerfis = [{ id: 1, nome: 'Perfil 1' }  as Perfil, { id: 2, nome: 'Perfil 2' }  as Perfil ];
    perfilServiceSpy.consultarPorNome.and.returnValue(of(mockPerfis));

    component.consultar();

    expect(component.perfis).toEqual(mockPerfis);
  });

  it('deve navegar para a rota de inclusão', () => {
    component.incluir();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['novo'], { relativeTo: activatedRouteSpy.parent });
  });

  it('deve navegar para a rota de edição', () => {
    const mockPerfil = { id: 1, nome: 'Perfil 1' } as Perfil;

    component.alterar(mockPerfil);

    expect(routerSpy.navigate).toHaveBeenCalledWith([mockPerfil.id, 'editar'], { relativeTo: activatedRouteSpy.parent });
  });

  it('deve excluir o perfil e chamar messageService.addMsgSuccess', () => {
    const mockPerfil = { id: 1, nome: 'Perfil 1' } as Perfil;
    component.perfis = [mockPerfil];
    perfilServiceSpy.delete.and.returnValue(of({}));

    component.excluir(mockPerfil);

    expect(messageServiceSpy.addConfirmYesNo).toHaveBeenCalled();
    const confirmCallback = messageServiceSpy.addConfirmYesNo.calls.mostRecent().args[1];
    confirmCallback();

    expect(perfilServiceSpy.delete).toHaveBeenCalledWith(mockPerfil.id);
    expect(messageServiceSpy.addMsgSuccess).toHaveBeenCalledWith('Perfil excluído com sucesso.');
    expect(component.perfis.length).toBe(0);
  });

 
});

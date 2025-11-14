import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'app/shared/components/messages/message.service';
import { CampoVazioHifen } from 'app/shared/pipes/campo-vazio.pipe';
import { TelefonePipe } from 'app/shared/pipes/telefone.pipe';
import { SessaoService } from 'app/shared/services/services';
import { Usuario } from 'app/shared/models/entidades';
import { RenovarDependenteComponent } from './renovar-dependente.component';
import { ActivatedRoute } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('RenovarDependenteComponent', () => {
  let component: RenovarDependenteComponent;
  let fixture: ComponentFixture<RenovarDependenteComponent>;

  const messageServiceSpy = { getDescription: jest.fn() };
  const activatedRouteSpy = { snapshot: jest.fn() };
  activatedRouteSpy.snapshot = {
    params:{
      idBeneficiario: 1
    }
  }
  const usuario = {} as Usuario;
  usuario.matriculaFuncional = "C123000";
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RenovarDependenteComponent, CampoVazioHifen, TelefonePipe],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },       
        { provide: ActivatedRoute, useValue: activatedRouteSpy },       
      ],
      imports:[
        BrowserAnimationsModule
      ],
      schemas: [
          CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenovarDependenteComponent);
    component = fixture.componentInstance;
    SessaoService.usuario = usuario;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});

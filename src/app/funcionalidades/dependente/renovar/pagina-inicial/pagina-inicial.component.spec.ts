import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'app/shared/components/messages/message.service';
import { CampoVazioHifen } from 'app/shared/pipes/campo-vazio.pipe';
import { TelefonePipe } from 'app/shared/pipes/telefone.pipe';
import { BeneficiarioService, MotivoCancelamentoService, ProcessoService, SessaoService, TipoDependenteService } from 'app/shared/services/services';
import { Usuario } from 'app/shared/models/entidades';
import { ActivatedRoute } from '@angular/router';
import { PaginaInicialComponent } from './pagina-inicial.component';

describe('PaginaInicialComponent', () => {
  let component: PaginaInicialComponent;
  let fixture: ComponentFixture<PaginaInicialComponent>;

  const messageServiceSpy = { getDescription: jest.fn() };
 
  const usuario = {} as Usuario;
  usuario.matriculaFuncional = "C123000";
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PaginaInicialComponent, 
        CampoVazioHifen, 
        TelefonePipe,
      ],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },       
      ],
      imports:[
        BrowserAnimationsModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginaInicialComponent);
    component = fixture.componentInstance;
    SessaoService.usuario = usuario;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'app/shared/components/messages/message.service';
import { CampoVazioHifen } from 'app/shared/pipes/campo-vazio.pipe';
import { TelefonePipe } from 'app/shared/pipes/telefone.pipe';
import { PaginaInicialAlterarComponent } from './pagina-inicial-alterar.component';
import { InscricaoDependenteService } from 'app/shared/services/services';

describe('PaginaInicialAlterarComponent', () => {
  let component: PaginaInicialAlterarComponent;
  let fixture: ComponentFixture<PaginaInicialAlterarComponent>;

  const messageServiceSpy = { getDescription: jest.fn() };
  const inscricaoDependenteServiceSpy = { setEditMode: jest.fn() };
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginaInicialAlterarComponent, CampoVazioHifen, TelefonePipe],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: InscricaoDependenteService, useValue: inscricaoDependenteServiceSpy },
       
      ],
      imports:[
        BrowserAnimationsModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginaInicialAlterarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente 123', () => {
    expect(component).toBeTruthy();
  });

});

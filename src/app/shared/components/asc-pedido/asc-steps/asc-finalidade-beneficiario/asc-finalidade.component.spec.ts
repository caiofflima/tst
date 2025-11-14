import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService, SessaoService } from '../../../../services/services';
import { AscDocumentosRequeridosPedidoComponent } from '../asc-documentos-requeridos-pedido/asc-documentos-requeridos-pedido.component';


describe('AscDocumentosRequeridosPedidoComponent', () => {
  let component: AscDocumentosRequeridosPedidoComponent;
  let fixture: ComponentFixture<AscDocumentosRequeridosPedidoComponent>;

  beforeEach(async () => {
    const messageServiceSpy = { showDangerMsg: jest.fn() };
    jest.jest.jest.jest.spyOn(SessaoService, 'getMatriculaFuncional').mockReturnValue('C000123');

    await TestBed.configureTestingModule({
      declarations: [ AscDocumentosRequeridosPedidoComponent ],
      imports: [ ReactiveFormsModule, BrowserAnimationsModule ],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AscDocumentosRequeridosPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService, SessaoService } from '../../../../services/services';
import { AscProfissionalPedidoComponent } from './asc-profissional-pedido.component';



describe('AscProfissionalPedidoComponent', () => {
  let component: AscProfissionalPedidoComponent;
  let fixture: ComponentFixture<AscProfissionalPedidoComponent>;

  beforeEach(async () => {
    const messageServiceSpy = { showDangerMsg: jest.fn() };
    jest.jest.jest.jest.spyOn(SessaoService, 'getMatriculaFuncional').mockReturnValue('C000123');

    await TestBed.configureTestingModule({
      declarations: [ AscProfissionalPedidoComponent ],
      imports: [ ReactiveFormsModule, BrowserAnimationsModule ],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
      ],
      schemas:[
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AscProfissionalPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});

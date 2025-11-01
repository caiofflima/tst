import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComboService, DocumentoPedidoService, EmpresaPrestadorExternoService, MessageService } from 'app/shared/services/services';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ListaMensagensComponent } from './lista-mensagens.component';


describe('ListaMensagensComponent', () => {
  let component: ListaMensagensComponent;
  let fixture: ComponentFixture<ListaMensagensComponent>;
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription']);
 
 
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
        FormsModule,  
        ReactiveFormsModule
      ],
      declarations: [ListaMensagensComponent],
      providers: [
        FormBuilder,
        { provide: MessageService, useValue: messageServiceSpy },
      ]
    }).compileComponents();
    });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaMensagensComponent);

    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});
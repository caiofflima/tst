import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InscricaoDependenteService } from 'app/shared/services/comum/inscricao-dependente.service';
import { MessageService } from 'app/shared/services/services';
import { AscDadosEnderecoCardComponent } from './asc-dados-endereco-card.component';

describe('AscDadosEnderecoCardComponent', () => {
  let component: AscDadosEnderecoCardComponent;
  let fixture: ComponentFixture<AscDadosEnderecoCardComponent>;
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription']);
  const inscricaoDependenteServiceSpy = jasmine.createSpyObj('InscricaoDependenteService',['init']);


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [AscDadosEnderecoCardComponent],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: InscricaoDependenteService, useValue: inscricaoDependenteServiceSpy },
      ]
    }).compileComponents();
    });

  beforeEach(() => {
    fixture = TestBed.createComponent(AscDadosEnderecoCardComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});
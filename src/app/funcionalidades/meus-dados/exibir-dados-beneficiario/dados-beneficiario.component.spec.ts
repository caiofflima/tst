import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'app/shared/services/services';
import { DadosBeneficiarioComponent } from './dados-beneficiario.component';


describe('DadosBeneficiarioComponent', () => {
  let component: DadosBeneficiarioComponent;
  let fixture: ComponentFixture<DadosBeneficiarioComponent>;
  const messageServiceSpy = { getDescription: jest.fn() };
 
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
        FormsModule,  
        ReactiveFormsModule
      ],
      declarations: [DadosBeneficiarioComponent],
      providers: [
        FormBuilder,
        { provide: MessageService, useValue: messageServiceSpy },
        
      ]
    }).compileComponents();
    });

  beforeEach(() => {
    fixture = TestBed.createComponent(DadosBeneficiarioComponent);

    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});
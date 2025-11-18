import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlterarDependenteComponent } from './alterar-dependente.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MessageService } from '../../../../shared/components/messages/message.service';
import { ActivatedRoute } from '@angular/router';

describe('AlterarDependenteComponent', () => {
  let component: AlterarDependenteComponent;
  let fixture: ComponentFixture<AlterarDependenteComponent>;

  // Mock services
  const messageServiceSpy = {
    showSuccessMsg: jest.fn(),
    showDangerMsg: jest.fn()
  };
  const routeSpy = {
    snapshot: {
      params: { idBeneficiario: null }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlterarDependenteComponent],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ActivatedRoute, useValue: routeSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlterarDependenteComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });
});

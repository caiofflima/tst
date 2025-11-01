import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'app/shared/services/services';
import { AscCardInfoAdicionalComponent } from './asc-card-info-adicional.component';


describe('AscCardInfoAdicionalComponent', () => {
  let component: AscCardInfoAdicionalComponent;
  let fixture: ComponentFixture<AscCardInfoAdicionalComponent>;
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription']);
  
 
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
        FormsModule,  
        ReactiveFormsModule
      ],
      declarations: [AscCardInfoAdicionalComponent],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
      ],
      schemas:[
        CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents();
    });

  beforeEach(() => {
    fixture = TestBed.createComponent(AscCardInfoAdicionalComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});
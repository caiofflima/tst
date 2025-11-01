import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageService, SessaoService } from 'app/shared/services/services';
import { HomeComponent } from './home.component';

class MockUtil {
  static getDate(dateString: string): Date {
    return new Date(dateString);
  }
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  const messageServiceSpy = jasmine.createSpyObj('MessageService',['getDescription']);
  const sessaoServiceSpy = jasmine.createSpyObj('SessaoService',['init']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: SessaoService, useValue: sessaoServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

});
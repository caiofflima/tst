import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseLayoutFormComponent } from './base-layout-form.component';

describe('BaseLayoutFormComponent', () => {
  let component: BaseLayoutFormComponent;
  let fixture: ComponentFixture<BaseLayoutFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseLayoutFormComponent ]
    })
    .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(BaseLayoutFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

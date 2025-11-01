import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseLayoutHomeComponent } from './base-layout-home.component';

describe('BaseLayoutHomeComponent', () => {
  let component: BaseLayoutHomeComponent;
  let fixture: ComponentFixture<BaseLayoutHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseLayoutHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseLayoutHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

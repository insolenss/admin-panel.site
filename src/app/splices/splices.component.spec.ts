import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SplicesComponent } from './splices.component';

describe('SplicesComponent', () => {
  let component: SplicesComponent;
  let fixture: ComponentFixture<SplicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SplicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

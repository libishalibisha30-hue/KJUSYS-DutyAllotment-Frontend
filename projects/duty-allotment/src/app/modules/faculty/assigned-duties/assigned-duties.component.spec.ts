import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedDutiesComponent } from './assigned-duties.component';

describe('AssignedDutiesComponent', () => {
  let component: AssignedDutiesComponent;
  let fixture: ComponentFixture<AssignedDutiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignedDutiesComponent]
    });
    fixture = TestBed.createComponent(AssignedDutiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

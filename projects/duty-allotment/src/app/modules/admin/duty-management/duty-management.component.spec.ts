import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DutyManagementComponent } from './duty-management.component';

describe('DutyManagementComponent', () => {
  let component: DutyManagementComponent;
  let fixture: ComponentFixture<DutyManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DutyManagementComponent]
    });
    fixture = TestBed.createComponent(DutyManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DutyRecordsComponent } from './duty-records.component';

describe('DutyRecordsComponent', () => {
  let component: DutyRecordsComponent;
  let fixture: ComponentFixture<DutyRecordsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DutyRecordsComponent]
    });
    fixture = TestBed.createComponent(DutyRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

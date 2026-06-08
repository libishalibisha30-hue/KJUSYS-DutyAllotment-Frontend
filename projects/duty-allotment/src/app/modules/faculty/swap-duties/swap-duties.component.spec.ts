import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwapDutiesComponent } from './swap-duties.component';

describe('SwapDutiesComponent', () => {
  let component: SwapDutiesComponent;
  let fixture: ComponentFixture<SwapDutiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SwapDutiesComponent]
    });
    fixture = TestBed.createComponent(SwapDutiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

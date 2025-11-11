import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollutionComponent } from './pollution';

describe('PollutionComponent', () => {
  let component: PollutionComponent;
  let fixture: ComponentFixture<PollutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollutionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

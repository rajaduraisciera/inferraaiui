import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeselectionComponent } from './modeselection.component';

describe('ModeselectionComponent', () => {
  let component: ModeselectionComponent;
  let fixture: ComponentFixture<ModeselectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeselectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModeselectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

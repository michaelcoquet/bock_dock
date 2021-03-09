import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotSelectorComponent } from './slot-selector.component';

describe('SlotSelectorComponent', () => {
  let component: SlotSelectorComponent;
  let fixture: ComponentFixture<SlotSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlotSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlotSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

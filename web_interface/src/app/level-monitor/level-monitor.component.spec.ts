import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelMonitorComponent } from './level-monitor.component';

describe('LevelMonitorComponent', () => {
  let component: LevelMonitorComponent;
  let fixture: ComponentFixture<LevelMonitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LevelMonitorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

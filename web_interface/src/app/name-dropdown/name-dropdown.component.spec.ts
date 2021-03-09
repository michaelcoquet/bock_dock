import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameDropdownComponent } from './name-dropdown.component';

describe('NameDropdownComponent', () => {
  let component: NameDropdownComponent;
  let fixture: ComponentFixture<NameDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NameDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NameDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

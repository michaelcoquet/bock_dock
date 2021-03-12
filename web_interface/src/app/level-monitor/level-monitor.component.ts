import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import { Slots } from '../slots';

@Component({
  selector: 'app-level-monitor',
  templateUrl: './level-monitor.component.html',
  styleUrls: ['./level-monitor.component.scss']
})
export class LevelMonitorComponent {
  b:boolean;
  keg_slots = this.slots;
  selected_slot;
  brew_form_group: FormGroup;
  brewControl = new FormControl('', Validators.required);
  selectFormControl = new FormControl('', Validators.required);
  current_level:number;
  relative_level:number;
  t:number;

  make_selection(event) {
    this.keg_slots.emit_selection(event.value);
  }

  get_current_level() {
    this.current_level = Number((Math.round(this.keg_slots.get_current_slot().current_level * 100) / 100).toFixed(2));
    return this.current_level;
  }

  get_relative_level() {
    this.relative_level = (this.get_current_level() - this.keg_slots.get_min_level())/(this.keg_slots.get_max_level() - this.keg_slots.get_min_level()) * 100;
    return this.relative_level;
  }

  constructor(
    private route: ActivatedRoute,
    private slots: Slots,
    private fb: FormBuilder,
  ) {
    this.selected_slot = slots.selected_slot;
  }
  ngOnInit() {
    this.keg_slots.selected_slot.subscribe(slot => {
      this.selected_slot = slot;
    })
  }
}

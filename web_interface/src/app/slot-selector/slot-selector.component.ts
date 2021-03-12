import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';

import { Slots } from '../slots';

@Component({
  selector: 'app-slot-selector',
  templateUrl: './slot-selector.component.html',
  styleUrls: ['./slot-selector.component.scss']
})
export class SlotSelectorComponent  implements OnInit {
  keg_slots = this.slots;
  options: FormGroup;
  selected_slot;
  
  select_keg(slot) {
    this.keg_slots.emit_selection(slot);
  }

  constructor(
    private slots: Slots,
    private route: ActivatedRoute,
    fb: FormBuilder,
  ) {
    this.options = fb.group({
      // hideRequired: this.hideRequiredControl,
      // floatLabel: this.floatLabelControl,
    });
  }
  ngOnInit() {
    this.keg_slots.selected_slot.subscribe(slot => {
      this.selected_slot = slot;
    })
  }
}
/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
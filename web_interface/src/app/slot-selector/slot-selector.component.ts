import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';

import { slots } from '../slots';
import { NameDropdownComponent } from '../name-dropdown/name-dropdown.component';

@Component({
  selector: 'app-slot-selector',
  templateUrl: './slot-selector.component.html',
  styleUrls: ['./slot-selector.component.scss']
})
export class SlotSelectorComponent  implements OnInit {
  slots = slots;
  options: FormGroup;

  constructor(
    private route: ActivatedRoute,
    fb: FormBuilder,
  ) {
    this.options = fb.group({
      // hideRequired: this.hideRequiredControl,
      // floatLabel: this.floatLabelControl,
    });
  }
  ngOnInit() {
  }
}
/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
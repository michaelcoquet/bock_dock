import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { slots } from '../slots';

@Component({
  selector: 'app-slot-selector',
  templateUrl: './slot-selector.component.html',
  styleUrls: ['./slot-selector.component.css']
})
export class SlotSelectorComponent  implements OnInit {
  slots = slots;

  slot_select(id) {
    window.alert('slot' + id + ' was selected! TODO: implement');
  }

  constructor(
    private route: ActivatedRoute,
  ) { }
  ngOnInit() {
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
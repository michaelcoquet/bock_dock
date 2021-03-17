import {Component, OnInit} from '@angular/core';

import { Slots } from '../slots'

/**
 * @title Toolbar overview
 */
@Component({
  selector: 'app-top-bar',
  templateUrl: 'top-bar-component.html',
  styleUrls: ['top-bar-component.scss'],
})
export class TopBarComponent implements OnInit {
  keg_slots = this.slots;
  selected_slot:number;
  
  // go_home() {
  //   this.slots.select(null);
  // }
  
  constructor(private slots: Slots,) { }

  ngOnInit() {
  }
}

/**  Copyright 2020 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
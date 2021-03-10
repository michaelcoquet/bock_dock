import { Component, OnInit } from '@angular/core';

import { Slots } from '../slots';

@Component({
  templateUrl: './slot-details.component.html',
  styleUrls: ['./slot-details.component.scss']
})
export class SlotDetailsComponent implements OnInit {
  keg_slots = this.slots;
  
  constructor(
    private slots: Slots,
  ) { }

  ngOnInit(): void {
  }

}

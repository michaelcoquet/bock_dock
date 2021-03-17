import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";
import { RestApiService } from "../rest-api";

import { Slots } from "../slots";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { Keg } from "src/types/Keg";

@Component({
  selector: "app-slot-selector",
  templateUrl: "./slot-selector.component.html",
  styleUrls: ["./slot-selector.component.scss"],
})
export class SlotSelectorComponent implements OnInit {
  unsubscribe$: Subject<boolean> = new Subject();

  kegs_data: any;
  options: FormGroup;

  select_keg(slot) {
    var temp_keg:Keg = {
      "active": false,
      "brew_description": "beer420",
      "brew_name": "3245",
      "createdAt": "2asdfffffff",
      "current_level": 19,
      "finish_date": "fffff",
      "id": "fffffffffffffffffffffffffffffff",
      "slot_id": 4,
      "kegging_date": "1234",
      "mashing_date": "124",
      "updatedAt": "2021-03-15T06:35:23.127Z"
    }
    var resp: any;
    if(slot.active == false)
      this.restApi.updateCurrent(slot.slot_id, temp_keg).subscribe(response => resp = response);
    this.slots.select(slot);
  }

  constructor(
    private slots: Slots,
    private route: ActivatedRoute,
    private restApi: RestApiService,
    fb: FormBuilder,
  ) {
    this.options = fb.group({
      // hideRequired: this.hideRequiredControl,
      // floatLabel: this.floatLabelControl,
    });
  }
  ngOnInit() {
    this.slots.getCurrent().pipe(takeUntil(this.unsubscribe$)).subscribe(kegs => this.kegs_data = kegs);
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/

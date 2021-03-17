import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";
import { RestApiService } from "../rest-api";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

import { Slots } from "../slots";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { Keg } from "src/types/Keg";
import { NewBatchDialog } from "../dialogs/dialogs";

@Component({
  selector: "app-slot-selector",
  templateUrl: "./slot-selector.component.html",
  styleUrls: ["./slot-selector.component.scss"],
})
export class SlotSelectorComponent implements OnInit {
  unsubscribe$: Subject<boolean> = new Subject();

  new_keg: Keg = this.slots.homekeg;

  kegs_data: Keg[];
  options: FormGroup;
  dummy: Keg[] = [];

  loop_counter = 0;
  increment_loop_counter() {
    this.loop_counter = this.loop_counter + 1;
  }
  reset_loop_counter() {
    this.loop_counter = 0;
  }

  select_keg(slot) {
    this.slots.select(slot);
  }

  NewBatchDialog(id): void {
    this.new_keg.slot_id = id;
    const dialogRef = this.dialog.open(NewBatchDialog, {
      width: "100%",
      data: this.new_keg,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("New Batch Wizard Closed");
      this.new_keg = result;
    });
  }

  build_dummy_buttons() {
    if (this.kegs_data != undefined) {
      if (this.kegs_data.length > 8) {
        throw new Error("ERROR: fatal, must be less than eight active kegs");
      } else {
        for (let i = 0; i < 8; i++) {
          if (this.kegs_data[i] == undefined) continue;
          if (this.kegs_data[i].slot_id != i)
            this.dummy[this.kegs_data[i].slot_id - 1] = this.kegs_data[i];
        }
      }
    }
    return;
  }

  constructor(
    private slots: Slots,
    private route: ActivatedRoute,
    private restApi: RestApiService,
    public dialog: MatDialog,
    fb: FormBuilder
  ) {
    this.options = fb.group({
      // hideRequired: this.hideRequiredControl,
      // floatLabel: this.floatLabelControl,
    });
  }
  ngOnInit() {
    this.slots
      .getCurrent()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((kegs) => (this.kegs_data = kegs["Items"]));
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

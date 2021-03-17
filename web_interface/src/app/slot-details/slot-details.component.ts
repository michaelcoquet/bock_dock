import { Component, OnInit, Inject } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

import { Slots } from "../slots";
import { Keg } from "../../types/Keg";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: "app-slot-details",
  templateUrl: "./slot-details.component.html",
  styleUrls: ["./slot-details.component.scss"],
})
export class SlotDetailsComponent implements OnInit {
  unsubscribe$: Subject<boolean> = new Subject();

  selected_keg: Keg;

  animal: string;
  name: string;

  constructor(
    private slots: Slots,
    public dialog: MatDialog
  ) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: "250px",
      data: { name: this.name, animal: this.animal },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      this.animal = result;
    });
  }

  ngOnInit(): void {
    this.slots
      .getSelected()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((sel) => (this.selected_keg = sel));
  }
  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: "dialog-overview-example-dialog",
  templateUrl: "edit_batch_dialog.html",
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

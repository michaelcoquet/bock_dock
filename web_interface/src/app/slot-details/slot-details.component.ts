import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { Slots } from "../slots";

@Component({
  selector: 'app-slot-details',
  templateUrl: "./slot-details.component.html",
  styleUrls: ["./slot-details.component.scss"],
})
export class SlotDetailsComponent implements OnInit {
  keg_slots = this.slots;
  selected_slot;
  brew_disc;
  brew_form_group: FormGroup;
  brewControl = new FormControl('', Validators.required);

  animal: string;
  name: string;
  
  constructor(
    private slots: Slots,
    private fb: FormBuilder,
    public dialog: MatDialog,
  ) {
    // this.keg_slots.selected_slot.subscribe((slot) => {
    //   this.selected_slot = slot;
    // })
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

  get_current_disc() {
    this.brew_disc = this.slots.get_current_slot().brew_description;
    return this.brew_disc;
  }

  ngOnInit(): void {
    this.brew_form_group = this.fb.group({
      brewControl: this.brew_disc,
    })
  }
}

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'edit_batch_dialog.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

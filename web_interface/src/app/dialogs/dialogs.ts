import { Component, Inject, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import { Keg } from "../../types/Keg";

export interface DialogData {
    animal: string;
    name: string;
  }
  
  @Component({
    selector: "dialog-overview-example-dialog",
    templateUrl: "edit_batch_dialog.html",
  })
  export class EditBatchDialog {
    constructor(
      public dialogRef: MatDialogRef<EditBatchDialog>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  }

  @Component({
    selector: "new_batch_dialog",
    templateUrl: "new_batch_dialog.html",
    styleUrls: ["./dialogs.scss"],
  })
  export class NewBatchDialog implements OnInit{
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    constructor(
      public dialogRef: MatDialogRef<NewBatchDialog>,
      private _formBuilder: FormBuilder,
      @Inject(MAT_DIALOG_DATA) public data: Keg
    ) {
      data.active = 1;
      data.create_date = "TODO: SET TIMESTAMP FOR NOW";
    }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
    ngOnInit() {
      this.firstFormGroup = this._formBuilder.group({
        firstCtrl: ['', Validators.required]
      });
      this.secondFormGroup = this._formBuilder.group({
        secondCtrl: ['', Validators.required]
      });
    }
  }
  
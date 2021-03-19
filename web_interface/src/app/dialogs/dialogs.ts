import { Component, Inject, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Keg } from "../../types/Keg";
import { MY_FORMATS } from "../../types/Dates";

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
      @Inject(MAT_DIALOG_DATA) public data: DialogData,
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

    tare_placeholder = `Please place an empty, clean, dry keg into the selected slot (Slot ${this.data.slot_id}) then hit the tare button bellow.
    \n\n\n\n\nSlot 1    Slot 2    Slot 3    Slot 4
    \n\nSlot 5    Slot 6    Slot 7    Slot 8\n\n           ______________________\n             front of kegerator`;

    instruction_placehoder = ``;
    
    constructor(
      public dialogRef: MatDialogRef<NewBatchDialog>,
      private _formBuilder: FormBuilder,
      private http: HttpClient,
      @Inject(MAT_DIALOG_DATA) public data: Keg
    ) {
      data.active = 1;
      data.create_date = String(Date.now());
      data.kegging_date = "Set in Step 3";
      data.batch_id = this.build_id();
    }
  
    build_id(): string {
      var uuidValue=uuidv4();
      return uuidValue;
    }

    onCancelClick(): void {
      console.log("TODO: stuff, cancel clicked go back");
    }

    onSaveClick(): void {
      console.log("TODO: stuff, save clicked go to next step");
    }

    esp_get_tare_ack(): void {
      var resp = this.http.get("http://192.168.0.30/tareCommand/");
      console.log(resp);
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
  
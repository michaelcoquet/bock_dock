import { Component, Inject, OnInit } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { v4 as uuidv4 } from "uuid";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

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
export class NewBatchDialog implements OnInit {
  unsubscribe$: Subject<boolean> = new Subject();
  esp_message:any;
  ws:any;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  tare_placeholder = `Please place an empty, clean, dry keg into the selected slot (Slot ${this.data.slot_id}) then hit the tare button bellow.
    \n\n\n\n\n1    2    3    4
    \n\n5    6    7    8\n\n           ______________________\n             front of kegerator`;

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
    var uuidValue = uuidv4();
    return uuidValue;
  }

  onCancelClick(): void {
    console.log("TODO: stuff, cancel clicked go back");
  }

  onSaveClick(): void {
    console.log("TODO: stuff, save clicked go to next step");
  }

  esp_get_tare_ack(): void {
    document.getElementById("overlay").style.display = "block";
    this.ws = new WebSocket("ws://192.168.0.30/ws");
    this.ws.onmessage = function(e){ 
      if(e.data == "Scale Succesfully Zeroed")
      {
        document.getElementById("overlay").style.display = "none";
        console.log("socket connected");
      }
    };
    this.ws.onopen = () => this.ws.send("User Requests Tare Slot :" + this.data.slot_id);

  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ["", Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ["", Validators.required],
    });

    window.addEventListener("beforeunload", function (e) {
      var confirmationMessage = "\o/sdfsdfdssffff";
      console.log("cond");
      e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
      return confirmationMessage;              // Gecko, WebKit, Chrome <34
    });
  }
}

import {
  Component,
  Inject,
  Input,
  OnInit,
  OnDestroy,
  SimpleChanges,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { formatDate } from "@angular/common";
import { v4 as uuidv4 } from "uuid";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

import { RestApiService } from "../rest-api";
import { Socks } from "../socks";
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

// *********** New Batch Wizard Dialog ***********
// TODO: add form validations
// TODO: fix weird next button
// TODO: find way to automatically get users ip address
@Component({
  selector: "new_batch_dialog",
  templateUrl: "new_batch_dialog.html",
  styleUrls: ["./dialogs.scss"],
})
export class NewBatchDialog implements OnInit {
  unsubscribe$: Subject<boolean> = new Subject();
  esp_message: any;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  today = new Date();
  jstoday = "";
  @Input() current_reading: number;

  tare_placeholder = `Please place an empty, clean, dry keg into the selected slot (Slot ${this.data.slot_id}) then hit the tare button bellow. 
  Push tare again if needed, hit next when its reasonably close to zero.
    \n\n\n\n\n1    2    3    4
    \n\n5    6    7    8\n\n____________________\n   front of kegerator`;

  instruction_placehoder = ``;

  constructor(
    public dialogRef: MatDialogRef<NewBatchDialog>,
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    public restApi: RestApiService,
    public socks: Socks,
    @Inject(MAT_DIALOG_DATA) public data: Keg
  ) {
    data.active = 1;
    data.create_date = formatDate(
      this.today,
      "dd-MM-yyyy hh:mm:ss a",
      "en-US",
      "+0530"
    );
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

  onDoneClick(): void {
    // get the starting level after kegging and put it in current level
    this.data.current_level = parseFloat(document.getElementById("nb_readings").getAttribute("value"));
    // send the stop signal to the tm4c
    this.socks.ws.send("!w stp:" + this.data.slot_id);
    // upload batch data to dynamodb
    this.restApi.createKeg(this.data);
    this.dialogRef.close();
  }

  onKeggingDoneClick(): void {
    this.data.kegging_date = formatDate(
      this.today,
      "dd-MM-yyyy hh:mm:ss a",
      "en-US",
      "+0530"
    );
  }

  nb_started: boolean = false;
  esp_get_tare_ack(): void {
    // document.getElementById("overlay").style.display = "block";
    if (!this.nb_started) {
      this.nb_started = true;
      this.socks.ws.send("!w nb:" + this.data.slot_id + " " + this.data.batch_id);
    } else {
      // user wishes to tare the scale again
      console.log("tare the scale again for better reading");
      this.socks.ws.send("!w rt:" + this.data.slot_id);
    }

    this.socks.ws.onmessage = function (e) {
      if (e.data.substring(0, 6) == "!t nb:") {
        // document.getElementById("overlay").style.display = "none";
      }
      if (e.data.substring(0, 6) == "!t nr:") {
        console.log(e.data);
        document
          .getElementById("nb_readings")
          .setAttribute("value", e.data.substring(6));
      }
    };
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ["", Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ["", Validators.required],
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ["", Validators.required],
    });

    window.addEventListener("beforeunload", function (e) {
      var confirmationMessage = "o/";
      e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
      return confirmationMessage; // Gecko, WebKit, Chrome <34
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }
}

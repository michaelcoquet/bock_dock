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
import { Chart } from 'chart.js';


import { Slots } from "../slots";
import { Keg } from "../../types/Keg";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { EditBatchDialog } from "../dialogs/dialogs";
import { RestApiService } from "../rest-api"

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

  reading:any;

  Linechart = [];  


  constructor(private slots: Slots, public dialog: MatDialog, public rest: RestApiService) {}


  EditDialog(): void {
    const dialogRef = this.dialog.open(EditBatchDialog, {
      width: "250px",
      data: { name: this.name, animal: this.animal },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      this.animal = result;
    });
  }

  getKegDate(): string 
  {
    return "Kegging Date: " + this.selected_keg.kegging_date;
  }

  getMashDate(): string
  {
    return "Mashing Date: " + this.selected_keg.mashing_date;
  }
  
  ngOnInit(): void {
    this.slots
      .getSelected()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((sel) => (this.selected_keg = sel));
    this.rest.getReadings(this.selected_keg.batch_id).subscribe(read => {
      this.reading = read;
      // console.log(this.reading['Items']);
      let d = [];
      let l = [];
      this.reading['Items'].forEach(function (value) {
        d.push(parseFloat(value['reading']));
        l.push(value['timestamp']);
      }); 
      console.log(d);
      this.Linechart = new Chart('canvas', {  
        type: 'line',  
        data: {  
          labels: l,  

          datasets: [  
            {  
              data: d,  
              borderColor: '#301934',  
              // backgroundColor: "#0000FF",  
            }  
          ]  
        },  
        options: {  
          legend: {  
            display: false  
          },  
          scales: {  
            xAxes: [{  
              display: true  
            }],  
            yAxes: [{  
              display: true  
            }],  
          }  
        }  
      });  
    });
  }
  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}

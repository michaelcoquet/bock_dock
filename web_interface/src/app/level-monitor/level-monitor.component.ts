import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

import { Slots } from "../slots";
import { Keg } from "../../types/Keg";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { Socks } from "../socks";

@Component({
  selector: "app-level-monitor",
  templateUrl: "./level-monitor.component.html",
  styleUrls: ["./level-monitor.component.scss"],
})
export class LevelMonitorComponent {
  unsubscribe$: Subject<boolean> = new Subject();

  private selected_keg: Keg;
  keg_slots: Slots;

  get_current_level() {
    var current_level = Number(
      (Math.round(cur_lvl * 100) / 100).toFixed(2)
    );
    return current_level;
  }

  get_relative_level() {
    var relative_level =
      ((this.get_current_level() - this.slots.min_level) /
        (this.slots.max_level - this.slots.min_level)) *
      100;
    return relative_level;
  }

  set_current_level() {
    console.log("HERE");
  }

  constructor(
    private route: ActivatedRoute,
    private slots: Slots,
    private socks: Socks,
    private fb: FormBuilder
  ) {
    this.keg_slots = slots;
  }
  ngOnInit() {
    this.slots
      .getSelected()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((sel) => (this.selected_keg = sel));
    this.socks.ws.onmessage = function (e) {
      socket_onmessage_callback(e.data);
    };
  }
  
  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}

var cur_lvl:number;
function socket_onmessage_callback(data)
{
    if (data.substring(0, 6) == "!t nr:") {
      var str = data.substring(6);
      var nm = parseFloat(str).toFixed(3);
      var htm = "Current Level: " + nm.toString() + "L (remaining)";
      cur_lvl = parseFloat(nm);
      document
        .getElementById("cur_level_lbl")
        .innerHTML =  htm;
    }
}

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
      (
        Math.round(this.selected_keg.current_level * 100) / 100
      ).toFixed(2)
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

  constructor(
    private route: ActivatedRoute,
    private slots: Slots,
    private fb: FormBuilder
  ) {this.keg_slots =  slots;}
  ngOnInit() {
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

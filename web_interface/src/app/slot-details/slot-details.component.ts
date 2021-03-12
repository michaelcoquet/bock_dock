import { Component, OnInit } from "@angular/core";
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

import { Slots } from "../slots";

@Component({
  selector: 'app-slot-details',
  templateUrl: "./slot-details.component.html",
  styleUrls: ["./slot-details.component.scss"],
})
export class SlotDetailsComponent implements OnInit {
  keg_slots = this.slots;
  selected_slot: number;
  brew_description: FormGroup;
  brew_charts: FormGroup;

  constructor(
    private slots: Slots,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.keg_slots.selected_slot.subscribe((id) => {
      this.selected_slot = id;
    });
  }
}

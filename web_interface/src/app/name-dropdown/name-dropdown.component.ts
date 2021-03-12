import { Component, DoCheck } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import { Slots } from '../slots';

@Component({
    // tslint:disable-next-line:component-selector
    selector: "app-name-dropdown",
    styleUrls: ["./name-dropdown.component.scss"],
    templateUrl: "./name-dropdown.component.html"
})
export class NameDropdownComponent {
    b:boolean;
    keg_slots = this.slots;
    selected_slot;
    brew_form_group: FormGroup;
    brewControl = new FormControl('', Validators.required);
    selectFormControl = new FormControl('', Validators.required);

    make_selection(event) {
      this.keg_slots.emit_selection(event.value);
    }

    constructor(
      private route: ActivatedRoute,
      private slots: Slots,
      private fb: FormBuilder,
    ) {}
    ngOnInit() {
      this.keg_slots.selected_slot.subscribe(slot => {
        this.selected_slot = slot;
      })
      this.brew_form_group = this.fb.group({
        brewControl: this.selected_slot,
      })
    }
  }
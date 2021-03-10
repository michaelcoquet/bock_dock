import { Component } from "@angular/core";
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
    keg_slots = this.slots.get_all_slots();
    options: FormGroup;
    brewControl = new FormControl('', Validators.required);
    selectFormControl = new FormControl('', Validators.required);
  
    constructor(
      private route: ActivatedRoute,
      private slots: Slots,
      fb: FormBuilder,
    ) {
      this.options = fb.group({
        // hideRequired: this.hideRequiredControl,
        // floatLabel: this.floatLabelControl,
      });
    }
    ngOnInit() {
    }
  }
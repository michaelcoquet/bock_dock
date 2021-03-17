import { Component, DoCheck } from "@angular/core";
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
  // tslint:disable-next-line:component-selector
  selector: "app-name-dropdown",
  styleUrls: ["./name-dropdown.component.scss"],
  templateUrl: "./name-dropdown.component.html",
})
export class NameDropdownComponent {
  unsubscribe$: Subject<boolean> = new Subject();

  kegs_list: Keg[];
  selected_keg: Keg;
  brew_form_group: FormGroup;
  brewControl = new FormControl("", Validators.required);

  make_selection(event) {
    this.slots.select(event.value);
  }

  constructor(
    private route: ActivatedRoute,
    private slots: Slots,
    private fb: FormBuilder
  ) {}
  ngOnInit() {
    this.slots
      .getCurrent()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((kegs) => (this.kegs_list = kegs["Items"]));
    this.slots
      .getSelected()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((sel) => (this.selected_keg = sel));
    this.brew_form_group = this.fb.group({
      brewControl: this.selected_keg,
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}

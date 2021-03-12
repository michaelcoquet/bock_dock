import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class Slots {
  private max_temp:number = 6.0;
  private min_temp:number = 1.0;
  private max_level:number = 19.00;
  private min_level:number = 0.75;
  private warn_percentage:number = 20;
  private warn_level_percentage:number = 5;
  private current_temperature:number = 3.45;

  private current_slot;
  public selected_slot = new Subject<any>();

  emit_selection(slot) {
    this.selected_slot.next(slot);
    this.current_slot = slot;
  }
// mongodb api key: private: a40dafa4-0696-43f1-bfd6-d7f36bb2e9a7 public: kxhtngwu
  private keg_slots = [
      {
        id: 1,
        brew_name: 'Bock', 
        current_level: 0,
        brew_description: 'beeeer1',
        active: false,
        mashing_date: Date(),
        kegging_date: Date()
      },
      {
        id: 2,
        brew_name: 'Stout', 
        current_level: 0,
        brew_description: 'beeeer2',
        active: false,
        mashing_date: Date(),
        kegging_date: Date()
      },
      {
        id: 3,
        brew_name: 'Heffe', 
        current_level: 4.56,
        brew_description: 'beeeer3',
        active: true,
        mashing_date: Date(),
        kegging_date: Date()
      },
      {
        id: 4,
        brew_name: 'Pilsner', 
        current_level: 9.53,
        brew_description: 'beeeer4',
        active: true,
        mashing_date: Date(),
        kegging_date: Date()
      },
      {
        id: 5,
        brew_name: 'Lager', 
        current_level: 6.88,
        brew_description: 'beeeer5',
        active: true,
        mashing_date: Date(),
        kegging_date: Date()
      },
      {
        id: 6,
        brew_name: 'Ale', 
        current_level: 17.24,
        brew_description: 'beeeer6',
        active: true,
        mashing_date: Date(),
        kegging_date: Date()
      },
      {
        id: 7,
        brew_name: 'Porter', 
        current_level: 3.56,
        brew_description: 'beeeer7',
        active: false,
        mashing_date: Date(),
        kegging_date: Date()
      },
      {
        id: 8,
        brew_name: 'La Bête Noire', 
        current_level: 1.34,
        brew_description: 'beeeer8',
        active: true,
        mashing_date: Date(),
        kegging_date: Date()
      }
    ];

    get_current_slot() {
      return this.current_slot;
    }
    // set_selected_slot(id: number) {
    //   this.selected_slot = id;
    // }

    get_current_temp() {
      return this.current_temperature;
    }

    get_current_level(id) {
      return this.keg_slots[id-1].current_level;
    }

    get_max_temp() {
      return this.max_temp;
    }

    get_min_temp() {
      return this.min_temp;
    }

    get_max_level() {
      return this.max_level;
    }

    get_min_level() {
      return this.min_level;
    }

    get_warn_perc() {
      return this.warn_percentage;
    }

    get_warn_level_perc() {
      return this.warn_level_percentage;
    }

    get_slot(id: number) {
      return this.keg_slots[id];
    }

    get_all_slots() {
      return this.keg_slots;
    }

    set_current_temp(t: number) {
      this.current_temperature = t;
    }

    set_max_temp(t: number) {
      this.max_temp = t;
    }

    set_min_temp(t: number) {
      this.min_temp = t;
    }

    set_max_level(t: number) {
      this.max_level = t;
    }

    set_min_level(t: number) {
      this.min_level = t;
    }

    set_warn_perc(p: number) {
      this.warn_percentage = p;
    }

    set_warn_level_perc(p: number) {
      this.warn_level_percentage = p;
    }


    constructor() {}
}
// import { Directive, Input, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
// export var max_temp = 6.0;
// export var min_temp = 1.0;
// export var warn_percentage = 20;
// export var current_temperature = 3.45;
// export var slots = [
//   {
//     id: 1,
//     brew_name: 'Bock', 
//     current_level: 0,
//     brew_description: 'beeeer1',
//     active: false,
//     mashing_date: Date(),
//     kegging_date: Date()
//   },
//   {
//     id: 2,
//     brew_name: 'Stout', 
//     current_level: 0,
//     brew_description: 'beeeer2',
//     active: false,
//     mashing_date: Date(),
//     kegging_date: Date()
//   },
//   {
//     id: 3,
//     brew_name: 'Heffe', 
//     current_level: 4.56,
//     brew_description: 'beeeer3',
//     active: true,
//     mashing_date: Date(),
//     kegging_date: Date()
//   },
//   {
//     id: 4,
//     brew_name: 'Pilsner', 
//     current_level: 9.53,
//     brew_description: 'beeeer4',
//     active: true,
//     mashing_date: Date(),
//     kegging_date: Date()
//   },
//   {
//     id: 5,
//     brew_name: 'Lager', 
//     current_level: 6.88,
//     brew_description: 'beeeer5',
//     active: true,
//     mashing_date: Date(),
//     kegging_date: Date()
//   },
//   {
//     id: 6,
//     brew_name: 'Ale', 
//     current_level: 17.24,
//     brew_description: 'beeeer6',
//     active: true,
//     mashing_date: Date(),
//     kegging_date: Date()
//   },
//   {
//     id: 7,
//     brew_name: 'Porter', 
//     current_level: 3.56,
//     brew_description: 'beeeer7',
//     active: false,
//     mashing_date: Date(),
//     kegging_date: Date()
//   },
//   {
//     id: 8,
//     brew_name: 'La Bête Noire', 
//     current_level: 1.34,
//     brew_description: 'beeeer8',
//     active: true,
//     mashing_date: Date(),
//     kegging_date: Date()
//   }
// ];
// @Directive({
//   selector: '[appSlots]'
// })
// export class Slots implements OnChanges{
//   static counter = 0;

//   @Input() appSlots;
//   styleEl:HTMLStyleElement = document.createElement('style');

//   //generate unique attribule which we will use to minimise the scope of our dynamic style 
//   uniqueAttr = `app-progress-bar-color-${ProgressBarColor.counter++}`;

//   constructor(private el: ElementRef) {
//     const nativeEl: HTMLElement = this.el.nativeElement;
//     nativeEl.setAttribute(this.uniqueAttr,'');
//     nativeEl.appendChild(this.styleEl);
//   }

//   ngOnChanges(changes: SimpleChanges): void{
//     this.updateColor();
//   }

//   updateColor(): void{
//     // update dynamic style with the uniqueAttr
//     this.styleEl.innerText = `
//       [${this.uniqueAttr}] .mat-progress-bar-fill::after {
//         background-color: ${this.appProgressBarColor};
//       }
//     `;
//   }

// }

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
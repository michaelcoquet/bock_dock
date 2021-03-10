import { Injectable } from '@angular/core';

@Injectable()
export class Slots {
  private selected_slot:number = 0;
  private max_temp:number = 6.0;
  private min_temp:number = 1.0;
  private warn_percentage:number = 20;
  private current_temperature:number = 3.45;

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

    get_current_temp() {
      return this.current_temperature;
    }

    get_max_temp() {
      return this.max_temp;
    }

    get_min_temp() {
      return this.min_temp;
    }

    get_warn_perc() {
      return this.warn_percentage;
    }

    get_slot(id: number) {
      return this.keg_slots[id];
    }

    get_all_slots() {
      return this.keg_slots;
    }
    
    get_selected_slot() {
      return this.selected_slot;
    }

    set_selected_slot(id: number) {
      this.selected_slot = id;
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

    set_warn_perc(p: number) {
      this.warn_percentage = p;
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
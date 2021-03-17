import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { RestApiService } from "./rest-api";

import { Keg } from '../types/Keg';

@Injectable({ providedIn: 'root',})
export class Slots {
  public max_temp: number = 6.0;
  public min_temp: number = 1.0;
  public max_level: number = 19.0;
  public min_level: number = 0.75;
  public warn_percentage: number = 20;
  public warn_level_percentage: number = 5;
  public current_temperature: number = 3.45;

  private selected$: BehaviorSubject<Keg>;
  private kegs$: Subject<Keg[]> = new Subject();
  private kegs: Keg[];
  public homekeg: Keg = {
    active: 0,
    brew_description: "home",
    brew_name: "home",
    create_date: "home",
    current_level: 0.0,
    finish_date: "home",
    batch_id: "home",
    kegging_date: "home",
    mashing_date: "home",
    slot_id: 0,
    comment: "home",
  }

  getSelected(): Observable<Keg> {
    return this.selected$.asObservable();
  }
  
  select(keg: Keg) {
    this.selected$.next(keg);
  }

  getCurrent(): Observable<Keg[]> {
    return this.kegs$.asObservable();
  }

  private compare(a: {slot_id: number}, b: {slot_id: number}): number {
    return a.slot_id - b.slot_id;
  }
  
  constructor(public restApi: RestApiService) {
    restApi.getActive().subscribe(kegs => {
      kegs["Items"].sort(this.compare);
      this.kegs$.next(kegs);
    });
    this.selected$ = new BehaviorSubject(this.homekeg);
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/

import { Component, OnInit } from '@angular/core';
import { Slots } from '../slots';

@Component({
  selector: 'app-temperature-monitor',
  templateUrl: './temperature-monitor.component.html',
  styleUrls: ['./temperature-monitor.component.scss']
})
export class TemperatureMonitorComponent implements OnInit {
  current_temperature:number = Number((Math.round(this.slots.get_current_temp() * 100) / 100).toFixed(2));
  warn_percentage = this.slots.get_warn_perc();
  min_temp = this.slots.get_min_temp();
  max_temp = this.slots.get_max_temp();
  // percent the point x is between a and b = (x - a)/(b- a)
  relative_temperature = (this.current_temperature - this.min_temp)/(this.max_temp - this.min_temp) * 100;

  constructor(
    private slots: Slots, 
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}

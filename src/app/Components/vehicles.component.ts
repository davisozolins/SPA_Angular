import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../user';
import { Vehicle } from '../user';

@Component({
  selector: 'app-vehicles',
  template: `
    <h2>Vehicles</h2>
    <div *ngIf="user">
        <ul class="users">
          <li *ngFor="let vehicle of user.vehicles"
            [class.selected]="vehicle === selectedVehicle"
            (click)="onSelect(vehicle)">
            <span class="badge">{{vehicle.vehicleid}}</span> 
              {{vehicle.make + ' ' + vehicle.model}}
          </li>
        </ul>
    </div>
  `,
  styleUrls: ['../style.css']
})


export class VehiclesComponent implements OnInit {
  @Input() user?: User;
  @Output() vehicleSelectedFromListEvent = new EventEmitter;
  
  selectedVehicle: Vehicle;

  constructor() {}

  ngOnInit() {}

  //* Vehicle is selected on list */
  onSelect(vehicle: Vehicle): void {
    this.selectedVehicle = vehicle;
    //this.setVehicleAsSelected(vehicle.vehicleid);
    this.user.selectedvehicleid = vehicle.vehicleid;
    this.vehicleSelectedFromListEvent.emit(vehicle.vehicleid);
  }

  //* Set vehicle as selected on list from external User componet, if vehicle is selected on map */
  setVehicleAsSelected(vehId: number)
  {
    this.selectedVehicle = this.user.vehicles.find( x => x.vehicleid == vehId);
    this.user.selectedvehicleid = vehId;
  }

}

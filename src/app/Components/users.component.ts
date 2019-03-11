import { Component, OnInit, ViewChild, Directive } from '@angular/core';
import { User } from '../user';

import { UsersService } from '../users.service';
import { Observable, interval, Subscription } from 'rxjs';
import { MapComponent } from '../Components/map.component';
import { VehiclesComponent } from '../Components/vehicles.component';

@Component({
  selector: 'app-users',
  template: `
          <h2>Users</h2>
          <ul class="users">
            <li *ngFor="let user of UsersList"
              [class.selected]="user === selectedUser"
              (click)="onSelect(user)">
              <span class="badge">{{user.userid}}</span> 
              {{user.ownername + ' ' + user.ownersurname}}
            </li>
          </ul>
          <app-vehicles [user]="selectedUser" 
              (vehicleSelectedFromListEvent)="onVehicleSelect($event)">
            </app-vehicles>
          <app-map [user]="selectedUser"
              (vehicleOnMapSelectedEvent)="onVehicleOnMapEvent($event)">>
            </app-map>
    `,
  styleUrls: ['../style.css'],
  providers: [ UsersService ],
})
export class UsersComponent implements OnInit {
    constructor(private usersService: UsersService)
    { }

  @ViewChild(MapComponent ) mapChild: MapComponent ; 

  @ViewChild(VehiclesComponent ) vehicleChild: VehiclesComponent ; 

  private UsersList: User[];
  
  private selectedUser: User;

  ngOnInit() 
  {
    this.getUserList();
    /**Subscribe on time interval - 5 minutes*/
    interval(5*60*1000).subscribe(val => this.getUserList());
  }

  /**Get users list from service*/
  getUserList()
  {
      this.usersService.fetchUserList().subscribe(u => this.UsersList = u)
  }

  /**User selection on component list view*/
  onSelect(user: User): void {
    this.selectedUser = user;
  }

  /** Vehicle section on list - call event procedure from vehice component */
  onVehicleSelect(vehId: number)
  {
    this.mapChild.setPositionsByUserId(this.selectedUser);
  }

  /** Vehicle selection on map - call event procedure from map component */
  onVehicleOnMapEvent(vehId: number)
  {
    this.selectedUser.selectedvehicleid = vehId;
    this.vehicleChild.setVehicleAsSelected(vehId);
    this.mapChild.setPositionsByUserId(this.selectedUser);
  }
}


import { Injectable, Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators';
import { User } from './user';
import { Vehicle } from './user';


@Injectable()
export class UsersService {
  
  constructor(private http: HttpClient) 
  {   }

  private userListURL = "http://mobi.connectedcar360.net/api/?op=list";

  private locationsURL = "http://mobi.connectedcar360.net/api/?op=getlocations&userid=";

  private UsersObservable: Observable<User[]>;

  private PositionObservable: Observable<Vehicle[]>;

  /** Observable function - get users list from http*/
  fetchUserList() : Observable<User[]> {
    this.UsersObservable = this.http.get<Observable<User[]>>(this.userListURL).pipe(
      map(n => this.GetUsersList(n)),
      retry(3),
      catchError(this.handleError)
      );
    return this.UsersObservable;
  }

  /** Get Users list object from raw json data*/
  GetUsersList(rawData: any): User[]
  {
    let UserList: User[] = [];
    rawData.data.forEach(element => 
      {
        if (element.userid != null)
        {
        let user: User = new User;
        user.userid = element.userid;
        user.ownername = element.owner.name;
        user.ownersurname = element.owner.surname;
        user.ownerfoto = element.owner.foto;
        user.vehicles = element.vehicles;
        UserList.push(user)
        }
      });
    return UserList;
  }

  /** Observable function - get vehicle positions list from http*/
  fetchVehiclePositionList(userid: number) : Observable<Vehicle[]> {
    this.PositionObservable = this.http.get<Observable<Vehicle[]>>(this.locationsURL + userid).
        pipe(map(
          d => d["data"]),
          retry(3),
          catchError(this.handleError)
          );
    return this.PositionObservable;
  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}

export class User {
  userid: number;
  ownername:  string;
  ownersurname: string;
  ownerfoto: string;
  selectedvehicleid: number;
  vehicles: Vehicle[];
}

export class Vehicle {
  vehicleid: number;
  make: string;
  model: string;
  year: string;
  color: string;
  vin: string;
  foto: string;
  lat: number; 
  lon: number;
}
import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { User } from '../user';
import { UsersService } from '../users.service';
import { Observable, interval, Subscription } from 'rxjs';
import { Vehicle } from '../user';

import Map from 'ol/Map';
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import Overlay from 'ol/Overlay';

@Component({
  selector: 'app-map',
  template: `
    <h2>Map</h2>
    <div class="map" id="map"></div>
    <div id="popup" class="ol-popup" >
    <a href="#" id="popup-closer" class="ol-popup-closer"></a>
        <div id="popup-content">
        </div>
    </div>
  `,
  styleUrls: ['../style.css'],
  providers: [ UsersService ],
})

export class MapComponent implements OnInit, OnChanges {
  @Input() user?: User;

  @Output() vehicleOnMapSelectedEvent = new EventEmitter;

  constructor(private usersService: UsersService) {}

  private map: Map;

  private vectorSource: VectorSource;

  private vectorView: View;

  private positionsSubscription: Subscription;

  private popup: Overlay;

  private popupContent: HTMLElement = document.getElementById('popup-content');

  ngOnInit() {
      this.initMap();
   }

   initMap()
   {
    var onSelectMap = this.vehicleOnMapSelectedEvent;
    //* Popup layer initialization */
    var container = document.getElementById('popup');
    var closer = document.getElementById('popup-closer');

    this.popupContent = document.getElementById('popup-content');
    this.popup = new Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: { duration: 250 },
    });

    //* Map initialization */
    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'})
        }),
        new VectorLayer({
          source: this.vectorSource})
      ],
      view: this.vectorView = new View({
        center: [24.120634, 56.971493],
        zoom: 12,
        projection: 'EPSG:4326'
      }),
      overlays: [this.popup]
    });
    this.vectorSource = new VectorSource( { })
    var vectorLayer = new VectorLayer({
       source: this.vectorSource
       })
     map.addLayer(vectorLayer);

    
     //* Popoup window close function */
     closer.onclick = function() {
        onSelectMap.emit(0);
     };

     map.on('click', 
      function(e) {
          map.forEachFeatureAtPixel(
            e.pixel, 
            d => {
              var featureId = d.getId();
              onSelectMap.emit(featureId);
           })
    })
   }

   /**Adds marker on map */
   markerAdd(lon: number, lat: number, vehicleColor: string, isSelected: boolean, id: number, model: string)
   {
    var marker = new Feature({
      geometry: new Point([lon, lat]),
      type: 'icon'});
      marker.setId(id);
      marker.setStyle(new Style({
        image: new CircleStyle({
          radius: isSelected?8:5,
          fill: new Fill({color: vehicleColor })
        })
      }));
      
      if(isSelected){
        this.popupContent.innerHTML = '<h4>Vehicle selected:</h4><p>Vehicle No:' + id + '</p>' + 
        '<p>Coordinates:' + lon + '  ' + lat + '</p>' +
        '<p> Model: ' + model + '</p>';
        this.popup.setPosition([lon, lat]);
      }
      this.vectorSource.addFeature(marker);
   }

   ngOnChanges(changes : SimpleChanges)
   {
    if (this.user != null)
    {
      if (this.positionsSubscription != null)
      this.positionsSubscription.unsubscribe();
          this.setPositionsByUserId(this.user);
      /**Subscribe on time interval - 30 seconds*/
      this.positionsSubscription = interval(30*1000)
          .subscribe(val => this.setPositionsByUserId(this.user));
    }
   };

   /* Set position for selected user, fetch data service*/
   setPositionsByUserId(selectedUser)
   {
     this.usersService.fetchVehiclePositionList(selectedUser.userid).subscribe(
       u => this.updatePositions(u))
    }

    /** Clear and update all vehicle positions*/
   updatePositions(newPositions: Vehicle[])
   {
      this.vectorSource.clear();
      this.popup.setPosition(undefined);
      newPositions.forEach(element => 
           {
             let vehicleInfo = this.user.vehicles.find(i => i.vehicleid == element.vehicleid);
             let vehicleModel = vehicleInfo.make + " " +vehicleInfo.model;
             let isSelected = this.user.selectedvehicleid == element.vehicleid
             if (element.lon !=null)
             {
               this.markerAdd(element.lon, element.lat, vehicleInfo.color, isSelected, element.vehicleid, vehicleModel);
               if(isSelected)
                this.focusOn(element.lon, element.lat);
             }
           });
   }

   //* Focus on vehicle */
   focusOn(lon: number, lat: number)
   {
      this.vectorView.animate({
          center : [lon, lat],
          duration: 300
        })
   }

}

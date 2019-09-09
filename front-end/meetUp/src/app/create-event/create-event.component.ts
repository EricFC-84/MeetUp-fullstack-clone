import {
  Component,
  OnInit
} from '@angular/core';
import * as moment from 'moment';
import { UserService } from '../services/user.service';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {

  startDate: string;
  startTime: string;
  endTime: string;
  description: string;
  title: string;
  eventPlace: string;
  imageUrl: string = "Escoge una imagen"


  constructor(public _user:UserService, public _data:DataService, public _router:Router) {
    let today = new Date();
    var coeff = 1000 * 60 * 30;
    let todayRounded = new Date(Math.ceil(today.getTime() / coeff) * coeff)
    this.startDate = moment(todayRounded).format('YYYY-MM-DD');
    this.startTime = moment(todayRounded).format('HH:mm');
    this.endTime = moment(todayRounded.setTime(todayRounded.getTime() + (1 * 60 * 60 * 1000))).format('HH:mm');


    // this.startDate = (`${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`).toString()
    console.log(moment(today).format('HH:mm'))
  }

  ngOnInit() {}


  /* test(){
    console.log(this.startDate)
    let eventStartDate = new Date(this.startDate + " " + this.startTime);
    console.log (eventStartDate)
    let newDate = new Date
    console.log(newDate)
    console.log(eventStartDate > newDate)

    console.log("Nombre:", this.title)
    console.log("Lugar:", this.eventPlace)
    console.log("Fecha:", this.startDate + ' ' + this.startTime + ' hasta las '+ this.endTime)
    console.log("Descripción:", this.description)
    console.log("image:", this.imageUrl)
  } */

  onFileSelected(event) {
    if (event.target.files.length > 0) {
      console.log(event.target.files[0].name);
      this.imageUrl = event.target.files[0].name;
    }
  }

  addEvent() {

    if (this.imageUrl == "Escoge una imagen") {
      this.imageUrl = undefined;
    }

    let newEvent = {
      title: this.title,
      organizer: {
        _id: this._user.loggedUser["_id"],
        name: this._user.loggedUser["name"],
        profileImage: this._user.loggedUser["profileImage"]
      },
      eventDateStart: new Date(this.startDate + " " + this.startTime),
      eventDateEnd: new Date(this.startDate + " " + this.endTime),
      eventPlace: this.eventPlace,
      mainImage: this.imageUrl,
      description: this.description,
      attendants: [{
        _id: this._user.loggedUser["_id"],
        name: this._user.loggedUser["name"],
        email: this._user.loggedUser["email"],
        profileImage: this._user.loggedUser["profileImage"]
      }]
    }

    
    console.log("addEvent:", newEvent)

      this._data.addEvent(newEvent)
  }

  cancel(){
    this.startDate= "";
    this.startTime= "";
    this.endTime= "";
    this.description= "";
    this.title= "";
    this.eventPlace= "";
    this.imageUrl = "Escoge una imagen"
    this._router.navigateByUrl("/")
  }
}

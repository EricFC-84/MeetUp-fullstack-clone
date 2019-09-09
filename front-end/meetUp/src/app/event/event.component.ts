import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  constructor(public _data:DataService, public _activeRoute:ActivatedRoute, public _user:UserService, public _router:Router) { 

    if(_data.currentEvent["_id"] == null){
      //went straight for the url not from the home
      this._data.loadSingleEvent(_activeRoute.params["_value"]["event"])
      console.log("activatedroute:",_activeRoute.params["_value"])
    }
  }

  ngOnInit() {
    
  }

  loadOrganizer(id:string) {
    console.log(this._data.currentEvent["organizer"]["_id"])
    this._router.navigateByUrl(`/profile/${this._data.currentEvent["organizer"]["_id"]}`)
  }

  attendToEvent(){
    this._data.attendToEvent()
  }

  notAttend(){
    this._data.notAttend()

  }

  withdrawFromEvent(){
    this._data.withdrawFromEvent()
  }
  
  addToFavourites(){
    this._user.addToFavourites(this._data.currentEvent["_id"])
  }

  isFavourite(){
/*     console.log("user favourites:", this._user.loggedUser["favourites"])
    console.log("event", this._data.currentEvent)
    console.log("allevents:",this._data.allEvents) */
    return this._user.isFavourite(this._data.currentEvent["_id"])
  }
}

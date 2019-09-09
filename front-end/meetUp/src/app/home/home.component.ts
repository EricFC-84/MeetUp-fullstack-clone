import {
  Component,
  OnInit
} from '@angular/core';
import {
  UserService
} from '../services/user.service';
import {
  DataService
} from '../services/data.service';
import {
  Router
} from '@angular/router';
import * as moment from 'moment';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  groupSearch: boolean = false;
  calendarSearch: boolean = true;

  searchMode: boolean = false; //In case we will always have 2 search modes, one single variable is enough
  optionSelected: number = 0;

  logout() {
    this._user.logout();
  }

  changeMode(mode: string) {
    if (mode == "grupos") {
      this.groupSearch = true;
      this.calendarSearch = false;
    } else if (mode == "calendario") {
      this.groupSearch = false;
      this.calendarSearch = true;
    }
  }

  searchOption(option: number) {
    this.optionSelected = option;
    switch (option) {
      case 0:
        //show all events on home
        break;
      case 1:
        //show events in "favourites" of loggedUser
        break;
      case 2:
        //show all events of my groups and recommendations??
        break;

      case 3:
        //show all events of my groups
        break;

      case 4:
        //show all events logged user is attending
        break;

      default:
        break;
    }
  }

  loadEvent(i) {
    console.log(this._data.allEvents[i])
    this._data.currentEvent = this._data.allEvents[i];
    this._data.formatDatesSingle()

    let organizer = this._data.currentEvent["organizer"]["name"].replace(/ /g, "-").replace(/[^\w\s]/gi, '');
    // let formatTitle = this._data.currentEvent["title"].replace(/ /g,"-").replace(/[^\w\s]/gi, '');
    this._router.navigateByUrl(`/${organizer}/event/${this._data.currentEvent["_id"]}`)
  }

  loadOrganizer(i) {
    console.log(this._data.allEvents[i])
    this._router.navigateByUrl(`/profile/${this._data.allEvents[i]["organizer"]['_id']}`)
  }


  constructor(public _user: UserService, public _data: DataService, public _router: Router) {
    this._data.loadEvents();
  }

  ngOnInit() {}

}

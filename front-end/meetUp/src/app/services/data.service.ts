import {
  Injectable
} from '@angular/core';
import {
  ApiService
} from './api.service';
import {
  UserService
} from './user.service';
import * as moment from 'moment';
import {
  Router
} from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  allEvents: object[] = []
  currentEvent: object = {}

  addEvent(newEvent: object) {
    this._api.post("http://localhost:3000/events", newEvent, {
      "Authorization": "Bearer " + this._user.token["token"]
    }).subscribe((response) => {
      this._api.stopLoading();
      this.currentEvent = {...response["data"]}
      this.formatDatesSingle() 
      console.log(response)
      console.log("organizer name:", response["data"]["organizer"]["name"])
      if (response["status"] == "OK") {
        let eventURL = `${response["data"]["organizer"]["name"]}/event/${response["data"]["_id"]}`;
        let eventsCreated = []
        eventsCreated.push(response["data"])
        let body = {
          "eventsCreated": response["data"]["_id"],
          "userID": this._user.loggedUser["_id"]
        }
        this._user.editProfile(body).subscribe((userData) => {
          this._api.stopLoading();
          this._router.navigateByUrl(eventURL)

        })

      }
    })
  }

  loadEvents() {
    this._api.get("http://localhost:3000/events", {
      "Authorization": "Bearer " + this._user.token["token"]
    }).subscribe((response) => {
      this._api.stopLoading();
      this.allEvents = [...response];
      moment.locale('es')

      for (let i = 0; i < response.length; i++) {
        this.allEvents[i]["creationDateFormatted"] = moment(this.allEvents[i]["creationDate"]).format('DD/MM/YYYY HH:mm')
        this.allEvents[i]["eventDateFormatted"] = moment(this.allEvents[i]["eventDateStart"]).format('D') + ' de ' + moment(this.allEvents[i]["eventDateStart"]).format('MMMM')
        this.allEvents[i]["eventDateTime"] = moment(this.allEvents[i]["eventDateStart"]).format('HH:mm')
        console.log("Date time", this.allEvents[i]["eventDateTime"])
        console.log("creation:", this.allEvents[i]["creationDateFormatted"])
      }

      this.allEvents.sort(function (a, b) {
        var dateA = new Date(a["eventDateStart"]),
          dateB = new Date(b["eventDateStart"]);
        // Compare the 2 dates
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;
        return 0;
      });
      console.log(this.allEvents)
    })

  }

  loadSingleEvent(id: string) {
    if (this._user.token == null) this._user.checkLogin()
    console.log("eventID: ", id)
    console.log("token:", this._user.token)

    this._api.get("http://localhost:3000/events/" + id, {
      "Authorization": "Bearer " + this._user.token["token"]
    }).subscribe((response) => {
      this._api.stopLoading();

      console.log("response: ", response[0])
      this.currentEvent = response[0];
      this.formatDatesSingle();


      console.log("currentEvent:", this.currentEvent)
    })



  }

  formatDatesSingle() {
    moment.locale('es')

    this.currentEvent["creationDateFormatted"] = moment(this.currentEvent["creationDate"]).format('DD/MM/YYYY HH:mm')
    this.currentEvent["eventDateFormatted"] = moment(this.currentEvent["eventDateStart"]).format('D') + ' de ' + moment(this.currentEvent["eventDateStart"]).format('MMMM')
    this.currentEvent["eventDateTime"] = moment(this.currentEvent["eventDateStart"]).format('HH:mm')
    this.currentEvent["eventDateDay"] = moment(this.currentEvent["eventDateStart"]).format('DD')
    this.currentEvent["eventDateMonth"] = moment(this.currentEvent["eventDateStart"]).format('MMM')
    this.currentEvent["eventDateFull"] = moment(this.currentEvent["eventDateStart"]).format('dddd') + ', ' + moment(this.currentEvent["eventDateStart"]).format('LL')
  }

  attendToEvent() {
    if (this._user.token == null) this._user.checkLogin()

    /* console.log("user:", this._user.loggedUser)
    console.log("event:", this.currentEvent) */
    let body = {
      "eventID": this.currentEvent["_id"],
      "userID": this._user.loggedUser["_id"]
    }
    this._api.put("http://localhost:3000/attend", body, {
      "Authorization": "Bearer " + this._user.token["token"]
    }).subscribe((response) => {
      this._api.stopLoading();
      if (response["status"] == "OK") {
        //eliminar usuario de la lista de notAttending en caso que estuviera apuntado que no iría
        this.currentEvent = response["data"];

        for (let i = 0; i < this.currentEvent["notAttending"].length; i++) {
          if (this.currentEvent["notAttending"][i]["_id"] == this._user.loggedUser["_id"]) {
            this.currentEvent["notAttending"].splice(i, 1)
          }

        }
        this.formatDatesSingle()

        console.log(response["data"])


      } else {
        console.log(response["message"])
      }

    })
  }

  notAttend() {
    console.log("not attending")
    if (this._user.token == null) this._user.checkLogin()
    if (this.isNotAttending()) {
      //user already in the notAttending list
    } else {
      let body = {
        "eventID": this.currentEvent["_id"],
        "userID": this._user.loggedUser["_id"]
      }
      this._api.put("http://localhost:3000/reject", body, {
        "Authorization": "Bearer " + this._user.token["token"]
      }).subscribe((response) => {
        this._api.stopLoading();
        if (response["status"] == "OK") {
          //eliminar usuario de la lista de attendants en caso que estuviera apuntado
          this.currentEvent = response["data"];
          for (let i = 0; i < this.currentEvent["attendants"].length; i++) {
            if (this.currentEvent["attendants"][i]["_id"] == this._user.loggedUser["_id"]) {
              this.currentEvent["attendants"].splice(i, 1)
            }

          }
          this.formatDatesSingle()

          console.log(response["data"])


        } else {
          console.log(response["message"])
        }

      })
    }

  }

  withdrawFromEvent() {
    if (this._user.token == null) this._user.checkLogin()
    let body = {
      "eventID": this.currentEvent["_id"],
      "userID": this._user.loggedUser["_id"]
    }
    this._api.put("http://localhost:3000/withdraw", body, {
      "Authorization": "Bearer " + this._user.token["token"]
    }).subscribe((response) => {
      this._api.stopLoading();
      if (response["status"] == "OK") {
        console.log(response["message"])
        console.log(response["data"])
        this.currentEvent = response["data"];
        this.formatDatesSingle()

      } else {
        console.log(response["message"])
      }

    })
  }

  isAttending() {
    let attending = false;
    for (let i = 0; i < this.currentEvent["attendants"].length; i++) {
      if (this.currentEvent["attendants"][i]["_id"] == this._user.loggedUser["_id"]) {
        attending = true;
      }

    }
    return attending;
  }

  isNotAttending() {
    let notAttending = false;
    for (let i = 0; i < this.currentEvent["notAttending"].length; i++) {
      if (this.currentEvent["notAttending"][i]["_id"] == this._user.loggedUser["_id"]) {
        notAttending = true;
      }
    }
    return notAttending;
  }

  constructor(public _api: ApiService, public _user: UserService, public _router: Router) {}
}

import {
  Injectable
} from '@angular/core';
import {
  ApiService
} from './api.service';
import {
  Router
} from '@angular/router';


import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  token: object;

  isLogged: boolean = false;
  registerFinished: boolean = false;

  loggedUser: object;
  currentUser: object;

  constructor(public _api: ApiService, public _router: Router) {}

  isFavourite(eventID: string) {
/*     console.log("favourites", this.loggedUser["favourites"])
    console.log("event:", eventID) */
    return (this.loggedUser["favourites"].indexOf(eventID) >= 0)
  }

  addToFavourites(eventID: string) {
    let position = this.loggedUser["favourites"].indexOf(eventID)
    if (position < 0) { //not in favourites
      this.loggedUser["favourites"].push(eventID)

    } else {
      this.loggedUser["favourites"].splice(position, 1)
      // console.log("Already in favourites")
    }
    
    this._api.put("http://localhost:3000/users/", {"_id":this.loggedUser["_id"],"favourites": this.loggedUser["favourites"]},
    {"Authorization": "Bearer " + this.token["token"]}).subscribe((response) => {
      this._api.stopLoading();
      // console.log(this.loggedUser)
      //TO DO: handle errors
    })

  }

  checkLogin(): void {
    this.token = JSON.parse(localStorage.getItem("meetUpToken"))
    if (this.token === null) {
      this.isLogged = false;
    } else {
      //get user data
      let userId = this.token["id"]
      let url = "http://localhost:3000/user/" + userId;
      this._api.get(url, {
        "Authorization": "Bearer " + this.token["token"]
      }).subscribe((response) => {
        this.loggedUser = {
          ...response['0']
        }
        this._api.stopLoading();
        // console.log(this.loggedUser)
      })
      this.isLogged = true;
    }
  }

  register(newUser: object) {
    this._api.post("http://localhost:3000/register", newUser).subscribe((response) => {
      this._api.stopLoading();

      // console.log(response);
      if (response["status"] == "OK") {
        // this.isLogged = true;
        this.registerFinished = true;
        this.loggedUser = newUser;
        // localStorage.setItem("meetUpRegisterToken",newUser["email"])
        this._router.navigateByUrl("")
      }
    })
  }

  login(email: string, password: string, guardarSesion: boolean) {
    let body = {
      email: email,
      password: password
    }
    this._api.post("http://localhost:3000/login", body).subscribe((response) => {
      this._api.stopLoading();

      // console.log(response);
      if (response["status"] == "OK") {
        // console.log("login OK!!")
        this.isLogged = true;
        if (guardarSesion) {
          console.log(response)
          this.token = {
            "id": response["userId"],
            // "name": response.userData["name"],
            // "email": response.userData["email"],
            "token": response["token"]
          }
          localStorage.setItem("meetUpToken", JSON.stringify(this.token))
        }
        this._router.navigateByUrl("/")
      }
    })
  }


  logout() {
    localStorage.removeItem("meetUpToken");
    this.loggedUser = {};
    this.isLogged = false;
    //TO DO: go to home and reload so Auth jumps automatically
    this._router.navigateByUrl("/login");
  }

  getProfileData(userId) {
    let url = "http://localhost:3000/user/" + userId;
      this._api.get(url/* , {
        "Authorization": "Bearer " + this.token["token"]
      } */).subscribe((response) => {
        console.log("response", response)
        this.currentUser = {
          ...response['0']
        }
        this.formatDateProfile()
        this._api.stopLoading();
        // console.log(this.loggedUser)
      })
  }

  formatDateProfile(){
    this.currentUser["creationDateFormatted"] = moment(this.currentUser["creationDate"]).format('DD/MM/YYYY')
    
}

  editProfile(body){
    return this._api.put("http://localhost:3000/users", body, {
      "Authorization": "Bearer " + this.token["token"]
    })
  }

}

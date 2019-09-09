import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(public _user:UserService, public _activeRoute:ActivatedRoute) { 
    if (_user.loggedUser == undefined) {
      _user.checkLogin();
    }
   let userId = _activeRoute.params["_value"]["id"];
   _user.getProfileData(userId)
  }

  ngOnInit() {
  }

}

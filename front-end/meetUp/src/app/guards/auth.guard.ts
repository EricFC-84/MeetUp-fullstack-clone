import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
// import { CanActivate } from '@angular/router/src/utils/preactivation';
import { UserService } from '../services/user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(public _user: UserService, public _router: Router){}

  canActivate(){
    this._user.checkLogin();
    if(this._user.isLogged === true){
      return true;
    } else {
      this._router.navigateByUrl('/login');
      return false;
    }
  }
  
}

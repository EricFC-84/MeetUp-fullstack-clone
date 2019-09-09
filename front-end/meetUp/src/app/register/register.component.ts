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

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  nameRegister: string = "";
  emailRegister: string = "";
  passwordRegister: string = "";

  inputErrors: object = {
    "name": false,
    "email": false,
    "password": false
  }

  checkRegistryData(): boolean {

    let emailCorrect = this.validateEmail();
    let nameCorrect = this.validateName();
    let passwordCorrect = this.validatePassword();

    this.inputErrors = {
      "name" : !nameCorrect,
      "email": !emailCorrect,
      "password": !passwordCorrect
    }

    if (!emailCorrect || !nameCorrect || !passwordCorrect) {
      return false;
    } else {
      return true;
    }

  }

  validatePassword(){
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/.test(this.passwordRegister)) {
      return (true)
    } else {

      console.log("You have entered an invalid password!")
      return (false)
    }
  }
  

  validateName() {
    if (/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(this.nameRegister)) {
      return (true)
    } else {

      console.log("You have entered an invalid name!")
      return (false)
    }
  }

  validateEmail() {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.emailRegister)) {
      return (true)
    } else {

      console.log("You have entered an invalid email address!")
      return (false)
    }
  }
  
  register() {

    if (this.checkRegistryData()) {

      let newUser = {
        name: this.nameRegister,
        email: this.emailRegister,
        password: this.passwordRegister
      }
      console.log(newUser)
      this._user.register(newUser)
    }
  }
  constructor(public _user: UserService, public _data: DataService) {}

  ngOnInit() {}

}

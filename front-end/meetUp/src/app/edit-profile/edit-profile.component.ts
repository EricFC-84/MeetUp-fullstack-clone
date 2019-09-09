import {
  Component,
  OnInit
} from '@angular/core';
import {
  UserService
} from '../services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  optionSelected: number = 0;
  itemToEdit: string;


  constructor(public _user: UserService) {}

  ngOnInit() {}
  edit(item:string){
    this.itemToEdit = item;
  }
  editOption(option: number) {
    this.optionSelected = option;
    switch (option) {
      case 0:
        //General
        break;
      case 1:
        //>Notificaciones por correo electrónico
        break;
      case 2:
        //Notificaciones push
        break;

      case 3:
        //Privacidad
        break;

      case 4:
        //Redes sociales
        break;
      case 5:
        //Suscripción de organizador
        break;
      case 6:
        //Métodos de pago
        break;

      case 7:
        //Pagos realizados
        break;

      case 8:
        //Aplicaciones
        break;
      default:
        break;
    }
  }

}

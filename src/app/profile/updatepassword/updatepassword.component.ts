import { Component } from '@angular/core';
import { storageService } from 'src/app/storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-updatepassword',
  templateUrl: './updatepassword.component.html',
  styleUrls: ['./updatepassword.component.css']
})
export class UpdatepasswordComponent {
  currentpassword: string = '';
  confirmpassword: string = '';
  newpassword: string = '';

  constructor(private storage: storageService, private http: HttpClient, private route:Router) {}

  updatepass() {
    // Validación básica de campos
    if (!this.currentpassword || !this.confirmpassword || !this.newpassword) {
      //console.error('Todos los campos deben ser completados');
      Swal.fire({
    
        text: 'Faltan datos por llenar',
        icon: 'error',
      
      })
      //alert("Todos los campos deben de ser llenados");
      return;
    }else if(this.newpassword!=this.confirmpassword){
      Swal.fire({
    
        text: 'La confirmacion de contraseña no coincide con la nueva',
        icon: 'error',
      
      })
      //alert("La confirmacion de contraseña no coincide con la nueva");
    }
    else{
      const url = `https://doctorappbackend-wpqd.onrender.com/doctors/updatePswrd?idDoctor=${this.storage.getDataItem("user")}&Contrasena=${this.currentpassword}&ContrasenaNueva=${this.newpassword}&verif_contra=${this.confirmpassword}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': 'application/json'
     });
  // Realiza la solicitud POST
      this.http.put(url, {headers}).subscribe(
        (response: any) => {
          console.log('Contraseña actualizada:', response);
          Swal.fire({
    
            text: 'Contraseña actualizada',
            icon: 'success',
          
          })
          //alert("Contraseña actualizada");
          this.route.navigate(['/patients/patientslist']);
          // Manejar la respuesta si es necesario
        },
        (error) => {
          console.error('Error al actualizar contraseña:', error);
          Swal.fire({
    
            text: 'Faltan datos por llenar',
            icon: 'error',
          
          })
          alert("Contraseña incorrecta");
          // Manejar errores si es necesario
        }
      );
  }
    }

    
}
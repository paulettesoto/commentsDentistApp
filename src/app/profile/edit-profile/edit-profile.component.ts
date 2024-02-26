import { Component,OnInit } from '@angular/core';
import { AppModule } from 'src/app/app.module';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { NavbarComponent } from 'src/app/shared/navbar/navbar.component';
import { storageService } from 'src/app/storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})

export class EditProfileComponent {
  name: string;
  lastname: string;
  lastname2: string;
  phonenumber: string;
  email: string;
  foto:string;


  constructor(private storage: storageService, private http: HttpClient, private route:Router) {
    this.name = '';
    this.lastname = '';
    this.lastname2 = '';
    this.phonenumber = '';
    this.email = '';
    this.foto='foto';
  }
  ngOnInit(): void {
  
      // Realizar acciones necesarias cuando logoutTrigger cambie
    
      this.name = this.storage.getDataItem('nombre');
      this.lastname = this.storage.getDataItem('apellido1');
      this.lastname2 = this.storage.getDataItem('apellido2');
      this.phonenumber=this.storage.getDataItem('celular');
      this.email=this.storage.getDataItem('email');
      // ... Otros procesos relacionados con la actualización de type
   
  }
  update() {
    // Validación básica de campos
    if (!this.name || !this.lastname || !this.lastname2  || !this.phonenumber || !this.email || !this.email) {
      console.error('Todos los campos deben ser completados');
      Swal.fire({
    
        text: 'Faltan datos por llenar',
        icon: 'error',
      
      })
      //alert("No se aceptan campos vacios");
      return;
    }else{
      const url = `https://doctorappbackend-wpqd.onrender.com/doctors/update?idDoctor=${this.storage.getDataItem("user")}&Nombre=${this.name}&PrimerApe=${this.lastname}&SegundoApe=${this.lastname2}&Celular=${this.phonenumber}&Correo=${this.email}&Foto=${this.foto}}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': 'application/json'
     });
  // Realiza la solicitud POST
      this.http.put(url, {headers}).subscribe(
        (response: any) => {
          console.log('Datos actualizados:', response);
          Swal.fire({
    
            text: 'Datos actualizados',
            icon: 'success',
          
          })
          alert("Datos actualizados");
          this.route.navigate(['/patients/patientslist']);
          // Manejar la respuesta si es necesario
        },
        (error) => {
          console.error('Error al actualizar datos:', error);
          // Manejar errores si es necesario
        }
      );
  }
    }
 
}

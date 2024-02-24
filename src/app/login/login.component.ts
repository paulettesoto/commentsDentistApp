import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { storageService } from '../storage.service';
import Swal from 'sweetalert2'



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit{


  constructor(private http:HttpClient, private route:Router,private storage: storageService) {}
  user= '';
  password= '';
  type= 'doctor';
  ngOnInit(): void {
    
  }


  login() {
    if(!this.type||!this.user||!this.password){
    // alert("Faltan campos por llenar");
    Swal.fire({
    
      text: 'Faltan datos por llenar',
      icon: 'error',
    
    })
    }else{

    
    this.storage.clearAllDataItems();
    console.log(this.user);
    console.log(this.password);
    console.log(this.type);
    let url = '';
    const params = new HttpParams()
      .set('user', this.user)
      .set('pswrd', this.password);

      if (this.type === 'doctor') {
        url = 'https://doctorappbackend-wpqd.onrender.com/login';
        this.storage.setDataItem('prefix', 'Dr.');
        this.storage.setDataItem('type','1');

      }else if (this.type === 'patient') {
        url = 'https://doctorappbackend-wpqd.onrender.com/login_paciente';
        this.storage.setDataItem('prefix', '¡Hola!');
        this.storage.setDataItem('type','2');
      }
    
    this.http.get(url, { params }).subscribe(
      (response: any) => {
        console.log(response);

        if (response && response.id){
          const usr = response.id;
          const nombre = response.Nombre;
          const apellido1 = response.PrimerApe;
          const apellido2 = response.SegundoApe;
          const correo=response.email;
          const fecha_nac=response.FechaNac;
          console.log(response.FechaNac);

          console.log(usr);
          this.storage.setDataItem('user', usr.toString());
          this.storage.setDataItem('nombre',nombre.toString());
          this.storage.setDataItem('apellido1',apellido1.toString());
          this.storage.setDataItem('apellido2',apellido2.toString());
          this.storage.setDataItem('celular',this.user);
          this.storage.setDataItem('email',correo.toString());
         
         

          
          if (this.type === 'doctor') {
            this.route.navigate(['/schedule/scheduleview']);
            this.storage.setDataItem('actualizar','true');
          }else if (this.type === 'patient') {
            this.storage.setDataItem('fecha_nac',fecha_nac.toString());
            this.route.navigate(['/patient/patientpanel']);
     
            this.storage.setDataItem('actualizar','true');
          }

        } else {
          // Manejar el caso en el que el usuario no es un número
          alert("Contraseña o usuario incorectos");
        }
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
        
      }
    );
  }
}

  
}

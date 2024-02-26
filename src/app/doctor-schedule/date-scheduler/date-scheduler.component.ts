import { Component } from '@angular/core';
import { HttpClient, HttpParams,HttpHeaders } from '@angular/common/http';
import { storageService } from 'src/app/storage.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-date-scheduler',
  templateUrl: './date-scheduler.component.html',
  styleUrls: ['./date-scheduler.component.css']
})
export class DateSchedulerComponent {
  name: string;
  lastname: string;
  lastname2: string;
  date: string;
  hour:string;
  usagedDates: any[] = [];
  constructor(private http:HttpClient, private route:Router, private storage:storageService) {
    this.name = '';
    this.lastname = '';
    this.lastname2 = '';
    this.date = '';
   this.hour='';
  }
  formatdate(date:string ):string{
    const dateObj = new Date(date);

    // Obtén los componentes de la fecha (año, mes, día)
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Ajusta para que siempre tenga dos dígitos
    const day = dateObj.getDate().toString().padStart(2, '0'); // Ajusta para que siempre tenga dos dígitos
    
    // Crea la cadena de fecha en el formato deseado (YYYY/MM/DD)
    return `${year}-${month}-${day}`;
  }
  formatHora(segundos: number): string {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);

    return `${this.agregarCero(horas)}:${this.agregarCero(minutos)}`;
  }

  agregarCero(valor: number): string {
    return valor < 10 ? `0${valor}` : `${valor}`;
  }

  search() {
    if(!this.date){
      Swal.fire({
    
        text: 'Campo de fecha vacio',
        icon: 'error',
      
      })
      //alert("Campo de fecha vacio");
    }else{

    
      const url = 'https://doctorappbackend-wpqd.onrender.com/schedules/availableDates';
    
      const idDoctor = this.storage.getDataItem('user');
      const formattedDate = this.formatdate(this.date);
    
      // Construir los parámetros
      const params = new HttpParams()
        .set('idDoctor', idDoctor)
        .set('fecha', formattedDate);
    
      // Hacer la solicitud GET con los parámetros
      this.http.get(url, { params }).subscribe(
        (response: any) => {
          if (response && response.availableDates && Array.isArray(response.availableDates)) {
            this.usagedDates = response.availableDates;
            console.log(this.usagedDates);
          } else {
            console.error('Error:', response);
            // Podrías manejar el error aquí si la respuesta no tiene la estructura esperada
          }
        },
        (error) => {
          console.error('Error:', error);
          // Aquí puedes manejar errores de la solicitud HTTP
        }
      );
    }
  }
  
  agregar() {
    if(!this.hour){
      Swal.fire({
    
        text: 'Campo de hora vacio',
        icon: 'error',
      
      })
      //alert("Campo de hora vacio");
    }else{
      const hora = this.hour;
      const url = `https://doctorappbackend-wpqd.onrender.com/schedules/addDates?idDoctor=${this.storage.getDataItem('user')}&fecha=${this.formatdate(this.date)}&hora=${hora}&status=true`;
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'accept': 'application/json'
       });
        // Realiza la solicitud POST
          this.http.post(url, {headers}).subscribe(
            (response: any) => {
          console.log('Solicitud POST exitosa:', response);
          Swal.fire({
            text: 'Hora agregada',
            icon: 'success',
          
          })
          //alert("Hora agregada");
          this.search();
          // Manejar la respuesta según tus necesidades
        },
        (error) => {
          console.error('Error en la solicitud POST:', error);
        }
    );
  }
  }
  deletehour(id:any){
    const url = 'https://doctorappbackend-wpqd.onrender.com/schedules/deleteDates';
  
      const params = new HttpParams()
        .set('idHorario', id);
        ;
        this.http.delete(url, { params }).subscribe(
          (response: any) => {
            if (response && response.success) {
              console.log("horario cancelado");
              Swal.fire({
    
                text: 'Hora eliminada',
                icon: 'success',
              
              })
              //alert("Hora eliminada");
              this.search();
            } else {
              console.error('Error:', response);
            }
          },
          (error) => {
            console.error('Error:', error);
          }
        );


  }

}

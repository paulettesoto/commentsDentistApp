import { Component, OnInit } from '@angular/core';
import { storageService } from 'src/app/storage.service';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-service-panel',
  templateUrl: './service-panel.component.html',
  styleUrls: ['./service-panel.component.css']
})
export class ServicePanelComponent implements OnInit {
  constructor(private storage:storageService, private http:HttpClient) {
    this.treatment = '';
    this.precio='';
    this.question='';
    
  }
  treatment: string;
  precio: string;
  question:string;
  treatments: any[] = [];
  questions: any[] = [];
  page=1;
  pages=1;
  paged=2;
  page2=1;
  pages2=1;

  
  paginador(i:number){
    let r:Number;
    this.page=this.page+i;
    r=this.page;
    if(r==0){
      this.page=1;
    }
    if(r==(this.pages+1)){
      this.page=(this.pages);
    }

  }
  paginador2(i:number){
    let r:Number;
    this.page2=this.page2+i;
    r=this.page2;
    if(r==0){
      this.page2=1;
    }
    if(r==(this.pages2+1)){
      this.page2=(this.pages2);
    }

  }
  

  ngOnInit(): void {
    this.treatmentlist();
    this.questionslist();
  }
  add_treatments() {
    if(!this.treatment||!this.precio){
      Swal.fire({
    
        text: 'Faltan datos por llenar',
        icon: 'error',
      
      })
      //alert("Faltan campos por agregar");
    }else{
      const url = `https://doctorappbackend-wpqd.onrender.com/treatments/addTreatment?tratamiento=${this.treatment}&idDoctor=${this.storage.getDataItem("user")}&costo=${this.precio}`;
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'accept': 'application/json'
       });
    // Realiza la solicitud POST
    this.http.post(url, {headers}).subscribe(
      (response: any) => {
        console.log('Solicitud POST exitosa:', response);
        Swal.fire({
    
          text: 'Tratamiento exitoso',
          icon: 'success',
        
        })
        //alert("Tratamiento exitoso");
        this.treatment='';
        this.precio='';
        this.treatmentlist();
        // Manejar la respuesta según tus necesidades
      },
      (error) => {
        console.error('Error en la solicitud POST:', error);
      }
    );
  }
  }

  add_question() {
    if(!this.question){
      Swal.fire({
    
        text: 'No se ha agregado pregunta',
        icon: 'error',
      
      })
      //alert("No se ha agregado pregunta");
    }else{
      const url = `https://doctorappbackend-wpqd.onrender.com/clinicalRecords/addQuestion?pregunta=${this.question}&idDoctor=${this.storage.getDataItem("user")}`;
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'accept': 'application/json'
       });
    // Realiza la solicitud POST
    this.http.post(url, {headers}).subscribe(
      (response: any) => {
        console.log('Solicitud POST exitosa:', response);
        Swal.fire({
    
          text: 'Pregunta agregada',
          icon: 'success',
        
        })
        //alert("Pregunta agregada");
        // Manejar la respuesta según tus necesidades
      this.question='';
      this.questionslist();
      },
      (error) => {
        console.error('Error en la solicitud POST:', error);
      }
    );
  }
  }

  treatmentlist(){
    const url = 'https://doctorappbackend-wpqd.onrender.com/treatments/treatments';
  
      const params = new HttpParams()
        .set('idDoctor', this.storage.getDataItem('user'));
  
      this.http.get(url, { params }).subscribe(
        (response: any) => {
          if (response && response.treatments) {
            this.treatments = response.treatments;
            this.pages=Math.ceil(this.treatments.length/this.paged);
            console.log(this.treatments);
          } else {
            console.error('Error:', response);
          }
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    }

    deletetreatment(id:any){
      const url = 'https://doctorappbackend-wpqd.onrender.com/treatments/deleteTreatment';
  
      const params = new HttpParams()
        .set('idTratamiento', id);
        ;
        this.http.delete(url, { params }).subscribe(
          (response: any) => {
            if (response && response.success) {
              console.log("Tratamiento eliminado");
              //alert("Tratamiento eliminado");
              Swal.fire({
    
                text: 'Tratamiento eliminado',
                icon: 'success',
              
              })
              this.treatmentlist();
            } else {
              console.error('Error:', response);
            }
          },
          (error) => {
            console.error('Error:', error);
          }
        );
    }

    questionslist(){
      const url = 'https://doctorappbackend-wpqd.onrender.com/clinicalRecords/clinicalRecords';
    
        const params = new HttpParams()
          .set('idDoctor', this.storage.getDataItem('user'));
    
        this.http.get(url, { params }).subscribe(
          (response: any) => {
            if (response && response.clinicalRecords) {
              this.questions = response.clinicalRecords;
              this.pages2=Math.ceil(this.questions.length/this.paged);
              console.log(this.questions);
            } else {
              console.error('Error:', response);
            }
          },
          (error) => {
            console.error('Error:', error);
          }
        );
      }

      deletequestion(id:any){
        const url = 'https://doctorappbackend-wpqd.onrender.com/clinicalRecords/deleteQuestion';
  
      const params = new HttpParams()
        .set('idHistoriaClinica', id);
        ;
        this.http.delete(url, { params }).subscribe(
          (response: any) => {
            if (response && response.success) {
              console.log("pregunta eliminada");
              Swal.fire({
    
                text: 'Pregunta eliminada',
                icon: 'success',
              
              })
              //alert("Pregunta eliminada");
              this.questionslist();
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


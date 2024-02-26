import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { storageService } from 'src/app/storage.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  nombre: string = "";
  apellido1: string = "";
  apellido2: string = "";
  prefix: string = "";
  mod?:boolean;
  mode?: string;

  constructor(private route:Router, private storage : storageService) {  }
  //togglemode(){
  //  this.mod = !this.mod;
  //  const mode = this.mod ? 'dark' : 'light';
  //  this.storage.setDataItem('mode', mode);
  //}

  ngOnInit(): void {
    this.storage.logout$.subscribe((value) => {
      // Realizar acciones necesarias cuando logoutTrigger cambie
      this.prefix = this.storage.getDataItem('prefix');
      this.nombre = this.storage.getDataItem('nombre');
      this.apellido1 = this.storage.getDataItem('apellido1');
      this.apellido2 = this.storage.getDataItem('apellido2');
    });


  }
  logout() {
    // Limpiar localStorage
    this.storage.clearAllDataItems();
    this.route.navigate(['/login']);

  }
}

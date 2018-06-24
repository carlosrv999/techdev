import { CocheraService } from 'app/servicios/cochera.service';
import { AuthService } from './../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { Cochera } from "app/models/cochera.model";

@Component({
  selector: 'app-cupos-manager',
  templateUrl: './cupos-manager.component.html',
  styleUrls: ['./cupos-manager.component.css']
})
export class CuposManagerComponent implements OnInit {
  agregarCuposLoading = false;
  eliminarCuposLoading = false;
  notif = false;
  notifEliminar: boolean = false;
  modalActive = false;
  modalEliminar = false;
  loading: boolean = false;
  cochera: Cochera;

  constructor(private authService: AuthService,
              private cocheraService: CocheraService) { }

  ngOnInit() {
    this.setCochera();
  }

  setCochera () {
    if(localStorage.key(0) != null) {
      let coch: Cochera = <Cochera>JSON.parse(localStorage.getItem(localStorage.key(0)));
      this.cocheraService.getCochera(coch.id).subscribe(
        (response) => {
          let resp: Cochera = <Cochera>response.json();
          this.cochera = resp;
        }, (error) => {
          console.log(error);
        }
      )
    }
  }

  cambiarEstadoCochera() {
    this.loading = true;
    this.cocheraService.patchCocheraEstado(this.cochera.id, !this.cochera.estado).subscribe(
      (response) => {
        let resp: Cochera = <Cochera>response.json();
        this.cochera.estado = resp.estado;
        this.loading = false;
      }, (error) => {
        console.log(error.json());
      }
    );
  }

  onBackgroundClick() {
    this.modalActive = false;
    this.modalEliminar = false;
  }

  onCloseModal() {
    this.modalActive = false;
    this.modalEliminar = false;
  }

  onAgregarCupo() {
    if(this.cochera.cupos_disp == 0) {
      this.notif = true;
      setTimeout(() => {
        this.notif = false;
      }, 4000);
    } else {
      this.modalActive = true;
    }
  }

  onEliminarCupo() {
    if(this.cochera.cupos_disp == this.cochera.capacidad) {
      this.notifEliminar = true;
      console.log(this.notifEliminar);
      setTimeout(() => {
        this.notifEliminar = false;
      }, 4000);
    } else {
    this.modalEliminar = true;
    }
  }

  onCloseNotif() {
    this.notif = false;
  }

  onCloseNotifEliminar() {
    this.notifEliminar = false;
  }

  agregarCupo() {
    this.agregarCuposLoading = true;
    this.cocheraService.patchCocheraCupo(this.cochera.id, this.cochera.cupos_disp - 1).subscribe(
      (response) => {
        let resp: Cochera = <Cochera>response.json();
        this.cochera.cupos_disp = resp.cupos_disp;
        this.agregarCuposLoading = false;
        this.modalActive = false;
      }, (error) => {
        console.log(error);
      }
    );
  }

  eliminarCupo() {
    this.eliminarCuposLoading = true;
    this.cocheraService.patchCocheraCupo(this.cochera.id, this.cochera.cupos_disp + 1).subscribe(
      (response) => {
        let resp: Cochera = <Cochera>response.json();
        this.cochera.cupos_disp = resp.cupos_disp;
        this.eliminarCuposLoading = false;
        this.modalEliminar = false;
      }, (error) => {
        console.log(error);
      }
    );
  }

}

import { UpdateService } from './../servicios/update.service';
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
  reloading: boolean = false
  agregarCuposLoading = false;
  eliminarCuposLoading = false;
  notif = false;
  notifEliminar: boolean = false;
  modalActive = false;
  modalEliminar = false;
  loading: boolean = false;
  cochera: any;

  constructor(private authService: AuthService,
              private cocheraService: CocheraService,
              private update: UpdateService) { }

  ngOnInit() {
    this.setCochera();
    this.update.clicked.subscribe((clicked) => {
      this.setCochera();
    });
  }

  setCochera () {
    this.reloading = true;
    if(localStorage.key(0) != null) {
      let coch: any = JSON.parse(localStorage.getItem(localStorage.key(0)));
      this.cocheraService.getCochera(coch.id).subscribe(
        (response) => {
          this.reloading = false;
          let resp = response.json();
          console.log(resp);
          this.cochera = resp;
        }, (error) => {
          console.log(error);
        }
      )
    }
  }

  cambiarEstadoCochera() {
    this.loading = true;
    this.cocheraService.patchCocheraEstado(this.cochera.id, !this.cochera.status).subscribe(
      (response) => {
        let resp = response.json();
        console.log(resp);
        this.cochera.status = resp.result.updatedParking.status;
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
    if(this.cochera.current_used >= this.cochera.capacity) {
      this.notif = true;
      setTimeout(() => {
        this.notif = false;
      }, 4000);
    } else {
      this.modalActive = true;
    }
  }

  onEliminarCupo() {
    if(this.cochera.current_used == 0) {
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
    this.cocheraService.patchCocheraCupo(this.cochera.id, this.cochera.current_used + 1).subscribe(
      (response) => {
        let resp: any = response.json();
        console.log(resp);
        this.cochera.current_used = resp.result.updatedParking.current_used;
        this.agregarCuposLoading = false;
        this.modalActive = false;
      }, (error) => {
        console.log(error);
      }
    );
  }

  eliminarCupo() {
    this.eliminarCuposLoading = true;
    this.cocheraService.patchCocheraCupo(this.cochera.id, this.cochera.current_used - 1).subscribe(
      (response) => {
        let resp: any = response.json();
        this.cochera.current_used = resp.result.updatedParking.current_used;
        this.eliminarCuposLoading = false;
        this.modalEliminar = false;
      }, (error) => {
        console.log(error);
      }
    );
  }

}

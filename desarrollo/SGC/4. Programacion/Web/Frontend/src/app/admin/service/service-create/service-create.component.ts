import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ParkingService } from './../../parking/parking.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-service-create',
  templateUrl: './service-create.component.html',
  styleUrls: ['./service-create.component.css']
})
export class ServiceCreateComponent implements OnInit {
  loadingSave = false;
  formCreate: FormGroup;
  id_parking: string;
  notUsedServices = [];

  constructor(private _ps: ParkingService, private router: Router, private _fb: FormBuilder) { }

  ngOnInit() {
    this.formCreate = this._fb.group({
      'cost_hour': [null, Validators.required],
      'id_service': [null, Validators.required]
    });

    this.id_parking = this._ps.id_parking;
    this._ps.getNotUsedServices(this.id_parking).subscribe(
      (resolve) => {
        this.notUsedServices = resolve;
      }, (error) => {
        console.log('error al buscar servicios', error);
      }
    )
    if (this.id_parking == null) this.router.navigate(['/home/services']);
    console.log('en servicio create: parking: ', this.id_parking);
  }

  onCancelar() {
    this.router.navigate(['/home/services']);
  }

  onSubmit() {
    if(this.formCreate.valid){
      console.log(this.formCreate.value);
      this.loadingSave = true;
      this._ps.createService(this.id_parking, this.formCreate.value).subscribe(
        (resolve) => {
          this.loadingSave = false;
          this.router.navigate(['/home/services'], { queryParams: { exito: true } });          
        }, (error) => {
          this.loadingSave = false;
          console.log(error);
        }
      )
    }
  }

}

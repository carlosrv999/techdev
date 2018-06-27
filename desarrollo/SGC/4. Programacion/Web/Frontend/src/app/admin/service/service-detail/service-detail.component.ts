import { ParkingService } from './../../parking/parking.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent implements OnInit {
  loadingSave = false;
  editMode = false;
  @Input() index: number;
  @Input() service: any;
  formDetail: FormGroup;
  initialValue: number;
  @ViewChild('modalError') modalError: ElementRef;
  NO_MODIFICADO: string = 'No ha modificado los campos';
  ERROR_ACTUALIZAR: string = 'El email esta siendo usado';
  ERROR_SUBIR_IMAGEN: string = 'Hubo un error al subir la imagen';
  errorModal = this.NO_MODIFICADO;

  constructor(private _fb: FormBuilder, private _ps: ParkingService) { }

  ngOnInit() {
    this.formDetail = this._fb.group({
      'cost_hour': [{ value: this.service.cost_hour, disabled: true }, Validators.required]
    })
    this.initialValue = this.service.cost_hour;
    console.log('service recibido', this.service);
  }

  onEditMode() {
    this.editMode = true;
    this.formDetail.enable();
  }

  onCancel() {
    this.editMode = false;
    this.formDetail.disable();
    this.formDetail.get('cost_hour').setValue(this.initialValue);
  }

  onSubmit() {
    if (this.formDetail.valid) {
      if (this.formDetail.get('cost_hour').value == this.initialValue) {
        $(this.modalError.nativeElement).modal('show');
      } else {
        console.log(this.formDetail.value);
        this.loadingSave = true;
        this._ps.updateService(this.service.id, this.formDetail.value).subscribe(
          (resolve) => {
            this.loadingSave = false;
            this.initialValue = this.formDetail.get('cost_hour').value;
            this.editMode = false;
            this.formDetail.disable();
          }, (error) => {
            this.loadingSave = false;
            console.log(error);
          }
        )
      }
    }
  }

}

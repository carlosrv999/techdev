import { FileItem } from './../parking-create/file-item';
import { Location } from '@angular/common';
import { AgmMap } from '@agm/core';
import { ParkingService } from './../parking.service';
import { Component, OnInit, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-parking-detail',
  templateUrl: './parking-detail.component.html',
  styleUrls: ['./parking-detail.component.css']
})
export class ParkingDetailComponent implements OnInit {
  archivos: FileItem[] = [];
  imagenFondo: string;
  estaSobreDropZone: boolean = false;
  loadingSave = false;
  temp: any;
  @ViewChild('modalError') modalError: ElementRef;
  errorModal: string;
  NO_MODIFICADO: string = 'No ha modificado los campos';
  ERROR_ACTUALIZAR: string = 'El email esta siendo usado';
  ERROR_SUBIR_IMAGEN: string = 'Hubo un error al subir la imagen';
  editMode = false;
  success = false;
  @Input() index: number;
  @ViewChild('varName')
  public agmMap: AgmMap;
  @ViewChild('varName2')
  public agmMapEdit: AgmMap;
  markerNew: any;

  initialValues: any;

  newPassword: string = '';
  lima = {
    lat: -12.060897,
    lng: -77.042889
  };
  @ViewChild('myModal') myModal: ElementRef;
  @Input() parking: any;

  marker: any;
  formDetail: FormGroup;
  formPasswordChange: FormGroup;

  constructor(private _fb: FormBuilder, private _ps: ParkingService) { }

  setDefaultValues() {
    this.formDetail.get('email').setValue(this.initialValues.email);
    this.formDetail.get('name').setValue(this.initialValues.name);
    this.formDetail.get('coordinates').setValue(this.initialValues.coordinates);
    this.formDetail.get('address').setValue(this.initialValues.address);
    this.formDetail.get('phone_number').setValue(this.initialValues.phone_number);
    this.formDetail.get('id_employee').setValue(this.initialValues.id_employee);
    this.formDetail.get('status').setValue(this.initialValues.status);
    this.formDetail.get('capacity').setValue(this.initialValues.capacity);
    this.formDetail.get('description').setValue(this.initialValues.description);
  }

  ngOnInit() {
    this.formDetail = this._fb.group({
      "email": [{ value: this.parking.email, disabled: true }, Validators.required],
      "name": [{ value: this.parking.name, disabled: true }, Validators.required],
      'coordinates': [`POINT(${this.parking.location.coordinates[0]} ${this.parking.location.coordinates[1]})`, Validators.required],
      "address": [{ value: this.parking.address, disabled: true }, Validators.required],
      "phone_number": [{ value: this.parking.phone_number, disabled: true }, Validators.required],
      "id_employee": [{ value: this.parking.employee ? this.parking.employee.id : null, disabled: true }],
      "status": [{ value: this.parking.status, disabled: true }],
      "capacity": [{ value: this.parking.capacity, disabled: true }, Validators.required],
      "description": [{ value: this.parking.description, disabled: true }, Validators.required]
    })
    this.marker = {
      lat: this.parking.location.coordinates[0],
      lng: this.parking.location.coordinates[1]
    }
    this.imagenFondo = this.parking.url_image;

    this.initialValues = {
      email: this.parking.email,
      name: this.parking.name,
      coordinates: `POINT(${this.parking.location.coordinates[0]} ${this.parking.location.coordinates[1]})`,
      address: this.parking.address,
      phone_number: this.parking.phone_number,
      id_employee: this.parking.employee ? this.parking.employee.id : null,
      status: this.parking.status,
      capacity: this.parking.capacity,
      description: this.parking.description
    };

    this.formPasswordChange = this._fb.group({
      "oldPassword": ['', Validators.required],
      "newPassword": ['', Validators.required],
      "newPassword2": ['', Validators.required]
    }, { validator: this.matchPassword });
  }

  matchPassword(AC: AbstractControl) {
    let password = AC.get('newPassword').value; // to get value in input tag
    let confirmPassword = AC.get('newPassword2').value; // to get value in input tag
    if (password != confirmPassword) {
      AC.get('newPassword2').setErrors({ MatchPassword: true })
    } else {
      return null;
    }
  }

  onModalMap() {
    setTimeout(() => {
      this.agmMap.triggerResize();
      this.agmMapEdit.triggerResize();
    }, 300);
  }

  handleMapClick(event: { coords: { lat: number, lng: number } }) {
    this.markerNew = {
      lat: event.coords.lat,
      lng: event.coords.lng
    }
    this.temp = this.markerNew;
    let text = `POINT(${event.coords.lat} ${event.coords.lng})`;
    this.formDetail.get('coordinates').setValue(text);
  }

  onSubmitPassword() {
    if (!this.formPasswordChange.valid) {
      return;
    }
    let objSubmit = this.formPasswordChange.value;
    delete objSubmit.newPassword2;
    this._ps.changeParkingPassword(objSubmit, this.parking.id_user).subscribe(
      (resolve) => {
        this.formPasswordChange.reset();
        this.success = true;
        this.newPassword = objSubmit.newPassword;
        setTimeout(() => {
          this.success = false;
        }, 5000);
        // $(this.myModal.nativeElement).modal('hide');
      }, (error) => {
        console.log(error);
      }
    )
    console.log('hola:', this.parking);
    console.log(this.formPasswordChange.value);
  }

  onSubmitSave() {

    let submitValues: any = {};
    if (this.initialValues.email != this.formDetail.get('email').value) submitValues['email'] = this.formDetail.get('email').value;
    if (this.initialValues.name != this.formDetail.get('name').value) submitValues['name'] = this.formDetail.get('name').value;
    if (this.initialValues.coordinates != this.formDetail.get('coordinates').value) submitValues['coordinates'] = this.formDetail.get('coordinates').value;
    if (this.initialValues.address != this.formDetail.get('address').value) submitValues['address'] = this.formDetail.get('address').value;
    if (this.initialValues.phone_number != this.formDetail.get('phone_number').value.toString()) submitValues['phone_number'] = this.formDetail.get('phone_number').value.toString();
    if (this.initialValues.id_employee != this.formDetail.get('id_employee').value) submitValues['id_employee'] = this.formDetail.get('id_employee').value;
    if (this.initialValues.status != this.formDetail.get('status').value) submitValues['status'] = this.formDetail.get('status').value;
    if (this.initialValues.capacity != this.formDetail.get('capacity').value) submitValues['capacity'] = this.formDetail.get('capacity').value;
    if (this.initialValues.description != this.formDetail.get('description').value) submitValues['description'] = this.formDetail.get('description').value;
    let files = [];
    this.loadingSave = true;
    this.archivos.forEach((obj) => {
      files.push(obj.archivo);
      console.log(obj.archivo);
    });
    if (files.length > 0) {
      this._ps.uploadFile(files).subscribe(
        (resolve) => {
          let response = JSON.parse(resolve.response);
          console.log(response.url_image);
          submitValues['url_image'] = response.url_image;
          this._ps.updateParking(submitValues, this.parking.id).subscribe(
            (resolve) => {
              this.loadingSave = false;
              this.initialValues = {
                email: this.formDetail.get('email').value,
                name: this.formDetail.get('name').value,
                coordinates: this.formDetail.get('coordinates').value,
                address: this.formDetail.get('address').value,
                phone_number: this.formDetail.get('phone_number').value.toString(),
                id_employee: this.formDetail.get('id_employee').value ? this.formDetail.get('id_employee').value : null,
                status: this.formDetail.get('status').value,
                description: this.formDetail.get('description').value,
                capacity: this.formDetail.get('capacity').value
              };
              this.imagenFondo = response.url_image;
              if (submitValues.coordinates) {
                this.marker = this.temp;
              }
              this.archivos = [];
              this.editMode = false;
            }, (error) => {
              this.onEditMode();
              this.editMode = false;
              this.loadingSave = false;
              this.errorModal = this.ERROR_ACTUALIZAR;
              $(this.modalError.nativeElement).modal('show');
            }
          )
        }, (error) => {
          this.onEditMode();
          this.editMode = false;
          this.loadingSave = false;
          this.errorModal = this.ERROR_SUBIR_IMAGEN;
          $(this.modalError.nativeElement).modal('show');
        }
      )
    } else {
      if (Object.keys(submitValues).length == 0) {
        this.errorModal = this.NO_MODIFICADO;
        $(this.modalError.nativeElement).modal('show');
        this.loadingSave = false;
      } else {
        this.loadingSave = true;
        this.formDetail.disable();
        this._ps.updateParking(submitValues, this.parking.id).subscribe(
          (resolve) => {
            this.loadingSave = false;
            this.initialValues = {
              email: this.formDetail.get('email').value,
              name: this.formDetail.get('name').value,
              coordinates: this.formDetail.get('coordinates').value,
              address: this.formDetail.get('address').value,
              phone_number: this.formDetail.get('phone_number').value.toString(),
              id_employee: this.formDetail.get('id_employee').value ? this.formDetail.get('id_employee').value : null,
              status: this.formDetail.get('status').value,
              description: this.formDetail.get('description').value,
              capacity: this.formDetail.get('capacity').value
            };
            if (submitValues.coordinates) {
              this.marker = this.temp;
            }
            this.editMode = false;
          }, (error) => {
            this.onEditMode();
            this.editMode = false;
            this.loadingSave = false;
            this.errorModal = this.ERROR_ACTUALIZAR;
            $(this.modalError.nativeElement).modal('show');
          }
        )
      }
    }
    console.log(submitValues);
  }

  onEditMode() {
    this.editMode = true;
    this.formDetail.enable();
  }

  onCancelar() {
    this.editMode = false;
    this.setDefaultValues();
    this.formDetail.disable();
  }

  archivosSobreDropZone(e: boolean) {
    this.estaSobreDropZone = e;
  }

  archivosImagenes(event) {
    this.archivos = event;
    console.log(event);
  }

  deleteimage(i: number) {
    this.archivos.splice(i, 1);
    return this.archivos;
  }

}

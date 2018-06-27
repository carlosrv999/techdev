import { FileItem } from './file-item';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AgmMap } from '@agm/core';
import { ParkingService } from '../parking.service';

declare var $: any;

@Component({
  selector: 'app-parking-create',
  templateUrl: './parking-create.component.html',
  styleUrls: ['./parking-create.component.css']
})
export class ParkingCreateComponent implements OnInit {
  archivos: FileItem[] = [];
  estaSobreDropZone: boolean = false;
  @ViewChild('myModal') myModal: ElementRef;
  @ViewChild(AgmMap)
  public agmMap: AgmMap;
  lima = {
    lat: -12.060897,
    lng: -77.042889
  };
  error_campos_vacios = 'No ha llenado los campos correctamente';
  error_imagenes_multiples = 'Solo se puede subir una imagen';
  error_imagen_pesada = 'La imagen debe pesar menos de 100kb';
  mensaje = this.error_campos_vacios;
  error: boolean = false;
  marker: any;
  title: string = 'My first AGM project';
  lat: number = 51.678418;
  urlBaseImage = 'https://s3.amazonaws.com/sige-parking/parking-512.png';
  lng: number = 7.809007;
  formCreate: FormGroup;
  loading = false;
  company = JSON.parse(localStorage.getItem('user'));


  constructor(private _fb: FormBuilder, private router: Router, private _ps: ParkingService) { }

  ngOnInit() {
    let usernameOrEmailPattern = /^(?=[a-z0-9.]{3,25}$)[a-z0-9]+\.?[a-z0-9]+$|^.*@\w+\.[\w.]+$/i;
    this.formCreate = this._fb.group({
      'email': ['', [Validators.pattern(usernameOrEmailPattern)]],
      'password': ['', Validators.required],
      'coordinates': [null, Validators.required],
      'name': ['', Validators.required],
      'address': ['', Validators.required],
      'phone_number': [, Validators.required],
      'status': [true, Validators.required],
      'description': ['', Validators.required],
      'capacity': [null, Validators.required],
      'id_company': [this.company.id],
      'url_image': [this.urlBaseImage],
      'cost_hour': [null, Validators.required]
    })
  }

  handleMapClick(event: { coords: { lat: number, lng: number } }) {
    this.marker = {
      lat: event.coords.lat,
      lng: event.coords.lng
    }
    console.log(JSON.stringify(event.coords));
    let text = `POINT(${event.coords.lat} ${event.coords.lng})`;
    this.formCreate.get('coordinates').setValue(text);
  }



  onModalMap() {
    setTimeout(() => {
      this.agmMap.triggerResize();
    }, 300);
    console.log(this.formCreate.value);
  }

  onCancelar() {
    this.router.navigate(['/home/parkings']);
  }

  archivosSobreDropZone(e: boolean) {
    this.estaSobreDropZone = e;
  }

  archivosImagenes(event) {
    if(this.archivos.length > 1) {
      this.mensaje = this.error_imagenes_multiples;
      $(this.myModal.nativeElement).modal('show');
      return;
    }
    if(event[0].archivo.size > 102400 ) {
      this.mensaje = this.error_imagen_pesada;
      $(this.myModal.nativeElement).modal('show');
      return;
    }
    console.log('entro a archivos');
    this.archivos = event;
    console.log(this.archivos);
    console.log(event);
  }

  deleteimage(i: number) {
    this.archivos.splice(i, 1);
    return this.archivos;
  }

  onSubmit() {
    if (!this.formCreate.valid) {
      this.mensaje = this.error_campos_vacios;
      $(this.myModal.nativeElement).modal('show');
      console.log(this.formCreate.get('email').hasError('pattern'))
      return;
    }
    let files = [];
    this.archivos.forEach((obj) => {
      files.push(obj.archivo);
      console.log(obj.archivo);
    });
    if(files.length > 0) {
      this._ps.uploadFile(files).subscribe(
        (resolve) => {
          let response = JSON.parse(resolve.response);
          console.log(response.url_image);
          let objSubmit = this.formCreate.value;
          objSubmit.phone_number = (objSubmit.phone_number).toString();
          objSubmit.url_image = response.url_image;
          this.loading = true;
          this._ps.createParking(objSubmit).subscribe(
            (resolve) => {
              console.log(resolve);
              this.loading = false;
              this.router.navigate(['/home/parkings'], { queryParams: { exito: true } });
            }, (error) => {
              console.log(error);
              this.loading = false;
            }
          )
          console.log(objSubmit);
        }, (error) => {
          console.log(error);
        }
      )
    } else {
      let objSubmit = this.formCreate.value;
      objSubmit.phone_number = (objSubmit.phone_number).toString();
      this.loading = true;
      this._ps.createParking(objSubmit).subscribe(
        (resolve) => {
          console.log(resolve);
          this.loading = false;
          this.router.navigate(['/home/parkings'], { queryParams: { exito: true } });
        }, (error) => {
          console.log(error);
          this.loading = false;
        }
      )
      console.log(objSubmit);
    }
  }

}

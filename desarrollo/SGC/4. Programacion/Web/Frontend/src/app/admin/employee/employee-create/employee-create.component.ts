import { ParkingService } from './../../parking/parking.service';
import { EmployeeService } from './../employee.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.css']
})
export class EmployeeCreateComponent implements OnInit {
  @ViewChild('myModal') myModal: ElementRef;
  lima = {
    lat: -12.060897,
    lng: -77.042889
  };
  error: boolean = false;
  lng: number = 7.809007;
  parkingNames = [];
  formCreate: FormGroup;
  loading = false;
  company = JSON.parse(localStorage.getItem('user'));


  constructor(private _fb: FormBuilder, private router: Router, private _es: EmployeeService, private _ps: ParkingService) { }

  ngOnInit() {
    this._ps.getAllNamesByCompany(this.company.id).subscribe(
      (resolve) => {
        this.parkingNames = resolve;
        console.log(resolve);
      }, (error) => {
        console.log('ocurrio un error al pedir los nombres de las cocheras');
      }
    );
    let usernameOrEmailPattern = /^(?=[a-z0-9.]{3,25}$)[a-z0-9]+\.?[a-z0-9]+$|^.*@\w+\.[\w.]+$/i;
    this.formCreate = this._fb.group({
      'first_name': ['', Validators.required],
      'last_name': ['', Validators.required],
      'status': [true],
      'dni': [null, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      'phone_number': [null, Validators.required],
      'position': ['', Validators.required],
      'salary': [null, Validators.required],
      'id_company': [this.company.id],
      'id_parking': [null]
    })
  }



  onCancelar() {
    this.router.navigate(['/home/employees']);
  }

  onSubmit() {
    if (!this.formCreate.valid) {
      $(this.myModal.nativeElement).modal('show');
      return;
    }
    let submitValues = this.formCreate.value;
    submitValues.phone_number = submitValues.phone_number.toString();
    console.log(submitValues);
    this._es.postEmployee(submitValues).subscribe(
      resolve => {
        console.log(resolve);
        this.router.navigate(['/home/employees'], { queryParams: { exito: true } });
      }, error => {
        console.log(error);
      }
    )
  }

}

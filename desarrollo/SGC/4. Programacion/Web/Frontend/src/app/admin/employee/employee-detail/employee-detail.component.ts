import { ParkingService } from './../../parking/parking.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent implements OnInit {
  editMode = false;
  @Input() employee: any;
  @Input() index: number;
  formDetail: FormGroup;
  parkingNames: any;
  company = JSON.parse(localStorage.getItem('user'));


  constructor(private _fb: FormBuilder, private _ps: ParkingService) { }

  ngOnInit() {
    this._ps.getAllNamesByCompany(this.company.id).subscribe(
      (resolve) => {
        this.parkingNames = resolve;
        console.log(resolve);
      }, (error) => {
        console.log('error al pedir nombres de parkings');
      }
    )
    this.formDetail = this._fb.group({
      'first_name': [{value: this.employee.first_name, disabled: true}, Validators.required],
      'last_name': [{value: this.employee.last_name, disabled: true}, Validators.required],
      'dni': [{value: this.employee.dni, disabled: true}, [Validators.minLength(8), Validators.maxLength(8)]],
      'phone_number': [{value: this.employee.phone_number, disabled: true}, Validators.required],
      'position': [{value: this.employee.position, disabled: true}, Validators.required],
      'salary': [{value: this.employee.salary, disabled: true}, Validators.required],
      'id_parking': [{value: this.employee.id_parking, disabled: true}]
    });
  }

  onEditMode() {
    this.formDetail.enable();
    this.editMode = true;
  }

  onCancelar() {
    this.formDetail.disable();
    this.editMode = false;
  }

}

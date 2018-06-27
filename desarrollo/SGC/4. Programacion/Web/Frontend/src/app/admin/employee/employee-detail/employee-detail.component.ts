import { EmployeeService } from './../employee.service';
import { ParkingService } from './../../parking/parking.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent implements OnInit {
  @ViewChild('modalError') modalError: ElementRef;
  NO_MODIFICADO: string = 'No ha modificado los campos';
  ERROR_CAMPOS: string = 'Los campos no han sido llenados correctamente';
  errorModal: string = this.NO_MODIFICADO;
  loadingSave = false;
  editMode = false;
  @Input() employee: any;
  @Input() index: number;
  formDetail: FormGroup;
  parkingNames: any;
  company = JSON.parse(localStorage.getItem('user'));
  initialValues: any;


  constructor(private _fb: FormBuilder, private _ps: ParkingService, private _es: EmployeeService) { }

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
      'first_name': [{ value: this.employee.first_name, disabled: true }, Validators.required],
      'last_name': [{ value: this.employee.last_name, disabled: true }, Validators.required],
      'dni': [{ value: this.employee.dni, disabled: true }, [Validators.minLength(8), Validators.maxLength(8)]],
      'phone_number': [{ value: this.employee.phone_number, disabled: true }, Validators.required],
      'position': [{ value: this.employee.position, disabled: true }, Validators.required],
      'salary': [{ value: this.employee.salary, disabled: true }, Validators.required],
      'id_parking': [{ value: this.employee.id_parking, disabled: true }]
    });
    this.initialValues = this.formDetail.value;
  }

  onSubmit() {
    if (!this.formDetail.valid) {
      this.errorModal = this.ERROR_CAMPOS;
      $(this.modalError.nativeElement).modal('show');
      return;
    };
    let valuesSubmit = {};
    if (this.initialValues.first_name != this.formDetail.get('first_name').value) valuesSubmit['first_name'] = this.formDetail.get('first_name').value;
    if (this.initialValues.last_name != this.formDetail.get('last_name').value) valuesSubmit['last_name'] = this.formDetail.get('last_name').value;
    if (this.initialValues.dni != this.formDetail.get('dni').value) valuesSubmit['dni'] = this.formDetail.get('dni').value;
    if (this.initialValues.phone_number != this.formDetail.get('phone_number').value) valuesSubmit['phone_number'] = this.formDetail.get('phone_number').value.toString();
    if (this.initialValues.position != this.formDetail.get('position').value) valuesSubmit['position'] = this.formDetail.get('position').value;
    if (this.initialValues.salary != this.formDetail.get('salary').value) valuesSubmit['salary'] = this.formDetail.get('salary').value;
    if (this.initialValues.id_parking != this.formDetail.get('id_parking').value) valuesSubmit['id_parking'] = this.formDetail.get('id_parking').value;
    if (Object.keys(valuesSubmit).length == 0) {
      this.errorModal = this.NO_MODIFICADO;
      $(this.modalError.nativeElement).modal('show');
      return;      
    } else {
      this.loadingSave = true;
      this._es.updateEmployee(this.employee.id, valuesSubmit).subscribe(
        (resolve) => {
          this.loadingSave = false;
          this.employee = resolve;
          this.initialValues = this.formDetail.value;
          this.formDetail.disable();
          this.editMode = false;
        }, (error) => {
          this.loadingSave = false;
          this.errorModal = "error interno";
          $(this.modalError.nativeElement).modal('show');
        }
      )
    }
    console.log(valuesSubmit);
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

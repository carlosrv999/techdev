import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ParkingService } from '../../parking/parking.service';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit {
  success = false;
  errorSearch = false;
  errorMax = false;
  buscado = false;
  company: any;
  formSearch: FormGroup;
  listServices = [];
  listParkings = [];

  constructor(private _ps: ParkingService, private _fb: FormBuilder,
              private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    let obj: { exito: boolean } = <{ exito: boolean }>this.route.snapshot.queryParams;
    if (obj.exito) {
      this.success = true;
      setTimeout(() => {
        this.success = false;
      }, 5000);
    };
    this.company = JSON.parse(localStorage.getItem('user'));
    console.log(this.company.id);
    this._ps.getAllNamesByCompany(this.company.id).subscribe(
      (resolve) => {
        this.listParkings = resolve;
        console.log(this.listParkings);
      }, (error) => {
        console.log('error de conexion');
      }
    );
    this.formSearch = this._fb.group({
      'parking': [null, Validators.required]
    })
  }

  onSubmitSearch() {
    if(this.formSearch.get('parking').value) {
      console.log(this.formSearch.get('parking').value);
    }
    this.buscado = false;
    this._ps.getServices(this.formSearch.get('parking').value).subscribe(
      (resolve) => {
        this.buscado = true;
        this.listServices = resolve;
        console.log(resolve);
      }, (error) => {
        this.buscado = false;
        console.log(error);
      }
    )
  }

  onCreateService() {
    this._ps.id_parking = this.listServices[0].id_parking;
    if(this.listServices.length < 3) this.router.navigate(['/home/services/create']);
    else {
      this.errorMax = true;
      setTimeout(() => {
        this.errorMax = false;
      }, 5000);
    }
  }

}

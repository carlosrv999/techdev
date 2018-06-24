import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ParkingService } from '../parking.service';

@Component({
  selector: 'app-parking-list',
  templateUrl: './parking-list.component.html',
  styleUrls: ['./parking-list.component.css']
})
export class ParkingListComponent implements OnInit {
  searchType = false;
  errorSearch = false;
  enabledSearch = true;
  success = false;
  form: FormGroup;
  lista = [];
  id_company: any;

  falsoBackend = [{
    name: "Los Portales SJM"
  }, {
    name: "Los Portales Surco"
  }, {
    name: "Los Portales San Borja"
  }, {
    name: "Los Portales Villa Maria"
  },];

  loading = false;
  total = 0;
  page = 1;
  limit = 3;
  constructor(private _fb: FormBuilder, private router: Router, private route: ActivatedRoute, private _parkingService: ParkingService) { }

  onCreateParking() {
    this.router.navigate(['/home/parkings/create']);
    console.log('moc');
  }

  ngOnInit() {
    let obj: { exito: boolean } = <{ exito: boolean }>this.route.snapshot.queryParams;
    if (obj.exito) {
      this.success = true;
      setTimeout(() => {
        this.success = false;
      }, 5000);
    };

    this.form = this._fb.group({
      'busqueda': ['']
    });

    this.id_company = (JSON.parse(localStorage.getItem('user'))).id;
    this.setTotal();
  }

  setTotal() {
    this._parkingService.getCountParkings(this.id_company).subscribe(
      (count: number) => {
        this.total = count;
      }
    )
    this.getCocheras();
  }

  getCocheras() {
    this.loading = true;
    console.log(this.page - 1);
    this._parkingService.getParkings(this.id_company, this.limit, (this.page - 1) * this.limit).subscribe(
      (obj: any) => {
        //this.lista = obj;
        // this.lista = this.falsoBackend;
        // this.lista = this.falsoBackend.slice( this.limit * (this.page - 1) , this.limit * (this.page - 1) + this.limit);
        this.lista = obj;
        this.loading = false;
        console.log(obj);
      }, (error) => {
        this.errorSearch = true;
        setTimeout(()=> {
          this.errorSearch = false;
        }, 5000);
        console.log(error);
      }
    )
  }

  searchCocheras() {
    this.loading = true;
    this._parkingService.getParkingsSearch(this.id_company, this.limit, (this.page - 1) * this.limit, this.form.get('busqueda').value).subscribe(
      (obj: any) => {
        this.lista = obj;
        this.loading = false;
      }, (error) => {
        this.errorSearch = true;
        setTimeout(()=> {
          this.errorSearch = false;
        }, 5000);
      }
    )
  }

  onSubmit() {
    this.enabledSearch = false;
    setTimeout(()=> {
      this.enabledSearch = true;
    }, 2000);
    if(this.form.get('busqueda').value == '') {
      this.searchType = false;
      this.setTotal();
      this.goToPage(1);
      return;
    }
    this.searchType = true;
    this._parkingService.getCountParkingsSearch(this.id_company, this.form.get('busqueda').value).subscribe(
      (count: number) => {
        this.total = count;
        console.log(count);
        this.searchCocheras();
        this.goToPage(1);
      }, (error) => {
        this.errorSearch = true;
        setTimeout(()=> {
          this.errorSearch = false;
        }, 5000);
        console.log(error);
      }
    )
  }

  goToPage(n: number): void {
    this.page = n;
    this.searchType ? this.searchCocheras() : this.getCocheras();
  }

  onNext(): void {
    this.page++;
    this.searchType ? this.searchCocheras() : this.getCocheras();
  }

  onPrev(): void {
    this.page--;
    this.searchType ? this.searchCocheras() : this.getCocheras();
  }

}

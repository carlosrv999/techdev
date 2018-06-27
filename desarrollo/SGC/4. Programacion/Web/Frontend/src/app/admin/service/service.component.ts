import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ParkingService } from './../parking/parking.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

import { Response } from '@angular/http';
import { Cochera } from './../models/cochera.model';
import { CocheraService } from './../servicios/cochera.service';
import { AuthService } from './../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading: boolean = false;
  loginError: boolean = false;
  loginForm: FormGroup;
  submitted: boolean = false;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private cocheraService: CocheraService) { }

  onDeleteNotif() {
    this.loginError = false;
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      'username': [null, Validators.required],
      'password': [null, Validators.required]
    });
  }

  onSubmit() {
    if(this.loginForm.valid){
      this.loading = true;
      this.loginError = false;
      this.submitted = true;
      this.auth.loginUser(this.loginForm.get('username').value, this.loginForm.get('password').value)
        .subscribe(
          (response) => {
            let obj = <{id: string, ttl: number, created: string, userId: string}>response.json();
            this.cocheraService.getCochera(obj.userId).subscribe(
              (response: Response) => {
                let cochera = <Cochera>response.json();
                this.auth.setCochera(cochera);
                localStorage.setItem(obj.id, JSON.stringify(cochera));
                console.log(JSON.stringify(cochera));
                this.router.navigate(['/cupos']);
                this.loading = false;
              }, (error) => {
                console.log(error);
              }
            );
          }, (error) => {
            this.loginError = true;
            this.loading = false;
            console.log(error);
          }
        );
    } else {
      this.loading = false;
      this.loginError = false;
      this.submitted = true;
    }
  }
}

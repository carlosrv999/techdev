import { Component, OnInit, Input, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('myModal') myModal: ElementRef;
  mensaje = 'Credenciales incorrectas';
  error = false;
  success = false;
  loading = false;
  formLogin: FormGroup;

  constructor(private _fb: FormBuilder,
              private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    let obj: { exito: boolean } = <{ exito: boolean }>this.route.snapshot.queryParams;
    if (obj.exito) this.success = true;
    this.formLogin = this._fb.group({
      'email': ['', Validators.email],
      'password': ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.formLogin.get('email').hasError('email')) {
      return;
    }
    if (this.formLogin.get('email').hasError('required')) {
      return;
    }
    if (this.formLogin.get('password').hasError('required')) {
      return;
    }
    this.loading = true;
    this.auth.loginUser(this.formLogin.get('email').value, this.formLogin.get('password').value)
      .subscribe((response: any) => {
        this.loading = false;
        this.router.navigate(['/home/parkings'])
      }, (error) => {
        $(this.myModal.nativeElement).modal('show');
        this.loading = false;
        this.error = true;
      })
  }

}

import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../auth.component.css']
})
export class SignupComponent implements OnInit {
  existe = false;
  loading = false;
  formSignup: FormGroup;

  constructor(private _fb: FormBuilder, private _sign: AuthService, private router: Router) { }

  ngOnInit() {
    let regexp = new RegExp('^\d+$');
    this.formSignup = this._fb.group({
      'email': ['', Validators.email],
      'password': ['', [Validators.required, Validators.minLength(8)]],
      'password2': ['', [Validators.required]],
      'name': ['', Validators.required],
      'phone_number': [null, [Validators.required]],
      'address': ['', Validators.required]
    }, {validator: this.matchPassword});
  }

  onSubmit() {
    console.log(this.formSignup.get('password').errors)
    console.log(this.formSignup.get('email').hasError('email'))
    if(!this.formSignup.valid){
      console.log('no valido');
      return;
    }
    this.loading = true;
    let objSubmit = this.formSignup.value;
    delete objSubmit.password2;
    this._sign.signupUser(objSubmit).subscribe(
      (resolve) => {
        this.loading = false;
        this.router.navigate(['/auth/login'], {queryParams: {exito: true}})
      }, (error) => {
        this.loading = false;
        this.existe = true;
        setTimeout(() => {
          this.existe = false;
        }, 5000);
        console.log('ocurrio un error en el servidor, el email ya existe');
      }
    );
    console.log(this.formSignup.value);
  }

  matchPassword(AC: AbstractControl) {
    let password = AC.get('password').value; // to get value in input tag
    let confirmPassword = AC.get('password2').value; // to get value in input tag
    if (password != confirmPassword) {
      AC.get('password2').setErrors({ MatchPassword: true })
    } else {
      return null;
    }
  }

}

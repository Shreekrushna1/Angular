import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private fb: FormBuilder, private router: Router) { }

  loginForm = this.fb.group({
    username: new FormControl('', [Validators.required, Validators.minLength(5)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  })

  loginUser() {
    if (!this.loginForm.valid) {
      return;
    }
    const users = JSON.parse(localStorage.getItem("Users") || "[]");
    const loginValidator = users.find((response: any) => {
      return ((response.username === this.loginForm.value.username) && (response.password === this.loginForm.value.password) && (response.role));
    })
    if (!loginValidator) {
      Swal.fire({
        icon: 'error',
        title: 'Username or Password is not valid',
        confirmButtonText: 'ok',
      })
    }

    if (loginValidator) {
      if (loginValidator.role === 'admin') {
        Swal.fire({
          icon: 'success',
          title: 'Admin Login Successful',
          confirmButtonText: 'ok',
        }).then(() => {
          const loginValidatorIndex = users.findIndex((response: any) => {
            return ((response.username === this.loginForm.value.username) && (response.password === this.loginForm.value.password) && (response.role));
          })
          loginValidator.action = true;
          users[loginValidatorIndex].action = true;
          localStorage.setItem('Users', JSON.stringify(users));
          this.router.navigateByUrl(`admin/${loginValidator.username}`);
        })
      }
      else {
        Swal.fire({
          icon: 'success',
          title: 'User Login Successful',
          confirmButtonText: 'ok',
        }).then(() => {
          loginValidator.action = true;
          users[loginValidator.username] = loginValidator;
          localStorage.setItem('Users', JSON.stringify(users));
          this.router.navigateByUrl(`user/${loginValidator.username}`)
        })
      }
      localStorage.setItem('Users', JSON.stringify(users));
    }

  }
}

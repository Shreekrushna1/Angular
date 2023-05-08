import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toArray } from 'rxjs';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
  }

  registration = this.fb.group({
    username: new FormControl('', [Validators.required, Validators.minLength(5)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    password2: new FormControl('', [Validators.required, Validators.minLength(8)]),
    role: new FormControl('', Validators.required),
    action: false
  }, {
    validator: this.ConfirmedValidator('password', 'password2')
  })

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {

      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['confirmedValidator']) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  submitForm() {
    if (this.registration.value.password == this.registration.value.password2) {
      if (this.registration.valid) {
        Swal.fire({
          icon: 'success',
          title: 'Your Registration is Success',
          text: "Now You're Redirecting to Dashboard Page ",
          showConfirmButton: false,
          timer: 2000
        })
        const users: string[] = JSON.parse(localStorage.getItem("Users") || "[]");
        users.push(this.registration.value);
        if (this.registration.value.role == 'admin') {
          this.router.navigateByUrl(`admin/${this.registration.value.username}`);
          this.registration.value.action = true
          localStorage.setItem("Users", JSON.stringify(users));
        }
        else {
          this.router.navigateByUrl(`user/${this.registration.value.username}`);
          this.registration.value.action = true
          localStorage.setItem("Users", JSON.stringify(users));
        }
      } else {
        Object.values(this.registration.controls).forEach(control => {
          control.markAsTouched();
        });
      }
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Please Enter Same Password in Password and confirm Password',
        showConfirmButton: false,
      })
    }
  }
  ngOnInit() {

  }
}

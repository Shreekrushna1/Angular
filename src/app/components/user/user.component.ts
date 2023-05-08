import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { findIndex } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  selectedValue: string = '';
  constructor(private route: ActivatedRoute, private router: Router, private location: Location) { }

  books = JSON.parse(localStorage.getItem("Books") || "[]");
  bookNames = this.books.map((res: any) => {
    return res.bookName;
  })
  username = this.route.snapshot.paramMap.get('username');
  logout() {
    const users = JSON.parse(localStorage.getItem("Users") || "[]");
    let currentUser = users.find((res: any) => {
      return res.username == this.username;
    })
    if (currentUser) {
      if (currentUser.action) {
        currentUser.action = false;
        localStorage.setItem("Users", JSON.stringify(users))
      }
      this.router.navigateByUrl('');
    }

  }
  ngOnInit() {
    window.addEventListener('popstate', () => {
      this.location.forward();
    });
  }
  buyBook(): void {
    if (!this.selectedValue) {
      Swal.fire({
        icon: 'error',
        title: 'You have not selected any book',
        showConfirmButton: true,
        confirmButtonText: 'Done'
      })
    }

    Swal.fire({
      icon: 'warning',
      title: 'Are you sure you want to purchase this book?',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes, Im sure!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed){
        const selectedBook = this.books.find((book: { bookName: string; }) => book.bookName === this.selectedValue);
        const currentUser = this.username;
        if (selectedBook && selectedBook.users  instanceof Array) {
          if (selectedBook.users.includes(currentUser)) {
            selectedBook.users.push(currentUser);
            localStorage.setItem('Books', JSON.stringify(this.books));
            Swal.fire({
              icon: 'success',
              title: 'You purchased this book again',
              showConfirmButton: true,
              confirmButtonText: 'Ok'
            })
          } else {
            selectedBook.users.push(currentUser);
            localStorage.setItem('Books', JSON.stringify(this.books));
            Swal.fire({
              icon: 'success',
              title: 'Your book was purchased successfully',
              showConfirmButton: true,
              confirmButtonText: 'Thanks!'
            });
          }
        }
        else {
          Swal.fire({
            icon: 'error',
            title: 'Selected book is not found',
            showConfirmButton: true,
            confirmButtonText: 'Ok'
          })
        }
      }
    })
  }

}
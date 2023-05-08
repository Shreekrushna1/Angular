import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-book-dialog',
  templateUrl: './create-book-dialog.component.html',
  styleUrls: ['./create-book-dialog.component.css']

})
export class CreateBookDialogComponent {

  ngOnInit(){
    
  }

  constructor(private fb: FormBuilder, private dialog: MatDialog) { }

  booksForm = this.fb.group({
    bookName: new FormControl('', [Validators.required, Validators.minLength(5)]),
    authorName: new FormControl('', [Validators.required, Validators.minLength(5)]),
    bookDescription: new FormControl('', [Validators.required, Validators.minLength(5)]),
    bookPrice: new FormControl('', [Validators.required, Validators.minLength(1), this.priceValidator]),
    users:this.fb.array([]),
  });

  priceValidator(control: AbstractControl) {
    const price = control.value;
    if (price < 0) {
      return { 'negativePrice': true };
    }
    return null;
  }
  createBook() {
    if (!this.booksForm.valid) {
      return;
    }
    Swal.fire({
      icon: 'success',
      title: 'Your Book Details Are Added Successfully',
      text: "Now You're Redirecting to Home Page ",
      showConfirmButton: true,
      confirmButtonText:'Done'
    });
    const books = JSON.parse(localStorage.getItem("Books") || "[]");
    books.push(this.booksForm.value);
    localStorage.setItem("Books", JSON.stringify(books));
    this.closeBookDialog();
  }
  closeBookDialog() {
    this.dialog.closeAll();
  }
}
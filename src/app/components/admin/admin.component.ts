import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CreateBookDialogComponent } from '../create-book-dialog/create-book-dialog.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  constructor(private route: ActivatedRoute, private router: Router, private location: Location, private dialog: MatDialog) { }


  users = JSON.parse(localStorage.getItem("Users") || "[]");
  allUsers = this.users.filter((res: any) => {
    return res.role == 'user';
  })

  books = JSON.parse(localStorage.getItem("Books") || "[]");
  allBooks = this.books.map((res: any) => {
    return res;
  });

  getBookBuyers(book: any): string {
    let buyersString = '';
    interface UsernameCounts {
      [key: string]: number;
    }
    const usernameCounts: UsernameCounts = {};
    for (let i = 0; i < book.users.length; i++) {
      const username = book.users[i];
      if (!usernameCounts[username]) {
        usernameCounts[username] = 0;
      }
      usernameCounts[username]++;
    }

    for (const [username, count] of Object.entries(usernameCounts)) {
      const matchingUser = this.allUsers.find((user: any) => user.username === username);
      if (matchingUser) {
        buyersString += `${matchingUser.username}(${count}) `;
      }
    }
    return buyersString;
  }


  logout() {
    const users = JSON.parse(localStorage.getItem("Users") || "[]");
    const username = this.route.snapshot.paramMap.get('username');
    let currentUser = users.find((res: any) => {
      return res.username == username;
    })
    if (currentUser) {
      if (currentUser.action) {
        currentUser.action = false;
        localStorage.setItem("Users", JSON.stringify(users))
      }
      this.router.navigateByUrl('');
    }
  }
  createBookDialog() {
    const dialofRef = this.dialog.open(CreateBookDialogComponent, {
      height: '600px',
      width: '400px',
    });
    dialofRef.afterClosed().subscribe(result => {
      if (result) {
        this.allBooks.push(result);
      }
      this.reloadBooks();
    });
  }
  reloadBooks() {
    this.allBooks = JSON.parse(localStorage.getItem("Books") || "[]");
  }
  ngOnInit() {
    window.addEventListener('popstate', () => {
      this.location.forward();
    });
  }
}
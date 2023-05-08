import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router,private route:ActivatedRoute) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const username = route.paramMap.get('username');
    const users = JSON.parse(localStorage.getItem('Users') || '[]');
    const user = users.find((u:any) => u.username === username);
    if (user && user.action === true) {
      return true;
    } else {
      this.router.navigateByUrl('');
      return false;
    }
  } 

  
}

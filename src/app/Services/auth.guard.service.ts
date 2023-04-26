import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  
  constructor(
    public authService: LoginService,
    public router: Router
  ) { }
 /* canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let isLoggedIn = this.authService.isLogged();
      if (isLoggedIn){
        return true;
      } else {
        this.router.navigate(['/']);
      }
  }*/
 canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (/*this.authService.IsLoggedIn === null*/ /*this.authService.logged===false*/ !this.authService.isLoggedIn()) {

      console.log("Access not allowed!");
      this.router.navigate(['/login'])
    }
    return true;
  }
  /*canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (sessionStorage.getItem('token') === null) {
      this.router.navigate(['/']);
      return false;
    }
    else {
      return true;
    }
  }*/
}

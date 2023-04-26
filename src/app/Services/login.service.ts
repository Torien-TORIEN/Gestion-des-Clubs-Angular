import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import {catchError , map} from 'rxjs/operators';
import {Observable,throwError ,Subject,BehaviorSubject } from 'rxjs'
import { Router } from '@angular/router';

import { User } from 'app/Models/user';
//import { Salle } from '../Models/salle'


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl="http://localhost:8081/SpringMVC/servlet/users"
  headers = new HttpHeaders().set('Content-Type','application/json');

  public currentUserSubject:BehaviorSubject<User>;
  public currentUser:Observable<User>;
  public loggedUser!: any;
  public emailloggedUser!: any;
  public RoleUser!: any;
  public idUser!: any;
  public currentuser: any;
  public logged:boolean=false;

  constructor(private httpClient:HttpClient,private router:Router) { 
    this.currentUserSubject=new BehaviorSubject<User>(JSON.parse(JSON.stringify(localStorage.getItem('currentUser')!)));
    this.currentUser=this.currentUserSubject.asObservable();
  }

   //GET USER
   signIn(cin:string,pwd:string){
    return this.httpClient.get<User>(`${this.baseUrl}/login/${cin}/${pwd}`)
    .pipe(map(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      console.log(user);
      this.loggedUser=user.firstname;
      this.emailloggedUser=user.email;
      //this.RoleUser=user.msg.role;
      this.idUser=user.cin;
      return user;
    }));
  }


  public get currentUserValue():User{
    return this.currentUserSubject.value;
  }
  getToken() {
    //return !!localStorage.getItem('access_token');
    return this.currentuser = JSON.parse(localStorage.getItem('currentUser')!);

  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  

 /*get  isLoggedIn(): boolean {
    let authToken = localStorage.getItem('token');
    return (authToken !== null) ? true : false;
  }*/

  IsLoggedIn():string{
    return JSON.parse(localStorage.getItem(this.loggedUser)!);
  }
/*
  isLogged():boolean{
    let token = localStorage.getItem("token");
    if (token){
      return true;
    } else {
      return false;
    }
  }*/

  doLogout() {
    let removeToken = localStorage.removeItem('currentUser');
    if (removeToken == null) {
      this.router.navigate(['/login']);
    }
  }
  
  //Auth Guard
  Authentifie(){
    this.logged= true;
  }

}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import {catchError , map} from 'rxjs/operators';
import {Observable,throwError ,Subject } from 'rxjs'
import { Salle } from '../Models/salle'
import { Club } from 'app/Models/club';
import { User } from 'app/Models/user';
import { Member } from 'app/Models/member';

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  private baseUrl="http://localhost:8081/SpringMVC/servlet/clubs"
  headers = new HttpHeaders().set('Content-Type','application/json');
  constructor(private httpClient:HttpClient) { }

  //GET CLUBS
  getClubList():Observable<Club[]>{
    return this.httpClient.get<Club[]>(`${this.baseUrl}`);
  }
  //GET CLUB 
  getClubById(id:any):Observable<Club>{
    return this.httpClient.get<Club>(`${this.baseUrl}`+'/'+id);
  }

  getPresident(id:any):Observable<Member>{
    return this.httpClient.get<Member>(`${this.baseUrl}`+'/president/'+id);
  }

  //ADD CLUB
  addClub(data: Club):Observable<any>{
    return this.httpClient.post(this.baseUrl,data);
  }

  //EDIT CLUB
  editClub(id : any,data : any):Observable<any>{
    let url=`${this.baseUrl}`+'/'+id;
    return this.httpClient.put(url ,data, {headers:this.headers}).pipe(catchError(this.errorMgmt))
  }

  //DELETE CLUB
  deleteClub( id : string) {
    let endPoints = id
    console.log("ID CLUD :"+id)
    console.log("DELETE CLUB "+`${this.baseUrl}`+'/'+ endPoints)
    this.httpClient.delete(`${this.baseUrl}`+'/'+ endPoints).subscribe(data => {
     console.log(data);
    });
  }


  //error handling
  errorMgmt(error: HttpErrorResponse){
    let errorMessage='';
    if (error.error instanceof ErrorEvent){
      errorMessage =error.error.message;
    } else {
      errorMessage='Error code :${error.status} \n Message:${error.message}';
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
  private _listeners = new Subject<any>();
  listen():Observable<any>{
    return this._listeners.asObservable();
  }
  filter(filterBy:string){
    this._listeners.next(filterBy);
  }

}

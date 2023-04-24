import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import {catchError , map} from 'rxjs/operators';
import {Observable,throwError ,Subject } from 'rxjs'
import { Salle } from 'app/Models/salle';
//import { Salle } from '../Models/salle'

@Injectable({
  providedIn: 'root'
})
export class SalleService {
  private baseUrl="http://localhost:8081/SpringMVC/servlet/salles"
  headers = new HttpHeaders().set('Content-Type','application/json');
  constructor(private httpClient:HttpClient) { }

  //GET SALLES
  getSalleList():Observable<Salle[]>{
    return this.httpClient.get<Salle[]>(`${this.baseUrl}`);
  }

  //GET SALLE
  getSalleById(id:number):Observable<Salle>{
    return this.httpClient.get<Salle>(`${this.baseUrl}`+'/'+id);
  }

  //ADD SALLE
  addSalle(data: Salle):Observable<any>{
    return this.httpClient.post(this.baseUrl,data);
  }

  //EDIT SALLE
  editSalle(id : any,data : any):Observable<any>{
    let url=`${this.baseUrl}`+'/'+id;
    return this.httpClient.put(url ,data, {headers:this.headers}).pipe(catchError(this.errorMgmt))
  }

  //DELETE SALLE
  deleteSalle( id : any) {
    let endPoints = id
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

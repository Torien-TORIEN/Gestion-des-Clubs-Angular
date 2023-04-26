import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import {catchError , map} from 'rxjs/operators';
import {Observable,throwError ,Subject } from 'rxjs'
import{ Material } from 'app/Models/material'
@Injectable({
  providedIn: 'root'
})
export class MaterielService {
  private baseUrl="http://localhost:8081/SpringMVC/servlet/materials"
  headers = new HttpHeaders().set('Content-Type','application/json');
  constructor(private httpClient:HttpClient) { }
  
  
  getMaterialList():Observable<Material[]>{
    return this.httpClient.get<Material[]>(`${this.baseUrl}`);
  }

  getMaterialById(id:number):Observable<Material>{
    return this.httpClient.get<Material>(`${this.baseUrl}`+'/'+id);
  }
  addMaterial(data: Material):Observable<Material>{
    return this.httpClient.post<Material>(this.baseUrl,data);
  }
  editMateriel(id : any,data : any):Observable<any>{
    let url=`${this.baseUrl}`+'/'+id;
    return this.httpClient.put(url ,data, {headers:this.headers}).pipe(catchError(this.errorMgmt))
  }
  deleteMateriel( id : any) {
    let endPoints = id
    this.httpClient.delete(`${this.baseUrl}`+'/'+ endPoints).subscribe(data => {
     console.log(data);
    });
  }
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
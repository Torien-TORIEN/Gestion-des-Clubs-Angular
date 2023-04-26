import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import {catchError , map} from 'rxjs/operators';
import {Observable,throwError ,Subject } from 'rxjs'
import { Salle } from '../Models/salle'
import { Event } from 'app/Models/event';
import { Club } from 'app/Models/club';
import { Material } from 'app/Models/material';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseUrl="http://localhost:8081/SpringMVC/servlet/events"
  private materielUrl="http://localhost:8081/SpringMVC/servlet/materials"
  headers = new HttpHeaders().set('Content-Type','application/json');
  constructor(private httpClient:HttpClient) { }

   //GET Events
  getEventList():Observable<Event[]>{
    return this.httpClient.get<Event[]>(`${this.baseUrl}`);
  }
  getMaterialList():Observable<Material[]>{
    return this.httpClient.get<Material[]>(`${this.materielUrl}`);
  }

  //GET CLUBS BY EVENT
  getClubsByEvent(id :string){
    return this.httpClient.get<Club[]>(`${this.baseUrl}`+'/clubs/'+id);
  }
  
  //ADD EVENT TO CLUB
  addEventToClub(idEv:string,idclub:string):Observable<Event>{
    return this.httpClient.post<Event>(`${this.baseUrl}/clubs/add/${idEv}/${idclub}`,null);
  }

  //DELETE MATERIAL TO CLUB
  deleteMaterialEvent(idEv:string,idmat:string){
    this.httpClient.delete<any>(`${this.baseUrl}/material/delete/${idEv}/${idmat}`).subscribe(
      data=>console.log(data)
    )
  }
  
  //ADD EVENT TO CLUB
  addMaterialToEvent(idEv:string,idmat:string):Observable<Event>{
    return this.httpClient.post<Event>(`${this.baseUrl}/material/add/${idEv}/${idmat}`,null);
  }

  //ACCEPTER UN EVENEMENT
  accepterEvent(id :string){
    return this.httpClient.post<Event>(`${this.baseUrl}`+'/accepter/'+id,null);
  }

  //ADD EVENT
  addEvent(data: Event):Observable<any>{
    return this.httpClient.post(this.baseUrl,data);
  }

  //EDIT EVENT
  editEvent(id : any,data : any):Observable<any>{
    let url=`${this.baseUrl}`+'/'+id;
    return this.httpClient.put(url ,data, {headers:this.headers}).pipe(catchError(this.errorMgmt))
  }

  //DELETE EVENT
  deleteEvent( id : string) {
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

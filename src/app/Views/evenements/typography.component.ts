import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators , FormGroup } from '@angular/forms';
import { Observable, ObservableInput } from 'rxjs'
import { Event } from "../../Models/event";
import { SalleService } from '../../Services/salle.service';
import Swal from 'sweetalert2';
import { EventService } from 'app/Services/event.service';
import { Club } from 'app/Models/club';
import { Salle } from 'app/Models/salle';
import { ClubService } from 'app/Services/club.service';
import { Material } from 'app/Models/material';
import { MaterielService } from 'app/Services/materiel.service';

@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.css']
})
export class TypographyComponent implements OnInit {
  eventForm : FormGroup ;
  events!:Event[];
  salles!:Salle[];
  salleToAdd:Salle=null;
  selectedSalle: Salle;
  Clubs!:Club[];
  idEvent!:string;
  demandes!:Event[];
  eventsAccepted!:Event[];
  showUpdateButton=false;
  boutonDemande=false;
  materiels!:Material[];
  clubs: {[key: string]: Club[]} = {};
  event:Event={"id":"Recep","title":"Reception des nouveaux membres ","status":"Oui","date":new Date("2023-04-07"),"description":"description","destination":"All","duration":24,"salle":null,"location":"Annexe","materiels":[]};

  constructor(private formBuilder:FormBuilder,private materialService:MaterielService ,private eventService:EventService,private salleService:SalleService,private clubService:ClubService) { 
    this.eventForm= this.formBuilder.group(
      { 
        title: ['', Validators.required],
        location: ['', Validators.required],
        clubs:[null, Validators.required],
        date:[Validators.required],
        duration:[Validators.required],
        salle:[null],
        description: ['', Validators.required],
        materiel:['']
      }, );
  }

  ngOnInit() {
    this.getEvents();
    this.getSalles();
    this.getClubs();
    this.getMateriels();
    this.event=this.events[0];//Initialiser event avec n'importe quel évènement
  }
  
  private getEvents(){
    this.eventService.getEventList().subscribe(data=>{
      console.log(data)
      this.events=data;
      this.demandes=this.events.filter(event => event.status === 'Non')
      this.eventsAccepted=this.events.filter(event => event.status === 'Oui')

      for (let event of this.events) {
        this.getClubByEvent(event.id).subscribe((clubs: Club[]) => {
          console.log("Clubs pour "+event.id+" ="+clubs)
          this.clubs[event.id] = clubs;
        });
      } 

    })
  }

  private getSalles(){
    this.salleService.getSalleList().subscribe(data=>{
      console.log(data)
      this.salles=data;
    })
  }

  private getClubs(){
    this.clubService.getClubList().subscribe(data=>{
      console.log(data)
      this.Clubs=data;
    })
  }

  private getMateriels(){
    this.eventService.getMaterialList().subscribe(
      (materiels:Material[])=>{
        console.log(" Materiels :"+materiels);
        this.materiels=materiels;
      },
      (error)=>{
        console.log("erreur de recuperation de matériels "+error)
      }
    )
  }

  deleteEvent(id:string){
    Swal.fire({
      title: 'êtes-vous sûr?',
      text: 'Vous ne pourrez pas revenir en arrière ! ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-le ! ',
      timer: 30000,
    }).then((result : any) => {
      if (result.value) {
        this.eventService.deleteEvent(id);
        this.getEvents();
        console.log("ID DE EVENT A SUPRIMER EST "+id);
        Swal.fire(
          'Supprimé!',
          'Evènement a été supprimé.',
          'success'
        );
        this.getEvents();
      }
      this.getEvents();
    }).catch(() => {
      Swal.fire('Échoué!', 'Il y avait quelque chose qui n\'allait pas.');
    });
  }
  
  addMaterielToEvent(){
    console.log("idEv="+this.event.id+" idmat= "+this.eventForm.value.materiel)
    if(this.eventForm.value.materiel==""){
      console.log("No materiel selectionné !")
      Swal.fire({
        icon: 'error',
        title: 'AUCUN MATERIEL SELECTIONNE !.',
        text: 'Selectionner un matériel !',
      })
    }else{
      this.eventService.addMaterialToEvent(this.event.id,this.eventForm.value.materiel).subscribe(
        (res:Event)=>{
          this.getEvents();
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
          
          Toast.fire({
            icon: 'success',
            title: 'un Matériel est affcté avec succès '
          })
        },
        (err)=>{
          console.log("Erreur d'ajout de materiel "+err)
          Swal.fire({
            icon: 'error',
            title: 'ERREUR !.',
            text: 'Il y a un problème !',
          })
        })
    }
  }


  addEvent(){
    if(this.eventForm.invalid){
      console.log('Event invalide ')
      console.log(this.eventForm.value)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Formulaire invalide Essayez encore!',
      })
      return ;
    }else{
      const eventFormValues = this.eventForm.value;
      const id =eventFormValues.title.replace(/\s+/g, '_').toLowerCase();
      if(eventFormValues.salle!=null){
        this.salleService.getSalleById(eventFormValues.salle).subscribe(
          (salle: Salle) => {
            this.salleToAdd = salle;
            this.ajouterEvent(eventFormValues,this.salleToAdd,id);
          },
          (error) => {
            console.log("Erreur lors de la récupération de la salle:", error);
            Swal.fire({
              icon: 'error',
              title: 'ERREUR !.',
              text: 'Il y a un problème liée à la  salle !',
            })
          }
        );
      }else{
        console.log("Salle null :"+this.salleToAdd);
        this.ajouterEvent(eventFormValues,null,id);
      }
    }
  }
  
  ajouterEvent(eventFormValues:any,salle:Salle,id:string){
    this.event=new Event(id,eventFormValues.title,"Non",eventFormValues.date,eventFormValues.description,"All",eventFormValues.location,eventFormValues.duration,salle,null);
      if(salle!=null){
        this.event.location=this.event.salle.location
      }
      console.log("Salle "+this.event.salle)
      console.log("Event location :"+this.event.location)
      this.eventService.addEvent(this.event).subscribe(
        (res)=>{
          this.eventService.addEventToClub(id,eventFormValues.clubs).subscribe(
            (event:Event)=>{
              this.getEvents();
              Toast.fire({
                icon: 'success',
                title: 'Club affecté avec succès.Modifier le '
              })
            },
            (error)=>{
              console.log("Erreur d'ajout de club :"+error)
            }
          )
          console.log('Salle successfully created')
          const Toast = Swal.mixin({
           toast: true,
           position: 'top-end',
           showConfirmButton: false,
           timer: 3000,
           timerProgressBar: true,
           didOpen: (toast) => {
             toast.addEventListener('mouseenter', Swal.stopTimer)
             toast.addEventListener('mouseleave', Swal.resumeTimer)
           }
         })
         
         Toast.fire({
           icon: 'success',
           title: 'Evènement ajoutée avec succès.Modifier le '
         })
          this.eventForm.reset();
          this.getEvents();
        },(error)=>{
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'ERREUR !.',
            text: 'Il y a une erreur !',
          })
        }
      );
  }

  refuserDemande(id:string){
    Swal.fire({
      title: 'êtes-vous sûr?',
      text: 'Le Refus de cette demande entraine sa suppression ! ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-la ! ',
      timer: 30000,
    }).then((result : any) => {
      if (result.value) {
        this.eventService.deleteEvent(id);
        this.getEvents();
        console.log("ID DE EVENT A REFUSER EST "+id);
        Swal.fire(
          'Supprimé!',
          "La demande a été supprimée .",
          'success'
        );
        this.getEvents();
      }
      this.getEvents();
    }).catch(() => {
      Swal.fire('Échoué!', 'Il y avait quelque chose qui n\'allait pas.');
    });
  }
  
  getClubByEvent(idEv:string):Observable<Club[]>{
    return this.eventService.getClubsByEvent(idEv);
  }

  accepterDemande(id:string){
    Swal.fire({
      title: 'êtes-vous sûr?',
      text: 'Impossible de refuser la demande accèptée ! ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, accèpte-la ! ',
      timer: 30000,
    }).then((result : any) => {
      if (result.value) {
        this.eventService.accepterEvent(id).subscribe( (event:Event)=>{
          this.getEvents();
          Swal.fire(
            'Supprimé!',
            "La demande a été accèptée !.",
            'success'
          );
        });
        //this.getEvents();
      }
      //this.getEvents();
    }).catch(() => {
      Swal.fire('Échoué!', 'Il y avait quelque chose qui n\'allait pas.');
    });
  }

  showUpdateModal(event:Event){
    this.showUpdateButton=true;
    this.idEvent=event.id;
    this.event=event;
    console.log("ID EVENT : "+this.idEvent)
    console.log("Event à modifier est "+event.salle);
    this.eventForm.patchValue({
      title:event.title,
      duration:event.duration,
      date:event.date,
      description:event.description,
      location:event.location
      
    });
    if(event.salle!=null){
      this.eventForm.patchValue({salle:event.salle.id})
    }
  }

  updateEvent(){
    
  }
  
  addMateriel(){

  }

  afficherMateriel(event:Event){
    if(event.materiels==null)
      return null;
    if(event.materiels.length==0)
      return false;
    return true;
  }

  showDetailModal(event:Event,demande:boolean){
    this.boutonDemande=demande;
    this.event=event;
    console.log(event)
  }



  

  isAdmin(){
    return true;
  }
  isRespo(){
    return true;
  }
  resetModal(){
    this.showUpdateButton=false;
    this.eventForm.reset();
  }
}

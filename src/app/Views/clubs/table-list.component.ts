import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators , FormGroup } from '@angular/forms';
import { Club } from 'app/Models/club';
import { Member } from 'app/Models/member';
import { ClubService } from 'app/Services/club.service';
import { Observable } from 'rxjs'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {

  clubs!:Club[]
  president!:Member;
  idClub!:string;
  club!:Club;
  showUpdateButton=false;
  presidents: {[key: string]: Member} = {};
  ClubForm : FormGroup ;
  Domaines:string[]=[ "Informatique","Musique","Robotique" , "Sport", "Scientifique", "Social", "Autre" ]
  
  
  constructor(private clubService:ClubService, private formBuilder: FormBuilder) {  
    this.ClubForm= this.formBuilder.group(
      { 
        logo: [null],
        name: ['', Validators.required],
        domaine: ['Informatique', Validators.required],
        createdAt: [Validators.required],
        description: ['', Validators.required],
    }, );
  }

  ngOnInit() {
    //this.clubs=[{"id":"IEEE","logo":"logo_ieee","name":"IEEE","description":"description IEEE","createdAt":new Date("1999-05-24"),"domaine":"Informatique","nbMembers":0},{"id":"MJE","logo":"logo_je","name":"MELKART JUNIOR ENTREPRISE","description":"description MJE","createdAt":new Date("2008-05-24"),"domaine":"Informatique","nbMembers":0}]
    this.getClubs();
  }

  getClubs(){
    this.clubService.getClubList().subscribe(data=>{
      console.log(data)
      this.clubs=data;
      for (let club of this.clubs) {
        this.getPresident(club.id).subscribe((president: Member) => {
          this.presidents[club.id] = president;
        });
      }
    })
  }

  setLogo(club:Club){
    if(club.logo==null)
      club.logo="logo_null"
  }


  getPresident(idClub: string): Observable<Member> {
    return this.clubService.getPresident(idClub);
  }

  deleteClub(idclub:string){
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
        this.clubService.deleteClub(idclub);
        this.getClubs();
        console.log("ID DE CLUB A SUPRIMER EST "+idclub);
        Swal.fire(
          'Supprimé!',
          'Salle a été supprimé.',
          'success'
        );
        this.getClubs();
      }
      this.getClubs();
    }).catch(() => {
      Swal.fire('Échoué!', 'Il y avait quelque chose qui n\'allait pas.');
    });
  }

  onSubmit(){
    if(this.ClubForm.invalid){
      console.log('Club invalide ')
      console.log(this.ClubForm.value)
      return ;
    }else{
      const clubFormValues = this.ClubForm.value;
      console.log(clubFormValues);
      const id =clubFormValues.name.replace(/\s+/g, '_').toLowerCase();
      this.club=new Club(id,clubFormValues.name,clubFormValues.description,clubFormValues.domaine,0,clubFormValues.createdAt,clubFormValues.logo)
      console.log(this.club);
      this.clubService.addClub(this.club).subscribe(
        (res)=>{
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
           title: 'Salle ajoutée avec succès'
         })
          //this.submitted=false;
          this.ClubForm.reset();
          this.getClubs();
        },(error)=>{
          console.log(error);
        }
      );
      
    }
  }
  
  showUpdateModal(club:Club){
    this.showUpdateButton=true;
    this.idClub=club.id;
    console.log("club à modifier est "+club);
    this.ClubForm.patchValue({
      logo: club.logo,
      name: club.name,
      description: club.description,
      domaine:club.domaine,
      createdAt: club.createdAt
    });
  }

  onUpdate(){
    if(this.ClubForm.invalid){
      console.log('Club invalide ')
      console.log(this.ClubForm.value)
      return ;
    }else{
      const clubFormValues = this.ClubForm.value;
      console.log("ID CLUB :"+this.idClub)
      this.club=new Club(this.idClub,clubFormValues.name,clubFormValues.description,clubFormValues.domaine,0,clubFormValues.createdAt,clubFormValues.logo)

      this.clubService.editClub(this.idClub,this.club).subscribe(
        (res)=>{
          console.log('Club successfully updated')
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
           title: 'Club mis à jour avec succès'
         })
          this.ClubForm.reset();
          this.getClubs();
        },(error)=>{
          console.log(error);
        }
      );

    }
  }

  resetModal(){
    this.ClubForm.reset();
    this.showUpdateButton=false;
  }

  isAdmin(){
    return true;
  }
  isRespo(club:Club){
    return false;
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators , FormGroup } from '@angular/forms';
import { Salle } from "../../Models/Salle";
import { SalleService } from '../../Services/salle.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.css']
})
export class IconsComponent implements OnInit {
  
  salles!:Salle[];//=[{"id":1103,"number":101,"location":"Annexe","description":"Salle Mac"}];
  salle!:Salle
  idSalle!:number
  SalleForm : FormGroup ;
  showUpdateButton=true;
  modalTitle="Ajouter la salle"
  
  constructor( private salleService :SalleService,private formBuilder: FormBuilder) {
    this.SalleForm= this.formBuilder.group(
      { 
        numero: ['', Validators.required],
        location: ['Annexe', Validators.required],
        description: ['', Validators.required],
    }, );
   }

  ngOnInit() {
    this.getSalles();
  }

  private getSalles(){
    this.salleService.getSalleList().subscribe(data=>{
      console.log(data)
      this.salles=data;
    })
  }

  removeSalle(id:number){
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
        this.salleService.deleteSalle(id);
        console.log("ID DE SALLE A SUPRIMER EST "+id);
        Swal.fire(
          'Supprimé!',
          'Salle a été supprimé.',
          'success'
        );
        this.getSalles();
      }
      this.getSalles();
    }).catch(() => {
      Swal.fire('Échoué!', 'Il y avait quelque chose qui n\'allait pas.');
    });
  }

  onSubmit(){
    if(this.SalleForm.invalid){
      console.log('Salle invalide ')
      console.log(this.SalleForm.value)
      return ;
    }else{
      const salleFormValues = this.SalleForm.value;
      this.salle = new Salle(salleFormValues.numero + 1000,salleFormValues.numero,salleFormValues.location,salleFormValues.description);
      if(this.SalleForm.value.location=="Principal"){
        this.salle.id = salleFormValues.numero + 2000;
      }
      this.salleService.addSalle(this.salle).subscribe(
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
          this.salleService.filter('register click');
          //this.submitted=false;
          this.SalleForm.reset();
          this.getSalles();
        },(error)=>{
          console.log(error);
        }
      );
      
    }
  }

  showUpdateModal(salle:Salle){
    console.log("Update salle id :"+salle.id)
    this.showUpdateButton=true;
    this.modalTitle="Modifier la salle N°"+salle.number;
    this.idSalle=salle.id;
    this.SalleForm.patchValue({
      numero: salle.number,
      location: salle.location,
      description: salle.description
    });
  }

  onUpdate(){
    if(this.SalleForm.invalid){
      console.log('Salle invalide ')
      console.log(this.SalleForm.value)
      return ;
    }else{
      const salleFormValues = this.SalleForm.value;
      console.log("ID SALLE :"+this.idSalle)
      this.salle = new Salle(this.idSalle,salleFormValues.numero,salleFormValues.location,salleFormValues.description);


      this.salleService.editSalle(this.salle.id,this.salle).subscribe(
        (res)=>{
          console.log('Salle successfully updated')
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
           title: 'Salle mise à jour avec succès'
         })
          this.SalleForm.reset();
          this.getSalles();
        },(error)=>{
          console.log(error);
        }
      );

    }
  }
  
  isAdmin(){
    return true;
  }

  initializeModalButton(){
    this.showUpdateButton=false;
    this.modalTitle="Ajouter la salle"
  }

}

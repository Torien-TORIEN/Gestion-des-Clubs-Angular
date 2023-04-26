import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators , FormGroup } from '@angular/forms';
import { Material } from 'app/Models/material';
import { MaterielService } from '../../Services/materiel.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
   Materials!:Material[];//=[{"id":1103,"number":101,"location":"Annexe","description":"Salle Mac"}];
    material!:Material
    idMaterial!:number
    MaterialForm : FormGroup ;
    showUpdateButton=true;
    modalTitle="Ajouter  le material"
    constructor( private materielService :MaterielService,private formBuilder: FormBuilder) {
        this.MaterialForm= this.formBuilder.group(
          { 
   
            name: ['', Validators.required],
            quantity: [0, Validators.required],
            description: ['', Validators.required],
        }, );
       }
       ngOnInit() {
        this.getMaterials();
       }
        private getMaterials(){
            this.materielService. getMaterialList().subscribe(data=>{
              console.log(data)
              this.Materials=data;
            })
          }
          removeMaterial(id:number){
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
                this.materielService.deleteMateriel(id);
                console.log("ID DE Materiel A SUPRIMER EST "+id);
                Swal.fire(
                  'Supprimé!',
                  'Materiel a été supprimé.',
                  'success'
                );
                this.getMaterials();
              }
              this.getMaterials();
            }).catch(() => {
              Swal.fire('Échoué!', 'Il y avait quelque chose qui n\'allait pas.');
            });
          }
          
  onSubmit(){
    if(this.MaterialForm.invalid){
      console.log('Material invalide ')
      console.log(this.MaterialForm.value)
      return ;
    }else{
      const materialFormValues = this.MaterialForm.value;
      this.material = new Material(materialFormValues.id,materialFormValues.name,materialFormValues.quantity,materialFormValues.description);
      console.log('Material invalide ',this.material)
      this.materielService.addMaterial(this.material).subscribe(
        (res)=>{
          console.log('Material successfully created')
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
           title: 'Material ajoutée avec succès'
         })
          this.materielService.filter('register click');
          //this.submitted=false;
          this.MaterialForm.reset();
          this.getMaterials();
        },(error)=>{
          console.log(error);
        }
      );
      
    }
  }
  showUpdateModal(material:Material){
   
    console.log("Update material id :"+material.id)
    this.showUpdateButton=true;
    this.modalTitle="Modifier la material N°"+material.id;
    this.idMaterial=material.id;
    this.MaterialForm.patchValue({
   
        name: material.name,
        quantity: material.quantity,
        description: material.description
    });
  }
      
      onUpdate(){
        if(this.MaterialForm.invalid){
          console.log(' materail invalide ')
          console.log(this.MaterialForm.value)
          return ;
        }else{
          const materialFormValues = this.MaterialForm.value;
          console.log("ID Material :"+this.idMaterial)
          this.material = new Material(this.idMaterial,materialFormValues.name,materialFormValues.quantity,materialFormValues.description);
    
    
          this.materielService.editMateriel(this.material.id,this.material).subscribe(
            (res)=>{
              console.log(' Material successfully updated')
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
               title: 'Material mise à jour avec succès'
             })
              this.MaterialForm.reset();
              this.getMaterials();
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
    this.modalTitle="Ajouter  le materiel"
    this.MaterialForm.reset()
  }  
    

}
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators , FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Salle } from "../../Models/Salle";
import { SalleService } from '../../Services/salle.service';
import Swal from 'sweetalert2';
import { LoginService } from 'app/Services/login.service';
import { User } from 'app/Models/user';

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.css']
})
export class UpgradeComponent implements OnInit {
  
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  
  constructor(public fb: FormBuilder, private router: Router,private loginService:LoginService) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]

    });
   }

  ngOnInit() {
  }
  
  get f() {
    return this.loginForm.controls;
  }

  onSubmit(){
    
    this.submitted = true;
    console.log(this.loginForm.value)
    if (this.loginForm.invalid) { 
      console.log("formulaire invalide ")
      return; }
    this.loginService.signIn(this.loginForm.value.email,this.loginForm.value.password).subscribe(
        (user:User) => {
          this.loginService.Authentifie();//ajouter apres 
          this.router.navigate(['/events']);
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Aucun compte trouvé , Vérifier vos informations! Créer un compte si vous n\'avez pas encore ',
          })
          this.submitted = false;
          this.loginForm.reset();
          this.loading = false;
        });
  }



}

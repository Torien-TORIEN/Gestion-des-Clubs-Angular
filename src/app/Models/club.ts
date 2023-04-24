import { Member } from "./member";
import { Role } from "./role";

export class Club {
    id:string;
    name:string;
    description:string;
    domaine:string;
    nbMembers:number;
    createdAt:Date;
    logo:string

    constructor( id:string,name: string, description: string, domaine: string, nbMembers: number, createdAt: Date, logo: string) {
        this.name = name;
        this.description = description;
        this.domaine = domaine;
        this.nbMembers = nbMembers;
        this.createdAt = createdAt;
        this.logo = logo;
        this.id=id;
        // Construire l'ID à partir du nom
        
      }

}

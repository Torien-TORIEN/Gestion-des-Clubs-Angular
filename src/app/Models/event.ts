import { Material } from "./material";
import { Salle } from "./salle";

export class Event {
    id:string;
    title:string;
    status:string;
    date:Date;
    description:string;
    destination:string;
    location:string;
    duration:number;

    salle:Salle
    materials:Material[];
}

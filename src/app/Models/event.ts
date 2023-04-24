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
    salle:Salle;
    materiels:Material[];

    constructor(id: string,title: string,status: string,
        date: Date,description: string,destination: string,
        location: string,duration: number,salle: Salle,materiels:Material[]
      ) {
        this.id = id;
        this.title = title;
        this.status = status;
        this.date = date;
        this.description = description;
        this.destination = destination;
        this.location = location;
        this.duration = duration;
        this.salle = salle;
        this.materiels=materiels
      }
}

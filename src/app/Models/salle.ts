export class Salle {
    id:number;
    number:number;
    location:string;
    description:string

    constructor(id:number, number: number, location: string, description: string) {
        this.number = number;
        this.location = location;
        this.description = description;
        this.id = id;
        //id =1000+number si Annexe ;sinon 2000+number
    }
}

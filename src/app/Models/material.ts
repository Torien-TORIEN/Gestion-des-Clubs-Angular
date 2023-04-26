export class Material {
    id:number;
    name:string;
    quantity:number;
    description:string ; 
    
    constructor(id:number,  name: string , quantity: number, description: string) {
        this.id = id;
        this.name= name;
        this.quantity = quantity;
        this.description = description;
       
        
    }
}
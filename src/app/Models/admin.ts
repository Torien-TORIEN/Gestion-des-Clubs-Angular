import { Actuality } from "./actuality";
import { User } from "./user";

export class Admin extends User {
    profession:string;
    actualities:Actuality[];
}

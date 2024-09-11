import { UserDeveloper } from "./UserDeveloper";


export class User {

    static #developer = "Developer";


    static create( userType ) {

        if( userType === User.#developer )
            return new UserDeveloper();

        throw Error( "Unknown user type" );
    }


    static get developer() {
        return this.#developer;
    }


};

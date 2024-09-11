import BaseTest from "./BaseTest";


export default class BaseTestGroup extends BaseTest {

    #group = [];

    constructor( group ) {

        super();

        this.assert( Array.isArray( group ), '"group" supposed to be array of objects of class "BaseTest"' );

        for( const obj of group ) {

            this.assert( ( obj instanceof BaseTest ), 'all elements of "group" array supposed to be objects of class "BaseTest"' );

            this.#group.push( obj );
        }
    }


    test() {
        this.#group.forEach( obj => obj.test() );
    }


};

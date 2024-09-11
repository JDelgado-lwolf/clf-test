import BaseTest from "./BaseTest";


// noinspection JSUnusedGlobalSymbols
export class BaseTestSuite extends BaseTest {

    #beforeAll  = [];
    #beforeEach = [];
    #afterEach  = [];
    #afterAll   = [];
    #given      = "Undefined";
    #when       = [];


    //@formatter:off
    get beforeAll ()            {   return this.#beforeAll;     }
    get beforeEach()            {   return this.#beforeEach;    }
    get afterEach ()            {   return this.#afterEach;     }
    get afterAll  ()            {   return this.#afterAll;      }
    get given     ()            {   return this.#given;         }
    get when      ()            {   return this.#when;          }
    //@formatter:on


    //@formatter:off
    set beforeAll ( value )     {   this.#beforeAll  = this.#getFunctionsArray( value, "beforeAll"  );   }
    set beforeEach( value )     {   this.#beforeEach = this.#getFunctionsArray( value, "beforeEach" );   }
    set afterEach ( value )     {   this.#afterEach  = this.#getFunctionsArray( value, "afterEach"  );   }
    set afterAll  ( value )     {   this.#afterAll   = this.#getFunctionsArray( value, "afterAll"   );   }
    set given     ( value )     {   this.#given      = this.#getGiven( value );   }
    set when      ( value )     {   this.#when       = this.#getWhen ( value );   }
    //@formatter:on


    arrange() {
    }


    act() {

        describe( this.#given, () => {

            this.#when.forEach( when => {

                describe( when.describe, () => {

                    //@formatter:off
                    beforeAll (  () => this.#preset( when.beforeAllPre,  this.#beforeAll,  when.beforeAllPost  )  );
                    beforeEach(  () => this.#preset( when.beforeEachPre, this.#beforeEach, when.beforeEachPost )  );
                    afterEach (  () => this.#preset( when.afterEachPre,  this.#afterEach,  when.afterEachPost  )  );
                    afterAll  (  () => this.#preset( when.afterAllPre,   this.#afterAll,   when.afterAllPost   )  );
                    //@formatter:on

                    when.then();
                } );
            } );
        } );
    }


    test() {

        this.arrange();
        this.act();
    }


    #getFunctionsArray( value, target ) {

        this.assert( Array.isArray( value ), `"${ target }" supposed to be array of functions` );

        const result = [];

        for( const fn of value ) {

            this.assert( ( typeof fn === "function" ), `all elements of "${ target }" array supposed to be a function` );

            result.push( fn );
        }

        return result;
    }


    #getGiven( value ) {

        this.assert( ( typeof value === "string" ), '"given" supposed to be of "string" type' );

        return value;
    }


    #getWhen( value ) {

        this.assert( Array.isArray( value ), '"when" supposed to be array of objects' );

        const when = [];

        for( const item of value ) {

            //@formatter:off
            this.assert(  ( typeof item          === "object"   ),  'all elements of "when" array supposed to be of "object" type'        );
            this.assert(  ( typeof item.describe === "string"   ),  'all "when" objects supposed to contain "describe" of "string" type'  );
            this.assert(  ( typeof item.then     === "function" ),  'all "when" objects supposed to contain function "then"'              );
            //@formatter:on

            //@formatter:off
            item.beforeAllPre    =  this.#getFunctionWhen( item.beforeAllPre,   "beforeAllPre"   );
            item.beforeAllPost   =  this.#getFunctionWhen( item.beforeAllPost,  "beforeAllPost"  );
            item.beforeEachPre   =  this.#getFunctionWhen( item.beforeEachPre,  "beforeEachPre"  );
            item.beforeEachPost  =  this.#getFunctionWhen( item.beforeEachPost, "beforeEachPost" );
            item.afterEachPre    =  this.#getFunctionWhen( item.afterEachPre,   "afterEachPre"   );
            item.afterEachPost   =  this.#getFunctionWhen( item.afterEachPost,  "afterEachPost"  );
            item.afterAllPre     =  this.#getFunctionWhen( item.afterAllPre,    "afterAllPre"    );
            item.afterAllPost    =  this.#getFunctionWhen( item.afterAllPost,   "afterAllPost"   );
            //@formatter:on

            when.push( item );
        }

        return when;
    }


    #getFunctionWhen( fn, target ) {

        if( fn === undefined )
            fn = null;

        const valid   = ( fn === null ) || ( typeof fn === "function" );
        const message = `"${ target }" of "when" object may be a function, null or omitted`;

        this.assert( valid, message );

        return fn;
    }


    #preset( whenPre, mainArray, whenPost ) {

        if( whenPre !== null )
            whenPre();

        mainArray.forEach( fn => fn() );

        if( whenPost !== null )
            whenPost();
    }


};

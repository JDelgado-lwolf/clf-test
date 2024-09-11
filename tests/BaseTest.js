export default class BaseTest {

    test() {
    }


    assert( valid, message ) {

        if( !valid ) {
            throw new Error( message );
        }
    }


};

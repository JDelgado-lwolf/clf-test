export function MockNotImplemented() {

    const error = new Error( "Mock is not implemented yet" );

    console.debug( error.stack );

    throw error;
}


export function MockCallProhibited() {

    const error = new Error( "Explicit function call is prohibited" );

    console.debug( error.stack );

    throw error;
};

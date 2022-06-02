const jwt = require('jsonwebtoken');
const config = require('config')

export function auth( request:any , response:any , next:any ){
 
    const token = request.header('x-auth-token')

    if( !token ) return response.status(401).send('Access denied. No token provided.')

    try {
  
        const decodedToken = jwt.verify( token , config.get('jwtPrivateKey') );
        request.auth = decodedToken;
        next()
        
    } catch (error) {
        
        response.status(400).send('Invalid Token');
        
    }

}



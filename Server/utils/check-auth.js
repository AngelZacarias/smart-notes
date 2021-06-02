const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server');
const { GOOGLE_SECRET_KEY } = require('../config');
//TODO: Implement with Google
module.exports = (context) =>{
    const authHeader = context.req.headers.authorization;
    if(authHeader){
        const token = authHeader.split('Bearer ')[1];
        if(token){
            try{
                const user = jwt.verify(token, process.env.JWT_KEY);
                return user;
            } catch(err){
                throw new AuthenticationError('Invalid/Expired token');
            }
        }
        throw new Error('Authentication failed. Make sure you have provided an Authentication token in correct format');
    }
    throw new Error('Authentication failed. Make sure you have provided an Authorization header');
}
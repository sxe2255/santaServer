const mongoose = require('mongoose');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const userModel = mongoose.model('users');
const keys = require('../config/keys');
const option = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.jwt
}

module.exports = passport => {
    try{
        passport.use(
            new JwtStrategy(option, async (payload, done) => {
                const user = await userModel.findById(payload.userId).select('email id');
                if(user){
                    done(null, user);
                }else{
                    done(null, false);
                }
            })
        )
    } catch(error) {console.log(error)}
}

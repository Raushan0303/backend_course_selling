import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from "../models/users.js";
// import { JWT_SECRET } from "./config.js";


const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'course_selling_secret'
}

export const configurePassport = (passport) => {
    passport.use(
      new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
          const user = await User.findById(jwt_payload.id); 
          if (user) {
            return done(null, user); 
          }
          return done(null, false);  
        } catch (error) {
          return done(error, false); 
        }
      })
    );
};


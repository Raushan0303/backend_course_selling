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
          const user = await User.findById(jwt_payload.id); // Look for the user in DB using ID from JWT payload
          if (user) {
            return done(null, user); // User found, pass user object
          }
          return done(null, false);  // No user found
        } catch (error) {
          return done(error, false); // In case of an error
        }
      })
    );
};


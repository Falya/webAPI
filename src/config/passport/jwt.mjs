import passport from 'passport';
import passportJwt from 'passport-jwt';
import configAuth from '../auth.mjs';
import User from '../../models/User.mjs';
import messages from '../../namedMessages/namedMessages.mjs';
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: configAuth.JWT.secret,
};

passport.use(
  new JwtStrategy(options, async (jwtPayload, done) => {
    console.log(jwtPayload);
    try {
      const user = await User.findById(jwtPayload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false, messages.JWT_AUTHORIZE_INCORRECT_PASSWORD);
    } catch (error) {
      done(error, false, messages.JWT_UNAUTHORIZED);
    }
  })
);

import passport from 'passport';
import passportJwt from 'passport-jwt';
import configAuth from '../auth.mjs';
import User from '../../models/User.mjs';
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: configAuth.JWT.secret,
};

passport.use(
  new JwtStrategy(options, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      done(error, false);
    }
  })
);

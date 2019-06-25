import User from '../models/User.mjs';
import jwt from 'jsonwebtoken';
import configAuth from '../config/auth.mjs';

const generateToken = id => {
  const token = jwt.sign(
    {
      id,
      exp: Math.floor(Date.now() / 1000) + parseInt(configAuth.JWT.live),
    },
    configAuth.JWT.secret
  );
  return { token: 'Bearer ' + token };
};

export const login = async payload => {
  const { nickName, password } = payload;

  try {
    if (nickName && password) {
      const user = await User.findOne({ nickName: nickName });

      if (!user) {
        return { message: 'No user found.' };
      }

      const validate = await user.validatePassword(password);

      if (!validate) {
        return { message: 'Oops! Wrong password.' };
      }

      return generateToken(user.id);
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Authentication failed.' };
  }
};

export const signup = async payload => {
  const { email, password, nickName } = payload;

  try {
    const user = await User.findOne({ $or: [{ email: email }, { nickName: nickName }] });

    if (user) {
      return { message: 'That email or userName is already taken.' };
    }

    const newUser = new User();
    newUser.nickName = nickName;
    newUser.email = email;
    newUser.password = await newUser.generateHash(password);
    await newUser.save();

    return generateToken(newUser.id);
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Registration failed.' };
  }
};

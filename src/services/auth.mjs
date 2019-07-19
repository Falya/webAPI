import User from '../models/User.mjs';
import jwt from 'jsonwebtoken';
import configAuth from '../config/auth.mjs';
import messages from '../namedMessages/namedMessages.mjs';

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
        return { message: messages.LOGIN_NO_FOUND_USER };
      }

      const validate = await user.validatePassword(password);

      if (!validate) {
        return { message: messages.LOGIN_WRONG_PASSWORD };
      }

      return generateToken(user.id);
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: messages.LOGIN_FAILED };
  }
};

export const signup = async payload => {
  const { email, password, nickName } = payload;

  try {
    const user = await User.findOne({ $or: [{ email: email }, { nickName: nickName }] });

    if (user) {
      return { message: messages.SIGNUP_DUPLICATE_USER };
    }

    const newUser = new User();
    newUser.nickName = nickName;
    newUser.email = email;
    newUser.password = await newUser.generateHash(password);
    await newUser.save();

    return generateToken(newUser.id);
  } catch (error) {
    console.error(error);
    return { success: false, message: messages.SIGNUP_FAILED };
  }
};

export const adminLogin = async payload => {
  const { nickName, password } = payload;

  try {
    if (nickName && password) {
      const user = await User.findOne({ nickName: nickName });

      if (!user) {
        return { message: messages.LOGIN_NO_FOUND_USER };
      }

      const validate = await user.validatePassword(password);

      if (!validate) {
        return { message: messages.LOGIN_WRONG_PASSWORD };
      }

      if (!user.isAdmin()) {
        return { message: messages.NOT_ADMIN };
      }

      return generateToken(user.id);
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: messages.LOGIN_FAILED };
  }
};

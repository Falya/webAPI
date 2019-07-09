const messages = {
  BLOCK_SEAT_SUCCESS: { success: false, message: 'seat is already blocked' },
  BLOCK_SEAT_FAILED: { success: false, message: 'seat is not blocked' },
  BLOCK_SEAT_ALREADY_BLOCKED: { success: false, message: 'seat is already blocked' },

  UNBLOCK_SEAT_SUCCESS: { success: true, message: 'seat is unblocked' },
  UNBLOCK_SEAT_FAILED: { success: false, message: 'seat is not unblocked' },

  LOGIN_NO_FOUND_USER: { message: 'No user found.' },
  LOGIN_WRONG_PASSWORD: { message: 'Oops! Wrong password.' },
  LOGIN_FAILED: { success: false, message: 'Authentication failed.' },

  SIGNUP_DUPLICATE_USER: { message: 'That email or userName is already taken.' },
  SIGNUP_FAILED: { success: false, message: 'Registration failed.' },

  JWT_AUTHORIZE_INCORRECT_PASSWORD: { message: 'Incorrect password.' },
  JWT_UNAUTHORIZED: { message: 'Unauthorized' },
};

export default messages;

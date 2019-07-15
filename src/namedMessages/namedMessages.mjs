const messages = {
  BLOCK_SEAT_SUCCESS: 'seat is already blocked',
  BLOCK_SEAT_FAILED: 'seat is not blocked',
  BLOCK_SEAT_ALREADY_BLOCKED: 'seat is already blocked',

  UNBLOCK_SEAT_SUCCESS: 'seat is unblocked',
  UNBLOCK_SEAT_FAILED: 'seat is not unblocked',

  LOGIN_NO_FOUND_USER: 'No user found.',
  LOGIN_WRONG_PASSWORD: 'Oops! Wrong password.',
  LOGIN_FAILED: 'Authentication failed.',

  SIGNUP_DUPLICATE_USER: 'That email or userName is already taken.',
  SIGNUP_FAILED: 'Registration failed.',

  JWT_AUTHORIZE_INCORRECT_PASSWORD: 'Incorrect password.',
  JWT_UNAUTHORIZED: 'Unauthorized',

  PAYMENT_FAILED: 'Failed payment',
  PAYMENT_TICKETS_SUCCESS: 'Tickets added to user',
  PAYMENT_TICKETS_FAILED: 'Tickets hasn`t been add',
};

export default messages;

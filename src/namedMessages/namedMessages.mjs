const messages = {
  BLOCK_SEAT_SUCCESS: 'Seat is blocked by you',
  BLOCK_SEAT_FAILED: 'Seat is not blocked',
  BLOCK_SEAT_ALREADY_BLOCKED: 'Seat is already blocked by another user',
  BLOCK_SEAT_USER_LIMIT: 'You can book no more than 5 seats',

  UNBLOCK_SEAT_SUCCESS: 'Seat is unblocked',
  UNBLOCK_SEAT_FAILED: 'Seat is not unblocked',

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

  NOT_ADMIN: 'You are not Admin!',
};

export default messages;

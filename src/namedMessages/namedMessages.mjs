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

  ADD_MOVIE_ALREADY: 'This movie already exists.',
  ADD_MOVIE_SUCCESS: 'Movie successfully added.',
  ADD_MOVIE_FAILED: 'The movie hasn`t been added. Something was wrong.',

  ADD_CITY_SUCCESS: 'City successfully added.',
  ADD_CITY_FAILED: 'The city hasn`t been added. This city is already exist.',

  ADD_THEATER_SUCCESS: 'Theater successfully added.',
  ADD_THEATER_FAILED: 'The theater hasn`t been added. This theater is already exist.',

  ADD_FEATURE_SUCCESS: 'Product successfully added.',
  ADD_FEATURE_FAILED: 'The theater hasn`t been added. This product is already exist.',
};

export default messages;

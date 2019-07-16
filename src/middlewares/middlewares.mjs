const emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export function userRegistrationMiddleware(req, res, next) {
  const { nickName, email, password } = req.body;
  if (!nickName || nickName.length < 3) {
    res.send({
      success: false,
      message: 'The minimum length of the nickName must be 3.',
    });
  }
  if (!password || password.length < 6) {
    res.send({
      success: false,
      message: 'The minimum length of the password must be 6.',
    });
  }
  if (!email || !email.match(emailRegExp)) {
    res.send({
      success: false,
      message: 'You entered iтмфдшв email',
    });
  }

  next();
}

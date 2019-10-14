export const message = {
  flash: {
    password_reset: {
      expired: 'Your password reset link has been expired'
    , failure: 'Rassword reset has failed'
    , success: 'Your password has beeen successfuly updated'
    }
  , password_reset_request: {
      failure: 'Rassword reset request has failed'
    , success: 'Password reset has beeen successfuly requested'
    }
  , signin: {
      failure: 'The credentials you\'ve entered are incorrect'
    }
  , signup: {
      failure: 'Your sign up has failed'
    , success: `It's almost done. We've sent an activation link via email.
Please check it.`
    }
  , user_activation: {
      expired: 'Your activation link has been expired'
    , failure: 'Activation failed'
    , success: 'Your account has beeen successfuly activated'
    }
  }
, description: {
    shared: {
      password: `At least, use one lower and UPPER letter from: A-z,
one digit from: 0-9. And, 8 characters are minimum length.`
    }
  , password_reset_request: {
      email: 'You can request it only once per several minutes.'
    }
  , signup: {
      email: `You need this as primary e-mail address to sign in to your
account.`
    , name: 'Your fullname. This is an optional field.'
    , username: 'You can change this later as you want if it\'s available.'
    }
  , user_activation: {
      welcome: 'Well done! As next, please signin!'
    }
  }
};

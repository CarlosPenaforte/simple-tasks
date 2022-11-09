const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
//Load model
const {
  getUserByEmail, getUserById,
} = require('../controllers/userController');
const loginCheck = passport => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      //Check customer
      await getUserByEmail(email)
        .then((user) => {
          if (!user) {
            console.log('wrong email');
            return done();
          }
          //Match Password
          bcrypt.compare(password, user.password, (error, isMatch) => {
            if (error) {
              throw error;
            }
            if (isMatch) {
              return done(null, user);
            } else {
              console.log('Wrong password');
              return done();
            }
          });
        })
        .catch((error) => console.log(error));
    }),
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    getUserById.findById(id, (error, user) => {
      done(error, user);
    });
  });
};
module.exports = {
  loginCheck,
};
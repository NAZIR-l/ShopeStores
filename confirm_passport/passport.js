const passport = require('passport');
const localstrategy = require('passport-local').Strategy
const User = require('../model/User')
const Cart = require('../model/Cart')

// call to ser to get id (user.name or user.passport or user.email)
passport.serializeUser((user, done) => {
    return done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findById(id, ('email'), (err, user) => {
        Cart.findById( id , ( err , cart )=>{
            if(!cart){
              return done (err,user);
            }
        user.cart = cart ;
        return done ( err , user );

    })
      
    })
})

passport.use('local-signin', new localstrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, (req, email, password, done) => {
    User.findOne({ email: email }, (error, user) => {
        if (error) {
            return done(error, false);// User : false
        }
        if (!user) {
            return done(null, false, req.flash("signinError", "user is not found"));// User : false
        }
        if (!user.comparePassword(password)) {
            return done(null, false, req.flash('signinError', 'worng passwoed'));
        }
        console.log(user);
        return done(null, user);
    })
}))



// SIGN UP
passport.use('local-signup', new localstrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, (req, email, password, done) => {
    User.findOne({ email: email }, (error, user) => {
        if (error) {
            return done(error);
        }
        if (user) {
            return done(null, false, req.flash("signupError", "this email already exist .."));// User : false
        }
        const newUser = new User({
            username: req.body.names,
            email: email,
            password: new User().hashPassword(password)
        })
        newUser.save((err, user) => {
            if (err) {
                return done(err);
            }
            console.log(user);
            return done(null, user);
        })
    })
}))


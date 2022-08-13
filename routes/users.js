var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../model/User'); 
// mongoose.Types.ObjectId.isValid("your id");
const passport = require('passport');
const { authenticate } = require('passport');
const bcrypt = require('bcrypt');
const _=require('lodash');


const surf = require('csurf');



router.use(surf());
/* GET users listing. */
router.get('/signup', isNot_signin ,function (req, res, next) {
  // if(req.user.cart){
  //   totalproduct = req.user.cart.totalquantity
  // }
  // else{
  //   totalproduct = 0 ;
  // }
  var massagError = req.flash('signupError');
  res.render('user/signup',{massages :massagError,
    checkUser:req.isAuthenticated(),
    sign:'signin',
    signhref:'/users/signin',
    token:req.csrfToken(),
    // totalproducts : totalproduct
  })
});

/// 
// doing validation on the form 
router.post('/signup', [
  check('names').not().isEmpty().withMessage('please inter your name'),
  check('email').not().isEmpty().withMessage('please inter your email'),
  check('email').isEmail().withMessage('enter valid email'),
  check('password').not().isEmpty().withMessage('please inter your password'),
  check('password').isLength({ min: 5 }).withMessage('please inter your more then password'),
  check('confirmpassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('password and confirm not matched');}return true;})],
 (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
  
var validationmassage =[];// for express- session
for (let i = 0; i < errors.errors.length; i++) {// for express- session
  validationmassage.push(errors.errors[i].msg);// for express- session
  // for express- session
}// for express- session
console.log(validationmassage);// for express- session
req.flash('signupError',validationmassage);// for express- session
res.redirect('signup')// for express- session
    return;
}
next();
  },
  passport.authenticate('local-signup',{
    session:false,
    successRedirect:'signin',
    failureRedirect:'signup',
    failureFlash: true ,
  }));


// profile
router.get('/profile',check_is_singin,(req,res,next)=>{
  console.log(req.isAuthenticated()); 

  console.log(req.session); 
  console.log(req.user); // will see the id and email becouse the object in the passport  deserializeUser
  // if(req.user.cart){
  //   totalproduct = req.user.cart.totalquantity
  // }
  // else{
  //   totalproduct = 0 ;
  // } 
    // res.render('user/profile',{checkUser:req.isAuthenticated(), totalproducts : totalproduct});

});



// sign in ............................................... 
router.get('/signin',isNot_signin,(req,res,next)=>{
  //for validation 
   var massagError = req.flash('signinError');
   //its send to the digninn page
  //  console.log(req.csrfToken()); its use for check the req from the same website or not for does not can the hack send any req becouse the borwser will doing with her 
  // but cith the csrf cant word with outside the website req
 
  res.render('user/signin',{massages :massagError,
    checkUser:req.isAuthenticated(),
    sign:'signUp',
    signhref:'/users/signup',
    token:req.csrfToken(),

  });

});// serialize send the id or email to the session
// we cannot dont just [] and validation should doing [] and callback function
router.post('/signin',[
  check('email').not().isEmpty().withMessage('please inter your email'),
  check('email').isEmail().withMessage('enter valid email'),
  check('password').not().isEmpty().withMessage('please inter your password'),
  check('password').isLength({ min: 5 }).withMessage('please inter your more then password'),
],(req,res,next)=>{

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
  
var validationmassage =[];// for express- session
for (let i = 0; i < errors.errors.length; i++) {// for express- session
  validationmassage.push(errors.errors[i].msg);// for express- session
  // for express- session
}// for express- session
console.log(validationmassage);// for express- session
req.flash('signinError',validationmassage);// for express- session
res.redirect('signin')// for express- session
    return;
  } 
  next();
  // when have function in the function two callback function
   // without the next dont open to the callback secound function
  // go to callback anthor function 

},passport.authenticate('local-signin',{
  successRedirect:'profile',
  failureRedirect:'signin',
  failureFlash: true ,
  // session:false,
}))

//logout
router.get('/logout',is_logout,(req,res,next)=>{
  req.logOut();
  res.redirect('/');
})

function check_is_singin(req,res,next){
  if(! req.isAuthenticated()){
res.redirect('signin');
    return;
  }
  next();
}

function isNot_signin(req,res,next){
  if(req.isAuthenticated()){
res.redirect('/');
    return;
  }
  next();
}
function is_logout(req,res,next){
  if(! req.isAuthenticated()){
res.redirect('signup');
    return true;
  }
  next();
}


module.exports = router;

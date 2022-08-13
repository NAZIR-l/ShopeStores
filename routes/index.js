var express = require('express');
var router = express.Router();

const Product = require('../model/product');
// const init= require('../init/proinit');
const Cart = require('../model/Cart');
const { result } = require('lodash');

/* GET home page. */
router.get('/', function (req, res, next) {
  totalproduct = null;
  if(req.isAuthenticated()){
    if(req.user.cart){
         totalproduct = req.user.cart.totalquantity;
    }
 else{
  totalproduct = 0 ;
 }
  }
  Product.find({ }, (error, doc) => {
    if (error) {
      console.log(error);
    }
    var productGrid = [];
    var colGirde = 1;
    for (let i = 0; i < doc.length; i = i + colGirde) {
      productGrid.push(doc.slice(i, i + colGirde));
    }
    console.log("product : " + productGrid.length);   
    res.render('index', {addPluse : true , title: 'shopping phone', product: productGrid, checkUser: req.isAuthenticated() , sign: 'signin', signhref: '/users/signin', totalproducts : totalproduct});
  })
    .lean()
});

router.get('/shoping_cart',(req,res,next)=>{
  if(! req.isAuthenticated()){
    res.redirect('/users/signin');
    return ;
  }
  if(! req.user.cart){
    // res.redirect('/users/isempty');
    res.render('shoping_cart', { checkUser: true , usercartP : 0 , usercartQ : 0 ,deleatall:false });
    return ;
  }
 const usercarts = req.user.cart ;
  // console.log(req.user.cart.selectedProduct);
res.render('shoping_cart', {addPluse : false  ,deleatall:true, checkUser: req.isAuthenticated() ,usercart : req.user.cart.selectedProduct , usercartP : req.user.cart.totalprice , usercartQ :req.user.cart.totalquantity });
})

router.get('/addTocart/:id/:price/:name', (req, res, next) => {

  const cartID = req.user._id;
  // for convert from the string to Number(decimal from 0 to 10)
  const newproductprice = parseInt(req.params.price, 10);
  const newproduct = {
    _id: req.params.id,
    price: newproductprice,
    name: req.params.name,
    quantity:1,

  }
  Cart.findById(cartID, (err, cart) => {
    // console.log("cart is"+cart);
    if (err) {
      console.log(err)
    }
    // if doesn't have cart (and creat new cart) 
    if (!cart) {
      const newcart = new Cart({
        _id: cartID,
        totalquantity: 1,
        totalprice: newproductprice,
        selectedProduct: [newproduct],
      })
      newcart.save((err, doc) => {
        if (err) {
          console.log(err);
        }
        console.log(doc);
      })
    }
    // if the cart exit from the last time
    if (cart) {
      var indexes = -1;
      for (var i = 0; i < cart.selectedProduct.length; i++) {
       
        if(req.params.id === cart.selectedProduct[i]._id) {
          indexes = i ;
          break;
        }
      }
      // if click to the product a lot of time 
      if(indexes>=0){
             cart.selectedProduct[indexes].quantity = cart.selectedProduct[indexes].quantity + 1 ;
             cart.selectedProduct[indexes].price = cart.selectedProduct[indexes].price + newproductprice ;
             cart.totalquantity = cart.totalquantity + 1 ;
             cart.totalprice =  cart.totalprice + newproductprice ;
             Cart.updateOne({ _id : cartID }, { $set : cart },( err , doc )=>{
              if(err){
                console.log(err);
              }
              console.log(doc);
              console.log(cart);
            })
      }
      // if first time chooese the product
      else {
          cart.totalquantity= cart.totalquantity + 1 ;
          cart.totalprice = cart.totalprice + newproductprice;
          cart.selectedProduct.push(newproduct);
          Cart.updateOne({ _id : cartID }, { $set : cart },( err , doc )=>{
            if(err){
              console.log(err);
            }
            console.log(doc);
            console.log(cart);
          })
      }
    }

  })
  res.redirect('/');

})

router.get('/increasProduct/:index',(req,res,next)=>{
  const index = req.params.index;
  const userCart = req.user.cart ;
  const productPrice = userCart.selectedProduct[index].price / userCart.selectedProduct[index].quantity ;

  if(userCart.selectedProduct[index].quantity <= 0){
    console.log("ohhhhhhhhh");

  }
  else{

  
  userCart.selectedProduct[index].quantity =userCart.selectedProduct[index].quantity + 1 ;
  userCart.selectedProduct[index].price =  userCart.selectedProduct[index].price + productPrice ;
  userCart.totalprice = userCart.totalprice + productPrice ;
  userCart.totalquantity = userCart.totalquantity + 1 ;
  Cart.updateOne({_id : userCart.id},{$set : userCart} ,(err,doc)=>{
    if(err){
      console.log(err);
    }
    else{
      console.log(doc)
      res.redirect('/shoping_cart');
    }
  })
  }
})
router.get('/decreasProduct/:index',(req,res,next)=>{
  const index = req.params.index;
  const userCart = req.user.cart ;
  const productPrice = userCart.selectedProduct[index].price / userCart.selectedProduct[index].quantity ;

  userCart.selectedProduct[index].quantity =userCart.selectedProduct[index].quantity - 1 ;
  userCart.selectedProduct[index].price =  userCart.selectedProduct[index].price - productPrice ;
  userCart.totalprice = userCart.totalprice - productPrice ;
  userCart.totalquantity = userCart.totalquantity - 1 ;

  console.log(userCart.selectedProduct[index].price);

  Cart.updateOne({_id : userCart.id},{$set : userCart} ,(err,doc)=>{
    if(err){
      console.log(err);
    }
    else{
      console.log(doc)

      res.redirect('/shoping_cart');
    }
  })
 
  

})
router.get('/deleteProduct/:index',(req,res,next)=>{

  const index = req.params.index;
  const userCart = req.user.cart ;
  
if(userCart.selectedProduct.length <= 1){
Cart.deleteOne({_id : userCart._id},(err,doc)=>{
  if(err){
    console.log(err);
  }
  console.log(doc);
  res.redirect('/shoping_cart');
})
}
else{

  userCart.totalprice = userCart.totalprice - userCart.selectedProduct[index].price ;
  userCart.totalquantity = userCart.totalquantity - userCart.selectedProduct[index].quantity ;
   userCart.selectedProduct.splice(index ,1 ) ;
   Cart.updateOne({_id : userCart.id},{$set : userCart} ,(err,doc)=>{
    if(err){
      console.log(err);
    }
    else{
      console.log(doc)
      res.redirect('/shoping_cart');
    }
  })
}


 
  // for delete have thired way :
  // arrayName.pop(); will delete finally element
  // arrayName.shift(); will delete first element
  // arrayName.splice(index element , to any element); 



})

// add credit card
router.get("/checkout",(req,res,next)=>{
  const userCart = req.user.cart ;
res.render('checkout',{checkUser:true ,  totalprice:userCart.totalprice , totalproduct : userCart.totalquantity });
})
module.exports = router;

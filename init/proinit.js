
const Product= require('../model/product');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shoppingcarts',{useNewUrlparser:true},(error)=>{

  if(error){
console.log(error);
  }
  else{
console.log('its connected to database : product');
  }
});

const products = [  new Product({
    imagePath:'images/app.jpeg',
    productName:'Y7',
    price:500 ,
    information:'information',

}),
new Product({
    imagePath:'images/keyboard.jpeg',
    productName:'Y6',
    price:200 ,
    information:'information',

}),
new Product({
    imagePath:'images/game.jpeg',
    productName:'Y6',
    price:500 ,
    information:'information',

}),
new Product({
    imagePath:'images/app.jpeg',
    productName:'Y5',
    price:500 ,
    information:'information',

}),
new Product({
    imagePath:'images/app.jpeg',
    productName:'Y4',
    price:500 ,
    information:'information',

}),
new Product({
    imagePath:'images/work.jpeg',
    productName:'Y3',
    price:500 ,
    information:'information',

}),
new Product({
    imagePath:'images/laptop.jpeg',
    productName:'Y2',
    price:500 ,
    information:'information',

}),
new Product({
    imagePath:'images/laptop.jpeg',
    productName:'Y2',
    price:500 ,
    information:'information',

}),
];


var done = 0;
for(var i = 0 ;i < products.length ;i++ ){
    console.log(products.length);
    products[i].save((result,error)=>{
        if(error){
            console.log(error);
        }
else{
    console.log(result);
    done ++
    if(done === products.length){
mongoose.disconnect();
    }
}
    });
}
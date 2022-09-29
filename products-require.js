var seneca = require('seneca')().use('productsdata')

var products =  {
    product: "Laptop",
    price: 201.99,
    category: "PC"
}

function add_products() {
    seneca.act({role: 'product', cmd: 'add', data: products}, function (err, msg) {
        console.log(msg);
    });
}

add_products()
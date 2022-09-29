var plugin = function (options) {
    var seneca = this;

    seneca.add({ role: 'product', cmd: 'add' }, function (msg, respond) {
        this.make('product').data$(msg.data).save$(respond);
    });

    seneca.add({ role: 'product', cmd: 'get' }, function (msg, respond) {
        this.make('product').load$(msg.data.user_id, respond);
    });

    seneca.add({ role: 'product', cmd: 'get-all' }, function (msg, respond) {
        this.make('product').list$({}, respond);
    });

    seneca.add({ role: 'product', cmd: 'delete-all' }, function (msg, respond) {
        this.make('product').remove$(msg.data.user_id, respond);
    });


}

module.exports = plugin;



var seneca = require("seneca")();
seneca.use(plugin);
seneca.use('seneca-entity');

seneca.add('role:api, cmd:add-product', function (args, done) {
    console.log("--> cmd:add-product");
    var product = {
        product: args.product,
        price: args.price,
        category: args.category
    }
    console.log("--> product: " + JSON.stringify(product));
    seneca.act({ role: 'product', cmd: 'add', data: product }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});

seneca.add('role:api, cmd:get-all-product', function (args, done) {
    console.log("--> cmd:get-all-product");
    seneca.act({ role: 'product', cmd: 'get-all' }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});

seneca.add('role:api, cmd:get-product', function (args, done) {
    console.log("--> cmd:get-product, args.product_id: " + args.product_id);
    seneca.act({ role: 'product', cmd: 'get', data: { product_id: args.product_id } }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});


seneca.add('role:api, cmd:delete-all-product', function (args, done) {
    console.log("--> cmd:delete-all-product, args.product_id: " + args.product_id);
    seneca.act({ role: '', cmd: 'delete', data: { product_id: args.product_id } }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});




seneca.act('role:web', {
    use: {
        prefix: '/abservice',
        pin: { role: 'api', cmd: '*' },
        map: {
            'add-product': { GET: true , POST: true },
            'get-all-product': { GET: true , POST: true   },
            'get-product': { GET: true , POST: true },
            'delete-all-product': { GET: true , POST: true }
           
        }
    }
})

var express = require('express');
var app = express();
app.use(require("body-parser").json())
app.use(seneca.export('web'));


app.listen(3000)
console.log("Server listening on localhost:3000 ...");
console.log("----- Requests -------------------------");
console.log("http://localhost:3000/abservice/add-product?product=Laptop&price=120.99&category=PC");
console.log("http://localhost:3000/abservice/get-all-product");
console.log("http://localhost:3000/abservice/get-product?prod5uct_id=h4ysw4");
console.log("http://localhost:3000/abservice/delete-all-product?product_id=h4ysw4");


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

seneca.add('role:api, cmd:add-user', function (args, done) {
    console.log("--> cmd:add-user");
    var products = {
        product: args.product,
        price: args.price,
        category: args.category
    }
    console.log("--> product: " + JSON.stringify(products));
    seneca.act({ role: 'product', cmd: 'add', data: products }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});

seneca.add('role:api, cmd:get-all-users', function (args, done) {
    console.log("--> cmd:get-all-users");
    seneca.act({ role: 'product', cmd: 'get-all' }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});

seneca.add('role:api, cmd:get-user', function (args, done) {
    console.log("--> cmd:get-user, args.user_id: " + args.user_id);
    seneca.act({ role: 'product', cmd: 'get', data: { user_id: args.user_id } }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});


seneca.add('role:api, cmd:delete-user', function (args, done) {
    console.log("--> cmd:delete-user, args.user_id: " + args.user_id);
    seneca.act({ role: '', cmd: 'delete', data: { user_id: args.user_id } }, function (err, msg) {
        console.log(msg);
        done(err, msg);
    });
});

seneca.add('role:api, cmd:delete-all-users', function (args, done) {
    done(null, { cmd: "delete-all-users" });
});

seneca.act('role:web', {
    use: {
        prefix: '/abservice',
        pin: { role: 'api', cmd: '*' },
        map: {
            'add-user': { GET: true , POST: true },
            'get-all-users': { GET: true , POST: true },
            'get-user': { GET: true ,  POST: true },
            'delete-user': { GET: true , POST: true }
            'delete-all-user': { GET: true , POST: true }
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


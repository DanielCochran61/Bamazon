const db = require('../models');

db.sequelize.sync().then(function () {
    db.Product.bulkCreate([{
        name: 'Skyrim',
        department: 'Video Games',
        price: 19.99,
        avail_quantity: 80
    }, {
        name: 'Witcher 3',
        department: 'Video Games',
        price: 39.99,
        avail_quantity: 70
    }, {
        name: 'Anthem',
        department: 'Video Games',
        price: 59.99,
        avail_quantity: 120
    }, {
        name: 'Logitech G403',
        department: 'Mouse',
        price: 42.99,
        avail_quantity: 95
    }, {
        name: 'Razer DeathAdder',
        department: 'Mouse',
        price: 49.99,
        avail_quantity: 79
    }, {
        name: 'FinalMouse Air58',
        department: 'Mouse',
        price: 193.99,
        avail_quantity: 30
    }, {
        name: 'LG 34UC79G-B',
        department: 'Monitors',
        price: 468.99,
        avail_quantity: 42
    }, {
        name: 'Acer Predator Gaming X34',
        department: 'Monitors',
        price: 948.99,
        avail_quantity: 29
    }, {
        name: 'Razer BlackWidow Chroma',
        department: 'Keyboards',
        price: 149.99,
        avail_quantity: 60
    }, {
        name: 'CORSAIR K95 RGB PLATINUM',
        department: 'Keyboards',
        price: 139.99,
        avail_quantity: 65
    }]).then(function () {
        console.log('Data successfully added!');
        db.sequelize.close();
    }).catch(function (error) {
        console.log('Error', error)
    });
})

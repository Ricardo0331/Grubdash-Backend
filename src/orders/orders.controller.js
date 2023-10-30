const path = require("path");
const orders = require(path.resolve("src/data/orders-data"));
const nextId = require("../utils/nextId");

//Middleware to check if order exist
function orderExist(req, res, next) {
    const { orderId } = req.params
    const foundOrder = orders.find((order) => order.id === orderId);
    if (foundOrder){
        res.locals.order = foundOrder
        return next();
    }
    next({ status: 404, message: `Order id not found: ${orderId}` });
};



//List all dishes
function list(req, res) {
    res.json ({ data: orders })
};


//create a new order
function create(req,res) {
    const newOrder = {
        id: nextId(),
        ...req.body.data,
    };
    orders.push(newOrder);
    res.status(201).json({ data: newOrder });
};


//read an existing order
function read(req, res) {
    res.json({ data: res.locals.order });
};


//update an existing order
function update(req, res) {
    const updateOrder = {
        ...res.locals.order,
        ...req.body.data,
    };
    res.json({ data: updateOrder });
};



//delete an existing order
function destroy(req, res) {
    const { orderId } = req.params;
    const index = orders.findIndex((order) => order.id === orderId);
    orders.splice(index, 1);
    res.sendStatus(204);
};




module.exports = {
    list,
    create,
    read,
    update,
    destroy,
    orderExist,

}; 

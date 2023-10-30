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
function list(req,res) {
    res.json ({ data: orders })
};





module.exports = {
    list,

}; 

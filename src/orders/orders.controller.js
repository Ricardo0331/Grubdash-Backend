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


// Update an existing order
function update(req, res) {
    const { orderId } = req.params;
    const foundOrder = orders.find((order) => order.id === orderId);
  
    const { data = {} } = req.body;
    const { deliverTo, mobileNumber, dishes, status } = data;

    // Update the order fields
    if (deliverTo) foundOrder.deliverTo = deliverTo;
    if (mobileNumber) foundOrder.mobileNumber = mobileNumber;
    if (dishes) foundOrder.dishes = dishes;
    if (status) foundOrder.status = status;
  
    res.json({ data: foundOrder });
}




//delete an existing order
function destroy(req, res) {
    const { orderId } = req.params;
    const index = orders.findIndex((order) => order.id === orderId);
    orders.splice(index, 1);
    res.sendStatus(204);
};


//validate new order data
function validateOrderData(req, res, next) {
    const { data = {} } = req.body;
    const { deliverTo, mobileNumber, dishes, status } = data; 

    if (!deliverTo) {
        return next({ status: 400, message: "Order must inclue a deliverTo" });
    }
    
    //check if mobileNumber exist
    if (!mobileNumber) {
        return next({ status: 400, message: "Order must include a mobileNumber" });
    }

    //check if dishes array exist and is an array with atleast one dish
    if (!dishes || !Array.isArray(dishes) || dishes.length === 0) {
        return next ({ status: 400, message: "Order must include at least one dish" });
    }

    //validate each dish in the dishes array
    for (let i = 0; i < dishes.length; i++) {
        const dish = dishes[i]; 
        if (!dish.quantity || dish.quantity <= 0 || !Number.isInteger(dish.quantity)) {
            return next({ status: 400, message: `Dish ${i} must have a quantity that is an interger greater than 0` })
        }
    }


    //validate status 
    if (!status) {
        return next({ status: 400, message: "Order must have a status of pending, preparing, out-for-delivery, delivered" });
    }
    if (!["pending", "preparing", "out-for-delivery", "delivered"].includes(status)) {
        return next({ status: 400, message: "Order must have a status of pending, preparing, out-for-delivery, delivered" });
    }


    //if all validations pass, move on the next middleware 
    next();
}



//check if an existing order can be updated or deleted
function validateOrderStatus(req, res, next) {
    const {  status } = res.locals.order;
    if (status === "delivered") {
        return next({ status: 400, message: "A delivered order cannot be changed" });
    }
    next();
}


//validation middleware for PUT
function validateOrderId(req, res, next) {
    const { orderId } = req.params;
    const { id } = req.body.data;
  
    if (orderId !== id) {
      return next({
        status: 400,
        message: `Order id does not match route id. Order: ${id}, Route: ${orderId}.`,
      });
    }
    next();
  }
  





//ERROR handling
function errorHandler(err, req, res, next) {
    const { status = 500, message = "Something went wrong!" } = err;
    res.status(status).json({ error: message });
};


module.exports = {
    list,
    create,
    read,
    update,
    destroy,
    orderExist,
    validateOrderData,
    validateOrderStatus,

}; 

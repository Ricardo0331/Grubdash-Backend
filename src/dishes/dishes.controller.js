const path = require("path");
const dishes = require(path.resolve("src/data/dishes-data"));
const nextId = require("../utils/nextId");

//Middleware to check if dish exist
function dishExists(req, res, next) {
    const { dishId } = req.params;
    const foundDish = dishes.find((dish) => dish.id === dishId); 
    if (foundDish) {
        res.locals.dish = foundDish
        return next();
    }
    next({ status: 404, message: `Dish id not found: ${dishId}` });
};


//List all dishes
function list(req,res) {
    res.json ({ data: dishes });
};


module.exports = {
    list,

};
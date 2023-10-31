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
function list(req, res) {
    res.json ({ data: dishes });
};


// Create a new dish
function create(req, res) {
    const { data: { name, description, price, image_url } = {} } = req.body;
    const newDish = {
      id: nextId(),
      name,
      description,
      price,
      image_url,
    };
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
  }
  
  // Read an existing dish
function read(req, res) {
    res.json({ data: res.locals.dish });
  }


// Update an existing dish
function update(req, res) {
    const { dishId } = req.params;
    const { data: { name, description, price, image_url } = {} } = req.body;
  
    const foundDish = res.locals.dish;
    foundDish.name = name;
    foundDish.description = description;
    foundDish.price = price;
    foundDish.image_url = image_url;
  
    res.json({ data: foundDish });
  }



// Validation middleware for creating a new dish
function validateDish(req, res, next) {
    const { data: { name, description, price, image_url } = {} } = req.body;
    if (!name || name === "") return next({ status: 400, message: "Dish must include a name" });
    if (!description || description === "") return next({ status: 400, message: "Dish must include a description" });
    if (price === undefined || price <= 0 || !Number.isInteger(price)) return next({ status: 400, message: "Dish must have a price that is an integer greater than 0" });
    if (!image_url || image_url === "") return next({ status: 400, message: "Dish must include a image_url" });
    next();
  }



// Validation middleware for updating an existing dish
function validateDishUpdate(req, res, next) {
    const { dishId } = req.params;
    const { data: { id, name, description, price, image_url } = {} } = req.body;
  
    // All the validations for creating a new dish
    if (!name || name === "") return next({ status: 400, message: "Dish must include a name" });
    if (!description || description === "") return next({ status: 400, message: "Dish must include a description" });
    if (price === undefined || price <= 0 || !Number.isInteger(price)) return next({ status: 400, message: "Dish must have a price that is an integer greater than 0" });
    if (!image_url || image_url === "") return next({ status: 400, message: "Dish must include a image_url" });
  
    // Additional validations for updating a dish
    if (id && id !== dishId) return next({ status: 400, message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}` });
  
    next();
  }


module.exports = {
    list,
    create,
    read,
    update,
    validateDish,
    validateDishUpdate,

};
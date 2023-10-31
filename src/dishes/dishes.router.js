const router = require("express").Router();
const controller = require("./dishes.controller"); 

router.route("/").get(controller.list);

router.route("/:dishId")
  .all(controller.dishExists)  
  .get(controller.read)
  .put(controller.validateDishUpdate, controller.update);

module.exports = router;

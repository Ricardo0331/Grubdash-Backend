const router = require("express").Router();
const controller = require("./orders.controller"); 
const { validateOrderData } = require("./orders.controller")



router
    .router("/")
    .get(controller.list)
    .post(validateOrderData, controller.create);

router
    .route("/:orderId")
    .get(controller.orderExist, controller.read)
    .put(validateOrderData, controller.create)
    .delete(controller.destroy)


module.exports = router;

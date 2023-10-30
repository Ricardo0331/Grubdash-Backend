const router = require("express").Router();
const controller = require("./orders.controller"); 


router.route("/").get(controller.list);

router
    .router("/")
    .get(controller.list)
    .post(controller.create);

router
    .route("/:orderId")
    .get(controller.orderExist, controller.read)


module.exports = router;

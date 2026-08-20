const express = require('express');
const router = express.Router();

const userController = require('./user.controller');
const validate = require("../../middlewares/validation.middleware");
const asyncHandler = require("../../utils/async-handler");

const {
    createUserSchema,
    bulkUserSchema,
    updateUserSchema,
    deleteUserSchema,
    findUserByIdSchema
    } = require('./user.validation');

router.post(
    '/create', 
    validate(createUserSchema), 
    asyncHandler(userController.createUser)
);


router.post(
    '/create-bulk',
    validate(bulkUserSchema),
    asyncHandler(userController.uploadBulkUsers)
);

router.get(
    '/:id', 
    validate(findUserByIdSchema),
    asyncHandler(userController.getUserById)
);

router.patch(
    '/update/:id',
    validate(updateUserSchema),
    asyncHandler(userController.updateUser)
);

router.delete(
    '/delete/:id',
    validate(deleteUserSchema),
    asyncHandler(userController.deleteUser)
);

module.exports = router;
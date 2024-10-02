const express = require('express');
const {
    createCategoryHandler,
    getCategoriesHandler,
    getCategoryHandler,
    updateCategoryHandler,
    deleteCategoryHandler
} = require('../../controllers/v1/categoryController');
const validateToken = require('../../middleware/auth');

const router = express.Router();

router.post('', validateToken, createCategoryHandler);
router.get('', getCategoriesHandler);
router.get('/:id', getCategoryHandler);
router.put('/:id', validateToken, updateCategoryHandler);
router.delete('/:id', validateToken, deleteCategoryHandler);

module.exports = router;
const Category = require('../../models/Category');

// @desc Create Category
// @route POST /v1/categories
// @access Private
const createCategoryHandler = async (req, res) => {
    try {
        const { name } = req.body;
        if (typeof name !== 'string') {
            return res.status(400).json({
                message: 'Name must be a string',
            });
        }

        // check if category with name exist
        const existingCategory = await Category.findOne({
            where: {
                name,
            },
        });
        if (existingCategory) {
            return res.status(400).json({
                message: 'Category already exists',
            });
        }

        const category = await Category.create({
            name,
        });

        res.status(201).json(category);
        return;
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// @desc Retrieve Categories
// @route GET /v1/categories
// @access Public
const getCategoriesHandler = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// @desc Retrieve Category
// @route GET /v1/categories/:id
// @access Public
const getCategoryHandler = async (req, res) => {
    try {
        const { id } = req.params;
        if (typeof id !== 'string') {
            return res.status(400).json({
                message: 'Id must be a string',
            });
        }

        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({
                message: 'Category not found',
            });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// @desc Update Category
// @route PUT /v1/categories/:id
// @access Private
const updateCategoryHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (typeof id !== 'string') {
            return res.status(400).json({
                message: 'Id must be a string',
            });
        }

        if (typeof name !== 'string') {
            return res.status(400).json({
                message: 'Name must be a string',
            });
        }

        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({
                message: 'Category not found',
            });
        }

        //update category
        category.name = name;
        await category.save();

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// @desc Delete Category
// @route DELETE /v1/categories/:id
// @access Private
const deleteCategoryHandler = async (req, res) => {
    try {
        const { id } = req.params;
        if (typeof id !== 'string') {
            return res.status(400).json({
                message: 'Id must be a string',
            });
        }

        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({
                message: 'Category not found',
            });
        }

        await category.destroy();
        res.status(204).json();
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    createCategoryHandler,
    getCategoriesHandler,
    getCategoryHandler,
    updateCategoryHandler,
    deleteCategoryHandler,
};
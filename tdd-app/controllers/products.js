const productModel = require('../models/Product');

exports.createProduct = async (req, res, next) => {
    try {
        const createdProduct = await productModel.create(req.body);
        res.status(201).json(createdProduct);
    } catch (error) {
        // next 함수를 이용해 Error Handling Middleware로 전달
        next(error);
    }
};

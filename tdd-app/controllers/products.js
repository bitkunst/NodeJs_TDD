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

exports.getProducts = async (req, res, next) => {
    try {
        const allProducts = await productModel.find({});
        res.status(200).json(allProducts);
    } catch (error) {
        next(error);
    }
};

exports.getProductById = async (req, res, next) => {
    try {
        const product = await productModel.findById(req.params.productId);
        if (!product) {
            return res.status(404).send();
        }

        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const updatedProduct = await productModel.findByIdAndUpdate(req.params.productId, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).send();
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const deletedProduct = await productModel.findByIdAndDelete(req.params.productId);
        if (!deletedProduct) {
            return res.status(404).send();
        }

        res.status(200).json(deletedProduct);
    } catch (error) {
        next(error);
    }
};

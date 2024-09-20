const httpMocks = require('node-mocks-http');
const productsController = require('../../controllers/products');
const productModel = require('../../models/Product');
const newProduct = require('../data/new-product.json');
const allProducts = require('../data/all-products.json');

// jest.fn()은 spy 역할을 한다 -> 호출 정보를 기록하고, 호출 여부를 확인할 수 있다
productModel.create = jest.fn();
productModel.find = jest.fn();
productModel.findById = jest.fn();
productModel.findByIdAndUpdate = jest.fn();
productModel.findByIdAndDelete = jest.fn();

const productId = '66ec2c049f1c59f76a14390a';
const updatedProduct = { name: 'updated name', description: 'updated description' };
let req, res, next;
// Global beforeEach()
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});

describe('Products Controller Create', () => {
    beforeEach(() => {
        req.body = newProduct;
    });

    it('should have a createProduct function', () => {
        expect(typeof productsController.createProduct).toBe('function');
    });

    it('should call ProductModel.create', async () => {
        await productsController.createProduct(req, res, next);

        expect(productModel.create).toBeCalled();
        expect(productModel.create).toBeCalledWith(newProduct);
    });

    it('should return 201 response code', async () => {
        await productsController.createProduct(req, res, next);

        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy(); // res.send() 테스트
    });

    it('should return json body in response', async () => {
        // 어떠한 결과값(return)을 반환할지 직접 설정할 때는 mockReturnValue()를 사용한다
        productModel.create.mockReturnValue(newProduct);
        await productsController.createProduct(req, res, next);

        expect(res._getJSONData()).toStrictEqual(newProduct);
    });

    it('should handle errors', async () => {
        // DB에서 처리하는 부분은 문제가 없다는 것을 가정하는 단위 테스트이기 때문에
        // DB에서 처리하는 에러 메시지 부분은 Mock 함수를 이용해서 처리 -> 임의의 에러 메시지 생성
        const errorMessage = { message: 'description property missing' };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.create.mockReturnValue(rejectedPromise);
        await productsController.createProduct(req, res, next);

        expect(next).toBeCalledWith(errorMessage);
    });
});

describe('Products Controller Get', () => {
    it('should have a getProducts function', () => {
        expect(typeof productsController.getProducts).toBe('function');
    });

    it('should call ProductModel.find({})', async () => {
        await productsController.getProducts(req, res, next);

        expect(productModel.find).toHaveBeenCalledWith({});
    });

    it('should return 200 response', async () => {
        await productsController.getProducts(req, res, next);

        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should return json body in response', async () => {
        productModel.find.mockReturnValue(allProducts);
        await productsController.getProducts(req, res, next);

        expect(res._getJSONData()).toStrictEqual(allProducts);
    });

    it('should handle errors', async () => {
        const errorMessage = { message: 'Error finding products data' };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.find.mockReturnValue(rejectedPromise);
        await productsController.getProducts(req, res, next);

        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});

describe('Products Controller GetById', () => {
    it('should have a getProductById function', () => {
        expect(typeof productsController.getProductById).toBe('function');
    });

    it('should call ProductModel.findById', async () => {
        req.params.productId = productId;
        await productsController.getProductById(req, res, next);

        expect(productModel.findById).toBeCalledWith(productId);
    });

    it('should return json body and response code 200', async () => {
        productModel.findById.mockReturnValue(newProduct);
        await productsController.getProductById(req, res, next);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(newProduct);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should return 404 when item does not exist', async () => {
        productModel.findById.mockReturnValue(null);
        await productsController.getProductById(req, res, next);

        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should handle errors', async () => {
        const errorMessage = { message: 'Error finding product data' };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.findById.mockReturnValue(rejectedPromise);
        await productsController.getProductById(req, res, next);

        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});

describe('Products Controller Update', () => {
    it('should have an updateProduct function', () => {
        expect(typeof productsController.updateProduct).toBe('function');
    });

    it('should call productModel.findByIdAndUpdate', async () => {
        req.params.productId = productId;
        req.body = updatedProduct;
        await productsController.updateProduct(req, res, next);

        expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(productId, updatedProduct, { new: true });
    });

    it('should return json body and response code 200', async () => {
        req.params.productId = productId;
        req.body = updatedProduct;
        productModel.findByIdAndUpdate.mockReturnValue(updatedProduct);
        await productsController.updateProduct(req, res, next);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(updatedProduct);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should handle 404 when item does not exist', async () => {
        productModel.findByIdAndUpdate.mockReturnValue(null);
        await productsController.updateProduct(req, res, next);

        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should handle errors', async () => {
        const errorMessage = { message: 'Error updating product data' };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
        await productsController.updateProduct(req, res, next);

        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});

describe('Products Controller Delete', () => {
    it('should have a deleteProduct function', () => {
        expect(typeof productsController.deleteProduct).toBe('function');
    });

    it('should call productModel.findByIdAndDelete', async () => {
        req.params.productId = productId;
        await productsController.deleteProduct(req, res, next);

        expect(productModel.findByIdAndDelete).toHaveBeenCalledWith(productId);
    });

    it('should return 200 response', async () => {
        const deletedProduct = { name: 'deleted product', description: 'it is deleted' };
        productModel.findByIdAndDelete.mockReturnValue(deletedProduct);
        await productsController.deleteProduct(req, res, next);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(deletedProduct);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should return 404 when item does not exist', async () => {
        productModel.findByIdAndDelete.mockReturnValue(null);
        await productsController.deleteProduct(req, res, next);

        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should handle errors', async () => {
        const errorMessage = { message: 'Error deleting product data' };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
        await productsController.deleteProduct(req, res, next);

        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});

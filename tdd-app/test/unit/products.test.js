const httpMocks = require('node-mocks-http');
const productsController = require('../../controllers/products');
const productModel = require('../../models/Product');
const newProduct = require('../data/new-product.json');

// jest.fn()은 spy 역할을 한다
productModel.create = jest.fn();

let req, res, next;
// Global beforeEach()
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = null;
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
});

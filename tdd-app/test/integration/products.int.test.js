const request = require('supertest');
const app = require('../../server');
const newProduct = require('../data/new-product.json');

let firstProduct;

describe('Server Test', () => {
    it('POST /api/products', async () => {
        const response = await request(app).post('/api/products').send(newProduct);

        expect(response.statusCode).toBe(201);
        expect(response.body.name).toBe(newProduct.name);
        expect(response.body.description).toBe(newProduct.description);
    });

    it('should return 500 on POST /api/products', async () => {
        const response = await request(app).post('/api/products').send({ name: 'phone' });

        expect(response.statusCode).toBe(500);
        expect(response.body).toStrictEqual({
            message: 'Product validation failed: description: Path `description` is required.',
        });
    });

    it('GET /api/products', async () => {
        const response = await request(app).get('/api/products');
        firstProduct = response.body[0];

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body[0].name).toBeDefined();
        expect(response.body[0].description).toBeDefined();
    });

    it('GET /api/products/:productId', async () => {
        const response = await request(app).get(`/api/products/${firstProduct._id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBeDefined();
        expect(response.body.description).toBeDefined();
    });

    it('GET id does not exist /api/products/:productId', async () => {
        const response = await request(app).get('/api/products/60ec2c049f1c59f76a14770b');

        expect(response.statusCode).toBe(404);
    });

    it('PUT /api/products/:productId', async () => {
        const response = await request(app)
            .put(`/api/products/${firstProduct._id}`)
            .send({ name: 'updated name', description: 'updated description' });

        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe('updated name');
        expect(response.body.description).toBe('updated description');
    });

    it('should return 404 on PUT /api/products/:productId', async () => {
        const response = await request(app)
            .put('/api/products/60ec2c049f1c59f76a14770b')
            .send({ name: 'updated name', description: 'updated description' });

        expect(response.statusCode).toBe(404);
    });

    it('DELETE /api/products/:productId', async () => {
        const response = await request(app).delete(`/api/products/${firstProduct._id}`);

        expect(response.statusCode).toBe(200);
    });

    it('DELETE id does not exist /api/products/:productId', async () => {
        const response = await request(app).delete('/api/products/60ec2c049f1c59f76a14770b');

        expect(response.statusCode).toBe(404);
    });
});

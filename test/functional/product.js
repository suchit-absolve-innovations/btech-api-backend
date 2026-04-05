/* eslint-disable global-require */
const path = require('path');
const config = require('config');
const version = config.get('version');
let adminToken;
let sellerProduct;
const productData = {
  title: 'Samsung s10+',
  price: 73.5,
  salePrice: 50.87,
  discount: 20.09,
  info: {
    color: 'black',
    memory: '8gb',
    storage: '128GB',
    quantity: 20
  }
};
let memberToken;
let imageId;
let sellerToken;
let buyerToken;
let productId;
let categoryId;
describe('PRODUCT', async () => {
  before(async () => {
    const accessTokenFacade = require('../../models/accessToken/facade');
    const memberFacade = require('../../models/member/facade');
    const sellerInfoFacade = require('../../models/sellerInfo/facade');
    const member = await memberFacade.create({
      email: 'nikhilmisra63+2@gmail.com',
      firstName: 'Nikhil',
      lastName: 'category'
    });
    memberToken = await member.createAccessToken();
    const seller = await memberFacade.create({
      email: 'seller_product@gmail.com',
      firstName: 'seller'
    });
    await seller.addRole('seller');
    await sellerInfoFacade.create({ companyName: 'test43', memberId: seller.id, companyRegId: 2345678889 });
    const buyer = await memberFacade.create({
      email: 'buyer@gmail.com',
      firstName: 'buyer'
    });
    await buyer.addRole('buyer');
    sellerToken = await seller.createAccessToken();
    buyerToken = await buyer.createAccessToken();
    adminToken = await accessTokenFacade.findOne({ where: { memberId: pMember.id } });
  });
  it('Should be able to add category', async () => {
    const res = await request
      .post(`/${version}/Category`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .send({ name: 'Mobile', type: 'electronics' })
      .expect(200);
    categoryId = res.body.id;
  });
  it('Should be able to add product', async () => {
    productData.categoryId = categoryId;
    productData.sellerId = sellerToken.memberId;
    const res = await request
      .post(`/${version}/Product`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .send(productData)
      .expect(200);
    productId = res.body.id;
  });
  it('Buyer should be able to add product like', async () => {
    await request
      .post(`/${version}/Product/LikeOrDislike`)
      .set({ Authorization: buyerToken.accessToken, id: buyerToken.memberId })
      .query({ productId })
      .expect(200);
  });
  it('Should not be able to add extra field in product info', async () => {
    productData.categoryId = categoryId;
    await request
      .post(`/${version}/Product`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .send(productData)
      .expect(200);
  });
  it('Should not be able to add product with out title', async () => {
    delete productData.title;
    await request
      .post(`/${version}/Product`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .send(productData)
      .expect(422);
  });
  it('Normal User can not be able to add product', async () => {
    productData.title = 'second Phone';
    await request
      .post(`/${version}/Product`)
      .set({ Authorization: memberToken.accessToken, id: memberToken.memberId })
      .send(productData)
      .expect(401);
  });
  it('Seller should be able to add product', async () => {
    productData.title = 'second Phone';
    await request
      .post(`/${version}/Product`)
      .set({ Authorization: sellerToken.accessToken, id: sellerToken.memberId })
      .send(productData)
      .expect(200);
  });
  it('Seller should be able to get own product only', async () => {
    const res = await request
      .get(`/${version}/Product/Own/Products`)
      .set({ Authorization: sellerToken.accessToken, id: sellerToken.memberId })
      .expect(200);
    [sellerProduct] = res.body.products;
  });
  it('Seller should be able to update only his product by id', async () => {
    await request
      .put(`/${version}/Product/${sellerProduct.id}`)
      .set({ Authorization: sellerToken.accessToken, id: sellerToken.memberId })
      .send(productData)
      .expect(204);
  });
  it('Seller should be able to get own product only', async () => {
    await request
      .get(`/${version}/Product/Own/Products`)
      .set({ Authorization: sellerToken.accessToken, id: sellerToken.memberId })
      .expect(200);
  });
  it('Seller should be able to update only his product by id', async () => {
    await request
      .put(`/${version}/Product/${sellerProduct.id}`)
      .set({ Authorization: sellerToken.accessToken, id: sellerToken.memberId })
      .send(productData)
      .expect(204);
  });
  it('Seller should not be able to update only his product by id', async () => {
    productData.info = { color: 'Black', description: 'new arrivals', rating: 5 };
    await request
      .put(`/${version}/Product/${sellerProduct.id}`)
      .set({ Authorization: sellerToken.accessToken, id: sellerToken.memberId })
      .send(productData)
      .expect(204);
  });
  it('Seller should  be able to delete his product only', async () => {
    await request
      .delete(`/${version}/Product/${sellerProduct.id}`)
      .set({ Authorization: sellerToken.accessToken, id: sellerToken.memberId })
      .expect(204);
  });
  it('Seller should be able to get own product only', async () => {
    const res = await request
      .get(`/${version}/Product/Own/Products`)
      .set({ Authorization: sellerToken.accessToken, id: sellerToken.memberId })
      .expect(200);
    expect(res.body.products.length).to.be.equal(3);
  });
  it('Should be able to get all products', async () => {
    await request
      .get(`/${version}/Product`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .expect(200);
  });
  it('Normal member Should be able to get all products', async () => {
    await request
      .get(`/${version}/Product`)
      .set({ Authorization: memberToken.accessToken, id: memberToken.memberId })
      .expect(200);
  });
  it('Should be able to get product by id', async () => {
    await request
      .get(`/${version}/Product/${productId}`)
      .set({ Authorization: memberToken.accessToken, id: memberToken.memberId })
      .expect(200);
  });
  it('Should be able to update product by id', async () => {
    productData.title = 'OnePlus 7T';
    productData.price = 40000.0;
    productData.discount = 40.05;
    productData.info = { color: 'Black', desc: 'new arrivals', quantity: 1000 };
    await request
      .put(`/${version}/Product/${productId}`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .send(productData)
      .expect(200);
  });
  it('Admin Should be able to add image of product', async () => {
    const p = path.join(__dirname, '../fixtures/12345.jpeg');
    const res = await request
      .post(`/${version}/Product/Image/${productId}`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .attach('image', p)
      .expect(200);
    imageId = res.body.id;
  });
  it('Admin Should not be able to add image of product with wrong product id', async () => {
    const p = path.join(__dirname, '../fixtures/12345.jpeg');
    await request
      .post(`/${version}/Product/Image/12345`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .attach('image', p)
      .field({ isFeatured: false })
      .expect(204);
  });
  it('Should be able to get product image by id', async () => {
    await request
      .get(`/${version}/Product/Image/getById/${imageId}`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .expect(200);
  });
  it('Should be able to get all images of product by productId', async () => {
    await request
      .get(`/${version}/Product/Image/${productId}`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .expect(200);
  });
  it('Should be able to delete product image by id', async () => {
    await request
      .delete(`/${version}/Product/Image/getById/${imageId}`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .expect(200);
  });
  it('Normal User can not be able to delete product', async () => {
    await request
      .delete(`/${version}/Product/${productId}`)
      .set({ Authorization: memberToken.accessToken, id: memberToken.memberId })
      .expect(401);
  });
  it('Should be able to delete product by id', async () => {
    await request
      .delete(`/${version}/Product/${productId}`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .expect(200);
  });
  it('Should be able to add product', async () => {
    productData.categoryId = categoryId;
    const res = await request
      .post(`/${version}/Product`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .send(productData)
      .expect(200);
    productId = res.body.id;
  });
  it('Buyer should be able to like a product', async () => {
    await request
      .post(`/${version}/Product/LikeOrDislike`)
      .set({ Authorization: buyerToken.accessToken, id: buyerToken.memberId })
      .query({ productId })
      .expect(200);
  });
  it('Buyer should be able to dislike a product', async () => {
    await request
      .post(`/${version}/Product/LikeOrDislike`)
      .set({ Authorization: buyerToken.accessToken, id: buyerToken.memberId })
      .query({ productId })
      .expect(200);
  });
  it('should be able to get products by category id', async () => {
    await request
      .get(`/${version}/Product/Category/${categoryId}`)
      .set({ Authorization: buyerToken.accessToken, id: buyerToken.memberId })
      .expect(200);
  });
  it('should be able to search products by title', async () => {
    const title = 'Samsung';
    const res = await request
      .get(`/${version}/Product/Search/${title}`)
      .set({ Authorization: buyerToken.accessToken, id: buyerToken.memberId })
      .query({ title })
      .expect(200);
    expect(res.body.products[0].title).to.be.equals('Samsung s10+');
  });
  it('should be able to get products by product ids', async () => {
    await request
      .post(`/${version}/Product/Cart/ByIds`)
      .set({ Authorization: buyerToken.accessToken, id: buyerToken.memberId })
      .send({ productIds: [categoryId] })
      .expect(200);
  });
  it('should be able to get Featured products', async () => {
    await request
      .get(`/${version}/Product/Featured/Product`)
      .set({ Authorization: buyerToken.accessToken, id: buyerToken.memberId })
      .expect(200);
  });
  // // it('Should be able to delete category by id', async () => {
  // //   await request
  // //     .delete(`/${version}/Category/${categoryId}`)
  // //     .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
  // //     .expect(200);
  // // });
});

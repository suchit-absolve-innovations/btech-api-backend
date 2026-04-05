/* eslint-disable global-require */
const config = require('config');
const { expect } = require('chai');
const version = config.get('version');
let token;
let token1;
let productId;
let productId1;
let categoryId;
let orderId;
let couponId;
let addressId1;
const stripeEvent = {
  id: 'evt_1H6DkSK9dSwgzi5oGzVJ1gOR',
  object: 'event',
  data: {
    object: {
      id: 'pi_1H6Dk0K9dSwgzi5onslz5uXK',
      object: 'payment_intent',
      amount: 199,
      amount_capturable: 0,
      amount_received: 199,
      application: null,
      application_fee_amount: null,
      canceled_at: null,
      cancellation_reason: null,
      capture_method: 'automatic'
    }
  },
  type: 'payment_intent.failed'
};
const productData = [
  {
    title: 'Samsung s10+',
    price: 73.5,
    salePrice: 50.87,
    discount: 20.09,
    info: {
      color: 'black',
      memory: '8gb',
      storage: '128GB',
      desc: 'Samsung s10+ in black color is awsome',
      quantity: 5
    }
  },
  {
    title: 'Samsung s20+',
    price: 73.5,
    salePrice: 50.87,
    discount: 20.09,
    info: {
      color: 'black',
      memory: '8gb',
      storage: '128GB',
      desc: 'Samsung s10+ in black color is awsome',
      quantity: 5
    }
  }
];
const data = {
  firstName: 'Nikhil',
  username: 'Rajaaat',
  lastName: 'Mishra',
  email: 'nikhil+25@cropsly.com',
  contactNumber: '+918931097391',
  password: 'zxcvbnms',
  role: 'buyer'
};

const address = {
  countryId: 1,
  name: 'Nik',
  number: '+918931097382',
  pinCode: 140403,
  address: 'vip road',
  city: 'zirakpur',
  state: 64,
  landmark: 'rail vihar',
  alternateNumber: '+918931097382',
  type: 'HOME',
  status: true
};

let addressId;

let adminToken;
let memberFacade;
let sellerToken;

describe('CART', () => {
  before(async () => {
    memberFacade = require('../../models/member/facade');
    const accessTokenFacade = require('../../models/accessToken/facade');
    adminToken = await accessTokenFacade.findOne({ where: { memberId: pMember.id } });
    const sellerInfoFacade = require('../../models/sellerInfo/facade');
    const seller = await memberFacade.create({
      email: 'seller@gmail.com',
      firstName: 'seller'
    });
    await seller.addRole('seller');
    sellerToken = await seller.createAccessToken();
    await sellerInfoFacade.create({ companyName: 'test', memberId: seller.id, companyRegId: 23456789 });
  });
  it('Should be able to signUp', async () => {
    await request
      .post(`/${version}/Member`)
      .send(data)
      .expect(200);
  });
  it('Should be able to verify email', async () => {
    memberFacade = require('../../models/member/facade');
    const member = await memberFacade.findOne({
      where: { email: 'nikhil+25@cropsly.com' }
    });
    await request
      .post(`/${version}/Member/VerifyEmail`)
      .send({ token: member.otp, id: member.id })
      .expect(200);
  });
  it('it should be able to login account', async () => {
    const res = await request
      .post(`/${version}/oAuth/Login`)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        token: 'nikhil+25@cropsly.com',
        password: 'zxcvbnms',
        grant_type: 'password',
        deviceType: 'web',
        deviceToken: 1234567890
      })
      .expect(200);
    token = res.body;
  });
  it('Should be able to signUp', async () => {
    await request
      .post(`/${version}/Member`)
      .send({
        firstName: 'Nikhil',
        username: 'Rajaadat',
        lastName: 'Mishra',
        email: 'nikhil+26@cropsly.com',
        contactNumber: '+918931097379',
        password: 'zxcvbnms',
        role: 'buyer'
      })
      .expect(200);
  });
  it('Should be able to verify email', async () => {
    memberFacade = require('../../models/member/facade');
    const member = await memberFacade.findOne({
      where: { email: 'nikhil+26@cropsly.com' }
    });
    await request
      .post(`/${version}/Member/VerifyEmail`)
      .send({ token: member.otp, id: member.id })
      .expect(200);
  });
  it('it should be able to login account', async () => {
    const res = await request
      .post(`/${version}/oAuth/Login`)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        token: 'nikhil+26@cropsly.com',
        password: 'zxcvbnms',
        grant_type: 'password',
        deviceType: 'web',
        deviceToken: 1234567890
      })
      .expect(200);
    token1 = res.body;
  });
  it('Should be able to add category', async () => {
    const res = await request
      .post(`/${version}/Category`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .send({ name: 'Mobile', type: 'electronics' })
      .expect(200);
    categoryId = res.body.id;
  });
  it('Should be able to add coupon', async () => {
    const res = await request
      .post(`/${version}/Coupon`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .send({
        name: 'Fashion',
        type: 'clothes',
        code: 'VGS',
        maxAmount: 500,
        percentage: 70
      })
      .expect(200);
    couponId = res.body.id;
  });
  it('Should be able to map category and coupon', async () => {
    await request
      .post(`/${version}/Coupon/Category/Mapping`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .send({
        validFrom: '2020-03-17T06:47:22.567Z',
        validTill: '2021-05-17T06:47:22.567Z',
        couponId,
        categoryId,
        minCartValue: 200.0
      })
      .expect(200);
  });
  it('Should be able to add product', async () => {
    productData[0].categoryId = categoryId;
    productData[0].sellerId = sellerToken.memberId;
    const res = await request
      .post(`/${version}/Product`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId, isAdmin: true })
      .send(productData[0])
      .expect(200);
    productId = res.body.id;
  });
  it('Should be able to add another product', async () => {
    productData[1].categoryId = categoryId;
    productData[1].sellerId = sellerToken.memberId;
    const res = await request
      .post(`/${version}/Product`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .send(productData[1])
      .expect(200);
    productId1 = res.body.id;
  });
  it('Should be able to add product in cart', async () => {
    await request
      .post(`/${version}/Cart`)
      .set({ Authorization: token.accessToken, id: token.memberId })
      .send({ productId, quantity: 2 })
      .expect(200);
  });
  it('Should be able to add another product in cart', async () => {
    await request
      .post(`/${version}/Cart`)
      .set({ Authorization: token.accessToken, id: token.memberId })
      .send({ productId: productId1, quantity: 2 })
      .expect(200);
  });
  it('Should not be able to add product more than quantity available in cart', async () => {
    await request
      .post(`/${version}/Cart`)
      .set({ Authorization: token.accessToken, id: token.memberId })
      .send({ productId, quantity: 22 })
      .expect(400);
  });
  it('Increase quantity if same product', async () => {
    const res = await request
      .post(`/${version}/Cart`)
      .set({ Authorization: token.accessToken, id: token.memberId })
      .send({ productId, quantity: 2 })
      .expect(200);
    expect(res.body.quantity).to.be.equal(4);
  });
  it('update quantity for the product', async () => {
    const res = await request
      .put(`/${version}/Cart/${productId}`)
      .set({ Authorization: token.accessToken, id: token.memberId })
      .send({ quantity: 1 })
      .expect(200);
    expect(res.body.quantity).to.be.equal(1);
  });
  it('should not able to update quantity for the product more than available ', async () => {
    await request
      .put(`/${version}/Cart/${productId}`)
      .set({ Authorization: token.accessToken, id: token.memberId })
      .send({ quantity: 6 })
      .expect(400);
  });

  it('buyer should be able to add address account', async () => {
    const res = await request
      .post(`/${version}/Address`)
      .set({ Authorization: token.accessToken, id: token.memberId })
      .send(address)
      .expect(200);
    addressId = res.body.id;
  });
  it('another member should be able to add address account', async () => {
    const res = await request
      .post(`/${version}/Address`)
      .set({ Authorization: token1.accessToken, id: token1.memberId })
      .send(address)
      .expect(200);
    addressId1 = res.body.id;
  });

  it('should be able to place order from his cart', async () => {
    const res = await request
      .post(`/${version}/Order`)
      .set({ Authorization: token.accessToken, id: token.memberId })
      .send({ addressId, couponId, paymentType: 'COD' })
      .expect(200);
    orderId = res.body.id;
  });
  it('Admin should be able to get order by status', async () => {
    await request
      .get(`/${version}/Order/Admin/All`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId, isAdmin: true })
      .query({ status: 'PENDING' })
      .expect(200);
  });
  it('Admin should be able to get orders by date', async () => {
    await request
      .get(`/${version}/Order/Admin/All`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId, isAdmin: true })
      .query({ startDate: '2020-06-07T17:55:34.000Z', endDate: '2020-06-07T17:55:34.000Z' })
      .expect(200);
  });
  it('Admin should not be able to get order by date if one of date is missing', async () => {
    await request
      .get(`/${version}/Order/Admin/All`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId, isAdmin: true })
      .query({ startDate: '2020-06-07T17:55:34.000Z' })
      .expect(400);
  });
  it('Admin should be able to get order by category id', async () => {
    const res = await request
      .get(`/${version}/Order/Admin/All`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId, isAdmin: true })
      .query({ categoryId })
      .expect(200);
    expect(res.body.length).to.be.equal(1);
  });
  it('Admin should be able to get order by category empty response', async () => {
    const res = await request
      .get(`/${version}/Order/Admin/All`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId, isAdmin: true })
      .query({ categoryId: 123456789 })
      .expect(200);
    expect(res.body.length).to.be.equal(0);
  });
  it('Admin should be able to get order by category', async () => {
    const res = await request
      .get(`/${version}/Order/Admin/All`)
      .set({ Authorization: sellerToken.accessToken, id: sellerToken.memberId, isAdmin: true })
      .query({ categoryId })
      .expect(200);
    expect(res.body.length).to.be.equal(1);
  });
  it('Admin should be able to get order by status', async () => {
    const res = await request
      .get(`/${version}/Order/Admin/All`)
      .set({ Authorization: sellerToken.accessToken, id: sellerToken.memberId, isAdmin: true })
      .query({ categoryId: '567890' })
      .expect(200);
    expect(res.body.length).to.be.equal(0);
  });
  it('Admin should be able to get order by by date status and category', async () => {
    const res = await request
      .get(`/${version}/Order/Admin/All`)
      .set({ Authorization: sellerToken.accessToken, id: sellerToken.memberId, isAdmin: true })
      .query({
        categoryId,
        status: 'PENDING',
        startDate: '2020-06-07T17:55:34.000Z',
        endDate: '2021-06-07T17:55:34.000Z'
      })
      .expect(200);
    expect(res.body.length).to.be.equal(0);
  });
  it('Admin should be able to get order by categoryID and date range', async () => {
    const res = await request
      .get(`/${version}/Order/Admin/All`)
      .set({ Authorization: sellerToken.accessToken, id: sellerToken.memberId, isAdmin: true })
      .query({
        categoryId,
        startDate: '2020-05-07T17:55:34.000Z',
        endDate: '2020-05-07T17:55:34.000Z'
      })
      .expect(200);
    expect(res.body.length).to.be.equal(0);
  });
  it('Admin should be able to get order by all filters', async () => {
    const res = await request
      .get(`/${version}/Order/Admin/All`)
      .set({ Authorization: sellerToken.accessToken, id: sellerToken.memberId })
      .query({
        categoryId: '34567890',
        status: 'PENDING',
        startDate: '2020-06-07T17:55:34.000Z',
        endDate: '2021-06-07T17:55:34.000Z'
      })
      .expect(200);
    expect(res.body.length).to.be.equal(0);
  });
  it('Should be able to add product in cart if product', async () => {
    await request
      .post(`/${version}/Cart`)
      .set({ Authorization: token1.accessToken, id: token1.memberId })
      .send({ productId, quantity: 2 })
      .expect(200);
  });
  it('Should be able to add product in cart from product array', async () => {
    await request
      .post(`/${version}/Cart/Offline`)
      .set({ Authorization: token1.accessToken, id: token1.memberId })
      .send({ products: [{ productId, quantity: 1 }] })
      .expect(200);
  });
  it('Check total product quantity before placing a cod order', async () => {
    const res = await request
      .get(`/${version}/Product/${productId}`)
      .set({ Authorization: token1.accessToken, id: token1.memberId })
      .expect(200);
    expect(res.body.products[0].info.quantity).to.be.equal(4);
  });
  it('should be able to place a cod order from his cart', async () => {
    await request
      .post(`/${version}/Order`)
      .set({ Authorization: token1.accessToken, id: token1.memberId })
      .send({ addressId: addressId1, paymentType: 'COD' })
      .expect(200);
  });
  it('check product quantity should deducted after a COD order placed', async () => {
    const res = await request
      .get(`/${version}/Product/${productId}`)
      .set({ Authorization: token1.accessToken, id: token1.memberId })
      .expect(200);
    expect(res.body.products[0].info.quantity).to.be.equal(1);
  });
  it('Should not be able to add product in cart if product after product is out of stock', async () => {
    await request
      .post(`/${version}/Cart`)
      .set({ Authorization: token1.accessToken, id: token1.memberId })
      .send({ productId, quantity: 2 })
      .expect(400);
  });
  it('Should be able to add product in cart if product', async () => {
    await request
      .post(`/${version}/Cart`)
      .set({ Authorization: token1.accessToken, id: token1.memberId })
      .send({ productId, quantity: 1 })
      .expect(200);
  });
  it('should be able to place a online order from his cart', async () => {
    const res = await request
      .post(`/${version}/Order`)
      .set({ Authorization: token1.accessToken, id: token1.memberId })
      .send({ addressId: addressId1, paymentType: 'ONLINE' })
      .expect(200);
    orderId = res.body.id;
  });
  it('product quantity should not deducted after a Online order placed', async () => {
    const res = await request
      .get(`/${version}/Product/${productId}`)
      .set({ Authorization: token1.accessToken, id: token1.memberId })
      .expect(200);
    expect(res.body.products[0].info.quantity).to.be.equal(1);
  });
  it('should be able add transaction for his own', async () => {
    const res = await request
      .post(`/${version}/Transaction/Initiate/${orderId}`)
      .set({ Authorization: token.accessToken, id: token.memberId })
      .expect(200);
    stripeEvent.data.object.id = res.body.striptTransactionId.id;
  });
  it('product quantity should not deducted after a Online order transaction failed from stripe', async () => {
    const res = await request
      .get(`/${version}/Product/${productId}`)
      .set({ Authorization: token1.accessToken, id: token1.memberId })
      .expect(200);
    expect(res.body.products[0].info.quantity).to.be.equal(1);
  });
  it('should be able validate transaction with failed', async () => {
    await request
      .post(`/${version}/Transaction/Validate`)
      .send(stripeEvent)
      .expect(200);
  });
  it('product quantity should not deducted after a Online order transaction failed from stripe', async () => {
    const res = await request
      .get(`/${version}/Product/${productId}`)
      .set({ Authorization: token1.accessToken, id: token1.memberId })
      .expect(200);
    expect(res.body.products[0].info.quantity).to.be.equal(1);
  });
  it('should be able validate transaction with failed', async () => {
    stripeEvent.type = 'payment_intent.canceled';
    await request
      .post(`/${version}/Transaction/Validate`)
      .send(stripeEvent)
      .expect(200);
  });
  it('should be able validate transaction with succeeded', async () => {
    stripeEvent.type = 'payment_intent.processing';
    await request
      .post(`/${version}/Transaction/Validate`)
      .send(stripeEvent)
      .expect(200);
  });
  it('should be able validate transaction with succeeded', async () => {
    stripeEvent.type = 'payment_intent.succeeded';
    await request
      .post(`/${version}/Transaction/Validate`)
      .send(stripeEvent)
      .expect(200);
  });
  it('product quantity should not deducted after a Online order transaction failed from stripe', async () => {
    const res = await request
      .get(`/${version}/Product/${productId}`)
      .set({ Authorization: token1.accessToken, id: token1.memberId })
      .expect(200);
    expect(res.body.products[0].info.quantity).to.be.equal(0);
  });
  it('should be able to get own order list', async () => {
    await request
      .get(`/${version}/Order`)
      .set({ Authorization: token.accessToken, id: token.memberId })
      .expect(200);
  });
  it('member should be able to get own transaction list', async () => {
    await request
      .get(`/${version}/Transaction`)
      .set({ Authorization: token.accessToken, id: token.memberId })
      .expect(200);
  });

  // it('should be able to delete product from cart', async () => {
  //   await request
  //     .delete(`/${version}/Cart/${productId}`)
  //     .set({ Authorization: token.accessToken, id: token.memberId })
  //     .expect(200);
  // });
  // it('should be able to empty whole cart', async () => {
  //   await request
  //     .delete(`/${version}/Cart`)
  //     .set({ Authorization: token.accessToken, id: token.memberId })
  //     .expect(200);
  // });
});

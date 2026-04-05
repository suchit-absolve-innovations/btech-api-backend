/* eslint-disable global-require */
const config = require('config');
const version = config.get('version');
let adminToken;
let memberToken;
let couponId;
let couponId1;
let categoryId;
describe('COUPON', async () => {
  before(async () => {
    const accessTokenFacade = require('../../models/accessToken/facade');
    const memberFacade = require('../../models/member/facade');
    const member = await memberFacade.create({
      email: 'nikhilmisra63+7@gmail.com',
      firstName: 'Nikhil',
      lastName: 'coupon'
    });
    memberToken = await member.createAccessToken();
    adminToken = await accessTokenFacade.findOne({ where: { memberId: pMember.id } });
  });

  it('Should be able to add category', async () => {
    const res = await request
      .post(`/${version}/Category`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .send({ name: 'Fashion', type: 'clothes' })
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
        maxAmount: 34.9,
        percentage: 50
      })
      .expect(200);
    couponId = res.body.id;
  });
  it('Should be able to second add coupon', async () => {
    const res = await request
      .post(`/${version}/Coupon`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .send({
        name: 'Fashion',
        type: 'clothes',
        code: 'VGST',
        maxAmount: 34.9,
        percentage: 50
      })
      .expect(200);
    couponId1 = res.body.id;
  });
  it('Should not be able to add coupon with out name', async () => {
    await request
      .post(`/${version}/Coupon`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .send({ type: 'clothes', code: 'VGS', amount: 34.9 })
      .expect(422);
  });
  it('Should not be able to add coupon with out code', async () => {
    await request
      .post(`/${version}/Coupon`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .send({ name: 'Fashion', type: 'clothes', maxAmount: 34.9, percentage: 50 })
      .expect(422);
  });
  it('Should not be able to add coupon with out amount', async () => {
    await request
      .post(`/${version}/Coupon`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .send({ name: 'Fashion', type: 'clothes' })
      .expect(422);
  });
  it('Normal User can not be able to add coupon', async () => {
    await request
      .post(`/${version}/Coupon`)
      .set({ Authorization: memberToken.accessToken, id: memberToken.memberId })
      .send({
        name: 'Fashion',
        type: 'clothes',
        code: 'VGS',
        maxAmount: 34.9,
        percentage: 50
      })
      .expect(401);
  });
  it('Should be able to get all Coupons', async () => {
    await request
      .get(`/${version}/Coupon/`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .expect(200);
  });
  it('Should be able to get coupon by id', async () => {
    await request
      .get(`/${version}/Coupon/${couponId}`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .expect(200);
  });
  it('Should be able to update coupon by id', async () => {
    await request
      .put(`/${version}/Coupon/${couponId}`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .send({ name: 'Computer', type: 'electronics' })
      .expect(200);
  });
  it('Should not be able to map category and coupon if validTill date is before validFrom', async () => {
    await request
      .post(`/${version}/Coupon/Category/Mapping`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .send({
        validFrom: '2020-03-17T06:47:22.567Z',
        validTill: '2020-02-17T06:47:22.567Z',
        couponId,
        categoryId,
        minCartValue: 150.0
      })
      .expect(403);
  });
  it('Should be able to map category and coupon', async () => {
    await request
      .post(`/${version}/Coupon/Category/Mapping`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .send({
        validFrom: '2020-03-17T06:47:22.567Z',
        validTill: '2020-05-17T06:47:22.567Z',
        couponId,
        categoryId,
        minCartValue: 150.0
      })
      .expect(200);
  });
  it('Should not be able to map category and coupon if category already has same coupon', async () => {
    await request
      .post(`/${version}/Coupon/Category/Mapping`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .send({
        validFrom: '2020-03-17T06:47:22.567Z',
        validTill: '2020-05-17T06:47:22.567Z',
        couponId,
        categoryId,
        minCartValue: 150.0
      })
      .expect(403);
  });
  let couponMapping;
  it('Should not be able to map category and coupon if category already has same coupon', async () => {
    const res = await request
      .post(`/${version}/Coupon/Category/Mapping`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .send({
        validFrom: '2020-03-17T06:47:22.567Z',
        validTill: '2020-05-17T06:47:22.567Z',
        couponId: couponId1,
        categoryId,
        minCartValue: 150.0
      })
      .expect(200);
      couponMapping = res.body;
  });
  it('Should be able to update mapping', async () => {
    await request
      .put(`/${version}/Coupon/Category/Mapping/${couponMapping.id}`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .send({
        minCartValue: 10.0
      })
      .expect(200);
  });
  it('Should be able to delete coupon by id', async () => {
    await request
      .delete(`/${version}/Coupon/${couponId}`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .expect(200);
  });
});

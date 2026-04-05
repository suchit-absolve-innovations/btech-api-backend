/* eslint-disable global-require */
const config = require('config');
const path = require('path');
const version = config.get('version');
let adminToken;
let memberToken;
let categoryId;
let imageId;
describe('CATEGORY', async () => {
  before(async () => {
    const accessTokenFacade = require('../../models/accessToken/facade');
    const memberFacade = require('../../models/member/facade');
    const member = await memberFacade.create({
      email: 'nikhilmisra63+1@gmail.com',
      firstName: 'Nikhil',
      lastName: 'category'
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
  it('Should not be able to add category with out name', async () => {
    await request
      .post(`/${version}/Category`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .expect(422);
  });
  it('Normal User can not be able to add category', async () => {
    await request
      .post(`/${version}/Category`)
      .set({ Authorization: memberToken.accessToken, id: memberToken.memberId })
      .send({ name: 'Fashion', type: 'electronics' })
      .expect(401);
  });
  it('Should be able to get all categories', async () => {
    await request
      .get(`/${version}/Category/`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .expect(200);
  });
  it('Should be able to get category by id', async () => {
    await request
      .get(`/${version}/Category/${categoryId}`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .expect(200);
  });
  it('Should be able to update category by id', async () => {
    await request
      .put(`/${version}/Category/${categoryId}`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .send({ name: 'Computer', type: 'electronics' })
      .expect(200);
  });
  it('Admin Should be able to add image of category', async () => {
    const p = path.join(__dirname, '../fixtures/12345.jpeg');
    const res = await request
      .post(`/${version}/Category/Image/${categoryId}`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .attach('image', p)
      .field({ isFeatured: false })
      .expect(200);
    imageId = res.body.id;
  });

  it('Admin Should be able to add image of category', async () => {
    const p = path.join(__dirname, '../fixtures/12345.jpeg');
    await request
      .post(`/${version}/Category/Logo/${categoryId}`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .attach('logo', p)
      .expect(200);
  });
  it('Admin Should not be able to add image of category with wrong category id', async () => {
    const p = path.join(__dirname, '../fixtures/12345.jpeg');
    await request
      .post(`/${version}/Category/Image/12345`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .attach('image', p)
      .expect(204);
  });
  it('Should be able to get category image by id', async () => {
    await request
      .get(`/${version}/Category/Image/getById/${imageId}`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .expect(200);
  });

  it('Should be able to get all images of category by categoryId', async () => {
    await request
      .get(`/${version}/Product/Image/${categoryId}`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .expect(200);
  });
  it('Should be able to delete category image by id', async () => {
    await request
      .delete(`/${version}/Category/Image/getById/${imageId}`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .expect(200);
  });
  it('Normal User can not be able to update category', async () => {
    await request
      .put(`/${version}/Category/${categoryId}`)
      .set({ Authorization: memberToken.accessToken, id: memberToken.memberId })
      .send({ name: 'Fashion' })
      .expect(401);
  });
  it('Normal User can not be able to delete category', async () => {
    await request
      .delete(`/${version}/Category/${categoryId}`)
      .set({ Authorization: memberToken.accessToken, id: memberToken.memberId })
      .send({ name: 'Fashion' })
      .expect(401);
  });
  it('Should be able to delete category by id', async () => {
    await request
      .delete(`/${version}/Category/${categoryId}`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .expect(200);
  });
});

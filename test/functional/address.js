/* eslint-disable global-require */
const config = require('config');
const version = config.get('version');
let token;
let addressId;
let addressId1;
const data = {
  firstName: 'Nikhil',
  username: 'Rajatt',
  lastName: 'Mishra',
  email: 'nikhil+233@cropsly.com',
  contactNumber: '+918931097390',
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
  state: 'punjab',
  landmark: 'rail vihar',
  alternateNumber: '+918931097382',
  type: 'HOME',
  status: true
};
let adminToken;
let memberFacade;

describe('ADDRESS', () => {
  before(async () => {
    const accessTokenFacade = require('../../models/accessToken/facade');
    adminToken = await accessTokenFacade.findOne({ where: { memberId: pMember.id } });
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
      where: { email: 'nikhil+233@cropsly.com' }
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
        token: 'nikhil+233@cropsly.com',
        password: 'zxcvbnms',
        grant_type: 'password',
        deviceType: 'web',
        deviceToken: 1234567890
      })
      .expect(200);
    token = res.body;
  });
  it('buyer should be able to add address account', async () => {
    const res = await request
      .post(`/${version}/Address`)
      .set({ Authorization: token.accessToken, id: token.memberId })
      .send(address)
      .expect(200);
    addressId = res.body.id;
  });
  it('buyer should be able to update his address account', async () => {
    const res = await request
      .put(`/${version}/Address/${addressId}`)
      .set({ Authorization: token.accessToken, id: token.memberId })
      .send(address)
      .expect(200);
    addressId = res.body.id;
  });
  it('buyer should be able to update only one field of his address account', async () => {
    const res = await request
      .put(`/${version}/Address/${addressId}`)
      .set({ Authorization: token.accessToken, id: token.memberId })
      .send({ address: 'rail vihar' })
      .expect(200);
    addressId = res.body.id;
  });
  it('buyer should be able to deactivate of his address account', async () => {
    const res = await request
      .put(`/${version}/Address/${addressId}`)
      .set({ Authorization: token.accessToken, id: token.memberId })
      .send({ status: false })
      .expect(200);
    addressId = res.body.id;
  });
  it('a buyer can have more than one address for his account', async () => {
    address.address = 'Chandigarh';
    const res = await request
      .post(`/${version}/Address/`)
      .set({ Authorization: token.accessToken, id: token.memberId })
      .send(address)
      .expect(200);
    addressId1 = res.body.id;
  });
  it('a buyer can get address by id', async () => {
    address.address = 'Chandigarh';
    await request
      .get(`/${version}/Address/${addressId}`)
      .set({ Authorization: token.accessToken, id: token.memberId })
      .send(address)
      .expect(200);
  });
  it('a buyer can get address by id', async () => {
    address.address = 'Chandigarh';
    await request
      .get(`/${version}/Address/${addressId1}`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .send(address)
      .expect(401);
  });
  it('a buyer can delete his own account', async () => {
    address.address = 'Chandigarh';
    await request
      .delete(`/${version}/Address/${addressId}`)
      .set({ Authorization: token.accessToken, id: token.memberId })
      .send(address)
      .expect(200);
  });
});

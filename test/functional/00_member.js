/* eslint-disable global-require */
const config = require('config');
const moment = require('moment');
const path = require('path');
const version = config.get('version');
let token;
let bannerId;
const data = {
  firstName: 'Nikhil',
  username: 'Rajat',
  lastName: 'Mishra',
  email: 'nikhil@cropsly.com',
  contactNumber: '+918931097389',
  password: 'zxcvbnms',
  role: 'buyer'
};
let member;
let adminToken;
let memberFacade;
let categoryId;

describe('MEMBER', () => {
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
  it('Should not be able to signUp with out valid role', async () => {
    data.role = 'wertyuio';
    await request
      .post(`/${version}/Member`)
      .send(data)
      .expect(422);
  });
  it('Should not be able to signUp with admin role', async () => {
    data.role = 'wertyuio';
    await request
      .post(`/${version}/Member`)
      .send(data)
      .expect(422);
  });
  it('Member should not be able to login with invalid grant type', async () => {
    await request
      .post(`/${version}/oAuth/Login`)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        token: 'nikhilmisra63@gmail.com',
        password: 'zxcvbnm',
        grant_type: 'pord',
        deviceType: 'web',
        deviceToken: 1234567890
      })
      .expect(422);
  });
  it('Member should not be able to login with invalid email', async () => {
    await request
      .post(`/${version}/oAuth/Login`)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        token: 'nikhilmisra63.com',
        password: 'zxcvbnm',
        grant_type: 'password',
        deviceType: 'web',
        deviceToken: 1234567890
      })
      .expect(422);
  });
  it('Member should not be able to login with invalid password', async () => {
    await request
      .post(`/${version}/oAuth/Login`)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        token: 'nikhilmisra63@gmail.com',
        password: 'zxcvvbnmghj',
        grant_type: 'password',
        deviceType: 'web',
        deviceToken: 1234567890
      })
      .expect(401);
  });
  it('Should be able to verify email', async () => {
    memberFacade = require('../../models/member/facade');
    const member = await memberFacade.findOne({
      where: { email: 'nikhil@cropsly.com' }
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
        token: 'nikhil@cropsly.com',
        password: 'zxcvbnms',
        grant_type: 'password',
        deviceType: 'web',
        deviceToken: 1234567890
      })
      .expect(200);
    token = res.body;
  });
  it('Should be able to send forgot password email', async () => {
    await request
      .put(`/${version}/Member/ForgotPassword`)
      .send({ email: 'nikhil@cropsly.com' })
      .expect(200);
  });
  it('Should be able to add category', async () => {
    const res = await request
      .post(`/${version}/Category`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .send({ name: 'Mobile', type: 'electronics' })
      .expect(200);
    categoryId = res.body.id;
  });
  it('Should be able to Reset password', async () => {
    member = await memberFacade.findOne({
      where: { email: 'nikhil@cropsly.com' }
    });
    await request
      .put(`/${version}/Member/ResetPassword`)
      .send({ password: '1234567890', token: member.otp, id: member.id })
      .expect(200);
  });
  it('Member should not be able to reset password if link expired', async () => {
    member.otp = '1234567890qwertyuiop';
    member.otpExpireAt = moment()
      .subtract(1, 'day')
      .toISOString();
    await member.save();

    await request
      .put(`/${version}/Member/ResetPassword`)
      .send({ password: '1234567890', token: member.otp, id: member.id })
      .expect(403);
  });

  it('it should be able to Change Password', async () => {
    await request
      .put(`/${version}/Member/ChangePassword`)
      .set({ Authorization: token.accessToken, id: token.memberId })
      .send({ oldPassword: '1234567890', newPassword: 'zxcvbnmss' })
      .expect(200);
  });

  it('it should be able to get your own profile ', async () => {
    await request
      .get(`/${version}/Member/`)
      .set({ Authorization: token.accessToken, id: token.memberId })
      .expect(200);
  });

  it('Should be able to update profile', async () => {
    data.firstName = 'Nik';
    delete data.email;
    data.city = 'Chandigarh';
    data.country = 'INDIA';
    data.zip = 140603;
    data.address = 'vip road';
    await request
      .put(`/${version}/Member`)
      .set('Accept', 'application/json')
      .set({ Authorization: token.accessToken, id: token.memberId })
      .send(data)
      .expect(200);
  });
  it('Should not be able to update or change email status if email is same', async () => {
    data.firstName = 'NikHil';
    await request
      .put(`/${version}/Member`)
      .set('Accept', 'application/json')
      .set({ Authorization: token.accessToken, id: token.memberId })
      .send(data)
      .expect(200);
  });
  it('Should be able to update email and also send email', async () => {
    data.firstName = 'NikHil';
    await request
      .put(`/${version}/Member`)
      .set('Accept', 'application/json')
      .set({ Authorization: token.accessToken, id: token.memberId })
      .send(data)
      .expect(200);
  });
  it('Should be able to logout', async () => {
    await request
      .delete(`/${version}/Member`)
      .set({ Authorization: token.accessToken, id: token.memberId })
      .expect(200);
  });
  it('Admin Should be able to add banner', async () => {
    const p = path.join(__dirname, '../fixtures/12345.jpeg');
    const res = await request
      .post(`/${version}/Member/Banner`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .attach('banner', p)
      .field('name', 'banner1')
      .field('type', 'homePage')
      .field('categoryId', categoryId)
      .expect(200);
    bannerId = res.body.id;
  });
  it('Should be able to get banner by id', async () => {
    await request
      .get(`/${version}/Member/Banner/${bannerId}`)
      .set({ Authorization: token.accessToken, id: token.memberId })
      .expect(200);
  });
  it('Should be able to get all banners', async () => {
    await request
      .get(`/${version}/Member/Banner`)
      .set({ Authorization: token.accessToken, id: token.memberId })
      .expect(200);
  });
  it('Should be able to delete banners', async () => {
    await request
      .delete(`/${version}/Member/Banner/${bannerId}`)
      .set({ Authorization: token.accessToken, id: token.memberId })
      .expect(200);
  });
  it('Admin should be able to get all members', async () => {
    await request
      .get(`/${version}/Member/All?role=buyer`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .expect(200);
  });

  // it('Admin should be able to get all seller', async () => {
  //   await request
  //     .get(`/${version}/Member/Seller?offset=0&limit=10`)
  //     .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
  //     .expect(200);
  // });

  it('Admin should be able to enable or disable all member', async () => {
    await request
      .post(`/${version}/Member/DisableOrEnable`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .send({ memberId: token.memberId, action: 'disable' })
      .expect(200);
  });

  it('member should not be able to login if account is disabled', async () => {
    await request
      .post(`/${version}/oAuth/Login`)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        token: 'nikhil@cropsly.com',
        password: 'zxcvbnmss',
        grant_type: 'password',
        deviceType: 'web',
        deviceToken: 1234567890
      })
      .expect(403);
  });
  it('Admin should be able to enable or disable all member', async () => {
    await request
      .post(`/${version}/Member/DisableOrEnable`)
      .set({ Authorization: adminToken.accessToken, id: adminToken.memberId })
      .send({ memberId: token.memberId, action: 'enable' })
      .expect(200);
  });
  it('member should not be able to login if account is disabled', async () => {
    const res = await request
      .post(`/${version}/oAuth/Login`)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        token: 'nikhil@cropsly.com',
        password: 'zxcvbnmss',
        grant_type: 'password',
        deviceType: 'web',
        deviceToken: 1234567890
      })
      .expect(200);
    token = res.body;
  });
});

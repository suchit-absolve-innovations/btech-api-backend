const _ = require('lodash');
const addressFacade = require('./facade');

class MemberController {
  // Add address

  async add(req, res, next) {
    const {
      countryId,
      name,
      number,
      pinCode,
      address,
      city,
      state,
      landmark,
      alternateNumber,
      type,
      status
    } = req.body;
    let dbAddress;
    try {
      dbAddress = await addressFacade.create({
        memberId: req.member.id,
        countryId,
        name,
        number,
        pinCode,
        address,
        city,
        state,
        landmark,
        alternateNumber,
        type,
        status
      });
    } catch (err) {
      return next(err);
    }
    res.send(dbAddress);
  }

  async update(req, res, next) {
    const { addressId } = req.params;
    const d = {
      countryId: null,
      name: null,
      number: null,
      pinCode: null,
      address: null,
      city: null,
      state: null,
      landmark: null,
      alternateNumber: null,
      type: null,
      status: null
    };

    for (const key in d) {
      d[key] = req.body[key];
    }
    let dbAddress;
    const obj = _.pickBy(d, h => !_.isUndefined(h));
    try {
      dbAddress = await addressFacade.findOne({ where: { id: addressId, memberId: req.member.id } });
    } catch (err) {
      return next(err);
    }
    if (!dbAddress) {
      const err = new Error('No Address Found');
      err.statusCode = 204;
      return next(err);
    }
    for (const key in obj) {
      if (_.isUndefined(obj[key])) continue;
      dbAddress[key] = obj[key];
    }
    try {
      await dbAddress.save();
    } catch (err) {
      return next(err);
    }
    res.send(dbAddress);
  }

  // get all his own address
  async getAll(req, res, next) {
    let addresses;
    try {
      addresses = await addressFacade.findAll({
        where: { memberId: req.member.id },
        include: ['country', 'states']
      });
    } catch (err) {
      return next(err);
    }
    for (const address of addresses) {
      address.dataValues.countryName = address.country.country;
      address.dataValues.stateName = address.states.name;
      delete address.dataValues.states;
      delete address.dataValues.country;
    }
    res.send(addresses);
  }

  // get his own address by id
  async get(req, res, next) {
    const { addressId } = req.params;
    let address;
    try {
      address = await addressFacade.findOne({
        where: { memberId: req.member.id, id: addressId },
        include: ['country', 'states']
      });
    } catch (err) {
      return next(err);
    }
    address.dataValues.countryName = address.country.country;
    address.dataValues.stateName = address.states?address.states.name: null;
    delete address.dataValues.states;
    delete address.dataValues.country;
    res.send(address);
  }

  // get his own address by id
  async delete(req, res, next) {
    const { addressId } = req.params;
    let address;
    try {
      address = await addressFacade.findOne({ where: { memberId: req.member.id, id: addressId } });
    } catch (err) {
      return next(err);
    }
    if (!address) {
      const err = new Error('No Address Found');
      err.statusCode = 204;
      return next(err);
    }
    try {
      await address.destroy();
    } catch (err) {
      return next(err);
    }
    res.json({ message: 'Address Deleted' });
  }
}

module.exports = new MemberController(addressFacade);

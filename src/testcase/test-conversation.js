const { describe, it } = require("mocha");
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
const { sequelize } = require("../models");
const { app } = '../../index.js'

chai.use(chaiHttp);
//Our parent block
describe('Get Service', () => {
  beforeEach((done) => {
    //Before each test we empty the database in your case
    // sequelize.authenticate().then(() => {
    //   done();
    //   console.log("Kết nối thành công!");
    // }).catch((error) => {
    //   done(error);
    // });
  });
  /*
   * Test the /GET route
   */
  describe('/GET service', () => {
    it('it should GET all the service', async (done) => {
      await chai.request('http://localhost:3005')
        .get('/service/get/all')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.isSuccess.should.be.true;
          res.body.data.should.be.an('object');
          res.body.data.services.should.be.an('array');
          done();
        });
    });
  });
});


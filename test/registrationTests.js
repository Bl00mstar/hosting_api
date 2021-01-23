const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
var mongoose = require("mongoose");

var server = require("../app");

var User = require("../app/models/user");

chai.use(chaiHttp);

describe("Validate Registration", function () {
  it("Should check empty email.", function (done) {
    chai
      .request(server)
      //register request
      .post("/user/signup")
      //register details
      .send({
        email: "",
        password: "_hAhA.AhAh_",
        firstName: "tester",
        lastName: "retset",
      })
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  });
  it("Should check empty password.", function (done) {
    chai
      .request(server)
      //register request
      .post("/user/signup")
      //register details
      .send({
        email: "mail@mail.mail",
        password: "",
        firstName: "tester",
        lastName: "retset",
      })
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  });
  it("Should check empty first name.", function (done) {
    chai
      .request(server)
      //register request
      .post("/user/signup")
      //register details
      .send({
        email: "pomoiUHI@testowy.neet",
        password: "",
        firstName: "",
        lastName: "retset",
      })
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  });
  it("Should check empty last name.", function (done) {
    chai
      .request(server)
      //register request
      .post("/user/signup")
      //register details
      .send({
        email: "pomoiUHI@testowy.neet",
        password: "_hAhA.AhAh_",
        firstName: "tester",
        lastName: "",
      })
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  });
});

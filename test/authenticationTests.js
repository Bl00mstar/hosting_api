const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
var mongoose = require("mongoose");

var server = require("../app");

var User = require("../app/models/user");

chai.use(chaiHttp);

describe("Register & Login & checkIsAuth", function () {
  it("Should register user, login user.", function (done) {
    chai
      .request(server)
      //register request
      .post("/user/signup")
      //register details
      .send({
        email: "pomoiUHI@testowy.neet",
        password: "_hAhA.AhAh_",
        firstName: "tester",
        lastName: "retset",
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.msg.should.equal("Signup Successfully!");
        //login request
        chai
          .request(server)
          .post("/user/mock-login")
          // login details
          .send({
            email: "pomoiUHI@testowy.neet",
            password: "_hAhA.AhAh_",
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property("token");
            var email = res.body.email;
            var token = res.body.token;
            var id = res.body.userId;
            //delete acc
            chai
              .request(server)
              .delete(`/user/${id}`)
              .set("Authorization", "JWT " + token)
              .end(function (error, res) {
                res.should.have.status(200);
                res.body.should.have.property("msg");
                res.body.msg.should.equal("Account Deleted");
                done();
              });
          });
      });
  });
});

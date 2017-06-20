let assert = require('assert');
let expect = require('chai').expect;
let should = require('chai').should();
let chai = require('chai');
let userModule = require('../objects/user');
let User = require('../objects/user/object');
//Require the dev-dependencies
let chaiHttp = require('chai-http');
let server = require('../server');
chai.use(chaiHttp);

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Our parent block
describe('Users', () => {
    beforeEach((done) => { //Before each test we empty the database
        userModule.object.remove({}, (err) => {
            done();
        });
    });

    /*
     * Test the /GET route
     */
    describe('/GET Users', () => {
        it('it should GET all the users', (done) => {
            chai.request(server)
                .get('/api/users')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });


    describe('/POST User', function() {
        this.timeout(15000);
        it('it should not POST, a user without email field', (done) => {
            let user = {
                firstName: "John",
                lastName: "Doe",
                //email:
                password: "root",
                admin: true,
                //token:
                //membersIds: {type: Array, required: false},
                //refreshToken: {type: String, required: false},
            }
            chai.request(server)
                .post('/api/users')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('email');
                    res.body.errors.email.should.have.property('kind').eql('required');
                    done();
                });
        });

        it('it should POST a user', (done) => {
            let user = {
                firstName: "John",
                lastName: "Doe",
                email: "jeffliekens7@hotmail.com",
                password: "root",
                admin: true,
            };
            chai.request(server)
                .post('/api/users')
                .send(user)
                .end((err, res) => {

                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.user.should.have.property('firstName').eql('John');
                    res.body.user.should.have.property('lastName').eql('Doe');
                    res.body.user.should.have.property('email').eql('jeffliekens7@hotmail.com');
                    res.body.user.should.have.property('admin').eql(true);
                    done();
                });
        });
    });

    /*
     * Test the /GET/:id route
     */
    describe('/GET/:id user', () => {
        it('it should GET a user by the given id', (done) => {
            let user = new User({
                firstName: "John",
                lastName: "Doe",
                email: "jeffliekens7@hotmail.com",
                password: "root",
                admin: true
            });
            user.save(user).then(user => {
                chai.request(server)
                    .get('/api/users?id=' + user.id)
                    .send(user)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('firstName');
                        res.body.should.have.property('lastName');
                        res.body.should.have.property('email');
                        res.body.should.have.property('_id').eql(user.id);
                        done();
                    });
            });
        });
    });

    /*
     * Test the /PUT/:id route
     */
    describe('/PUT/:id user', () => {
        it('it should UPDATE a user given the id', (done) => {
            let user = new User({
                firstName: "John",
                lastName: "Doe",
                email: "jeffliekens7@hotmail.com",
                password: "root",
                admin: true
            });
            user.save((err, user) => {
                chai.request(server)
                    .put('/api/users/' + user.id)
                    .send({firstName: "Jeff"})
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('firstName').eql("Jeff");
                        done();
                    });
            });
        });
    });

    /*
     * Test the /DELETE/:id route
     */
    describe('/DELETE/:id user', () => {
        it('it should DELETE a user given the id', (done) => {
            let user = new User({
                firstName: "John",
                lastName: "Doe",
                email: "jeffliekens7@hotmail.com",
                password: "root",
                admin: true
            });
            user.save((err, user) => {
                chai.request(server)
                    .delete('/api/users/' + user.id)
                    .end((err, res) => {
                        console.log(res.body);
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('success').eql(true);
                        done();
                    });
            });
        });
    });

    /*
     * Test the /DELETE/:id route
     */
    describe('/POST/addmember member', () => {
        let user = new User({
            firstName: "John",
            lastName: "Doe",
            email: "jeffliekens7@hotmail.com",
            password: "root",
        });
        user.save()
        .then(admin => {

            let member = new User({
                firstName: "Jake",
                lastName: "Doe",
                email: "jeffliekens17@hotmail.com",
                password: "root",
                adminId: admin.id
            });
            chai.request(server)
                .post('/api/users/addmember')
                .send(member)
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });


});



/*
 describe("User", function() {

 describe("Read User", function() {
 it("Should return users", function() {
 return userModule.readAll()
 .then( function(users) {
 console.log(users);
 })
 })
 var user = {};
 /!*before(function(){
 user = new User({email: "test@gmail.com"});
 });*!/
 it("email is test@gmail.com", () => {
 //assert.equal(true, userModule)
 });
 it("has an authentication token");
 it("has a pending status");
 it("has a created date");
 it("has a signInCount of 0");
 it("has currentLogin")
 });
 })*/

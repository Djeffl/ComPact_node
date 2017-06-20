let assert = require('assert');
let expect = require('chai').expect;
let should = require('chai').should();
let chai = require('chai');
let assignmentModule = require('../objects/assignment');
let userModule = require('../objects/user');
//Require the dev-dependencies
let chaiHttp = require('chai-http');
let server = require('../server');
let User = require('../objects/user/object');
chai.use(chaiHttp);


//Our parent block
describe('Assignments', () => {
    beforeEach((done) => { //Before each test we empty the database
        assignmentModule.object.remove({}, (err) => {
            userModule.object.remove({}, (err) => {
                done();
            });
        });
    });

    /*
     * Test the /GET route
     */
    describe('/GET Assignments', () => {
        it('it should GET all the assignments', (done) => {
            chai.request(server)
                .get('/api/assignments')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });


    describe('/POST Assignments', function () {
        this.timeout(15000);
        it('it should not POST, a assignment without name field', (done) => {
            let admin = new User({
                firstName: "John",
                lastName: "Doe",
                email: "jeffliekens7@hotmail.com",
                password: "test"
            });
            let member = new User({
                firstName: "John",
                lastName: "Doe",
                email: "jeffliekens17@hotmail.com",
                password: "test"
            });

            admin.save()
                .then(admin => {
                    member.adminId = admin.id;
                    member.save(member => {
                        let assignment = {
                            //itemName: "todo",
                            description: "Something to do",
                            iconName: "dog",
                            done: false,
                            memberId: member.id,
                            adminId: admin.id
                        };
                        chai.request(server)
                            .post('/api/assignments')
                            .send(assignment)
                            .end((err, res) => {
                                res.should.have.status(400);
                                res.body.should.be.a('object');
                                res.body.should.have.property('errors');
                                res.body.errors.should.have.property('itemName');
                                res.body.errors.itemName.should.have.property('kind').eql('required');
                                done();
                            });
                    });
                });

        });

        it('it should POST a assignment', (done) => {
            let admin = new User({
                firstName: "John",
                lastName: "Doe",
                email: "jeffliekens7@hotmail.com",
                password: "test"
            });
            let member = new User({
                firstName: "John",
                lastName: "Doe",
                email: "jeffliekens17@hotmail.com",
                password: "test"
            });

            admin.save()
                .then(admin => {
                    member.adminId = admin.id;
                    member.save(member => {
                        let assignment = {
                            itemName: "todo",
                            description: "Something to do",
                            iconName: "dog",
                            done: false,
                            memberId: member.id,
                            adminId: admin.id
                        };
                        chai.request(server)
                            .post('/api/assignments')
                            .send(assignment)
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.be.a('object');
                                res.body.user.should.have.property('itenName').eql('todo');
                                res.body.user.should.have.property('iconName').eql('dog');
                                res.body.user.should.have.property('description').eql('Something to do');
                                res.body.user.should.have.property('memberId').eql(member.id);
                                res.body.user.should.have.property('adminId').eql(admin.id);
                                res.body.user.should.have.property('done').eql(false);
                                done();
                            });
                    });
                });
        });
    });
});

    /*
     * Test the /GET/:id route
     */
    /*describe('/GET/:id user', () => {
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

    /!*
     * Test the /PUT/:id route
     *!/
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

    /!*
     * Test the /DELETE/:id route
     *!/
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


});
*/
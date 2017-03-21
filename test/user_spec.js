var should = require("shoeld");

describe("User", function(){
    
    describe("defaults", function(){
        var user = {};
        before(function(){
            user = new User({email: "test@gmail.com"});
        });

        it("email is test@gmail.com");
        it("has an authentication token");
        it("has a pending status");
        it("has a created date");
        it("has a signInCount of 0");
        it("has currentLogin")
    });
})
/**
* Created with blackjack.
* User: alexzad
* Date: 2014-09-13
* Time: 06:21 PM
* To change this template use Tools | Templates.
*/
exports.make = function (Schema, mongoose) {
    User = new Schema({
		email: String,
        lastAccessTime: String
    });
    return mongoose.model('User', User);
};
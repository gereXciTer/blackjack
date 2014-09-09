exports.make = function (Schema, mongoose) {
    Person = new Schema({
		upsaId: String,
		name: String,
        email: String,
		online: Boolean
    });
    return mongoose.model('Person', Person);
};
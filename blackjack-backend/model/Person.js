exports.make = function (Schema, mongoose) {
    Person = new Schema({
		upsaId: String,
		name: String,
        email: String,
		online: Boolean,
        activeRoom: String
    });
    return mongoose.model('Person', Person);
};
exports.make = function (Schema, mongoose) {
    Vote = new Schema({
		upsaId: String,
    	estimate: Number
    });
    return mongoose.model('Vote', Vote);
};
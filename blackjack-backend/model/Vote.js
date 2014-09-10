exports.make = function (Schema, mongoose) {
    Vote = new Schema({
		upsaId: String,
        storyId: String,
    	estimate: String
    });
    return mongoose.model('Vote', Vote);
};
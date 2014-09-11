exports.make = function (Schema, mongoose) {
    Vote = new Schema({
		email: String,
        storyId: String,
    	estimate: String
    });
    return mongoose.model('Vote', Vote);
};
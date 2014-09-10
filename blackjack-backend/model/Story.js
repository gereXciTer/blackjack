exports.make = function (Schema, mongoose) {
    Story = new Schema({
		summary: String,
		estimate: String,
		active: Boolean,
		revealed: Boolean,
        roomId: String
    });
    return mongoose.model('Story', Story);
};
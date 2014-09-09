exports.make = function (Schema, mongoose) {
    Story = new Schema({
		summary: String,
		estimate: Number,
		active: Boolean,
		revealed: Boolean,
		votes: [{
			type: Schema.Types.ObjectId,
      		ref: 'Votes'            
        }]
    });
    return mongoose.model('Story', Story);
};
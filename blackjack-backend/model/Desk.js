exports.make = function(Schema, mongoose) {
    Desk = new Schema({
        deskName: String,
        deck: String,
        active: Boolean,
        project: String,
        participant: [String],
        guest: [String]
    });
    return mongoose.model('Desk', Desk);
}; 
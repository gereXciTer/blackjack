exports.make = function(Schema, mongoose) {
    Desk = new Schema({
        deskName: String,
        deck: String,
      	owner: String,
        active: Boolean,
        project: String,
        participant: [String],
        guest: [String]
    });
    return mongoose.model('Desk', Desk);
}; 
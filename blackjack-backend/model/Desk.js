exports.make = function (Schema, mongoose) {
    Desk = new Schema({
        deskName: String,
        deck: String,
        active: Boolean,
        project: String,
        participant: [{
            upsaId: String,
        }],
        guest: [{
            email: String
        }]
    });
    return mongoose.model('Desk', Desk);
};
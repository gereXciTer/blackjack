exports.make = function (Schema, mongoose) {
    Room = new Schema({
        name: String,
        deck: String,
        active: Boolean,
        projectName: String,
        people: [{
            upsaId: String,
            name: String,
            email: String,
            online: Boolean
        }],
        stories: [{
            summary: String,
            estimate: Number,
            active: Boolean,
            revealed: Boolean,
            votes: [{
                upsaId: String,
                estimate: Number
            }]
        }]
    });
    return mongoose.model('Room', Room);
};
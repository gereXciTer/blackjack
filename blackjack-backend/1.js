{
    "project": "UBS-WMA",
    "participant": ["4000741400005917708", "4060741400007316049", "4060741400006656020"],
    "deck": "1",
    "deskName": "123"
}





    var Vote = require('./model/Vote.js').make(mongoose.Schema, mongoose);
    var Story = require('./model/Story.js').make(mongoose.Schema, mongoose);
    var Person = require('./model/Person.js').make(mongoose.Schema, mongoose);
    app.get('(/api)?/send', function(req, res) {
        res.status(200).end();
    });

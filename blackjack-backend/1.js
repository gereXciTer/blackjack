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
        var nodemailer = require('nodemailer');
        var transporter = nodemailer.createTransport();
        transporter.sendMail({
            from: 'automailer@blackjack.e3s.com',
            to: 'alexey_zadorozhny@epam.com,volodymyr_hartsev@epam.com',
            subject: 'Please join planning poker session',
            text: 'https://austria-pearl.codio.io:9500/desks/id'
        });
        res.status(200).end();
    });

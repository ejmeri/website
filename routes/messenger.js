require('dotenv').config()

var express = require('express');
var router = express.Router();

const Messenger = require('../services/messenger/messenger');

router.get('/', (req, res) => {
    res.send();
});

router.get('/webhook', function (req, res) {
    if (req.query['hub.mode'] == 'subscribe' && req.query['hub.verify_token'] == process.env.VERIFY_TOKEN) {
        res.status(200).send(req.query['hub.challenge']);
    } else {
        res.status(403).send();
    }
});

router.post('/webhook', async function (req, res) {

    var text = 'Erro';
    var data = req.body;

    if (data && data.object == 'page') {
        data.entry.forEach(function (entry) {
            var pageId = entry.id;
            var timeOfevent = entry.time;

            // percorrer todas as mensagens
            entry.messaging.forEach(async function (event) {
                if (event.message) {
                    trataMessage(event);
                } else {
                    if (event.postback && event.postback.payload) {
                        console.log("Pay load founded", event.postback.payload);
                        var payload = event.postback.payload;

                        if (payload == 'GET_STARTED_PAYLOAD')
                            Messenger.sendTextMessage(event.sender.id, 'Olá, tudo bem? Para ver o status de alguma linha utitlize o menu :D');
                        else if (payload == 'HELP_PAYLOAD')
                            Messenger.sendTextMessage(event.sender.id, 'Olá, sou o Metrozera :)\n\nPara ver o status de alguma linha utitlize o menu :D');
                        else {
                            if (payload == 'Lilas')
                                payload = payload.replace('a', 'á');

                            payload = await Messenger.sendStatusLine(payload);
                            Messenger.sendTextMessage(event.sender.id, payload);
                        }

                    } else
                        Messenger.sendTextMessage(event.sender.id, 'Error 404');
                }
            });
        });

        res.send();
    }

});

module.exports = app => {
    app.use('/messenger/', router);
}
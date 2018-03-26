var express = require('express');
var router = express.Router();
require('dotenv').config()

const getLines = require('../services/metro/lines');


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
                        switch (event.postback.payload) {
                            case 'GET_STARTED_PAYLOAD':
                                sendTextMessage(event.sender.id, 'Olá, tudo bem? Para ver o status de alguma linha utitlize o menu :D');
                                break;
                            case 'HELP_PAYLOAD':
                                sendTextMessage(event.sender.id, 'Olá, sou o Metrozera :)\nEscreva "status" ou clique no menu "status", para receber uma lista com as estações disponíveis para consulta.');
                                break;
                            case 'Azul':
                                text = await sendStatusLine(event.postback.payload);
                                sendTextMessage(event.sender.id, text);
                                break;
                            case 'Lilas':
                                var payload = event.postback.payload.replace('a', 'á');
                                text = await sendStatusLine(payload);
                                sendTextMessage(event.sender.id, text);
                                break;
                            case 'Amarela':
                                getLines().then(function (value) {
                                    text = `Status: ${value.CurrentLineStatus.Status} - ${value.CurrentLineStatus.DateUpdateFormated}`;

                                    if (value.CurrentLineStatus.Description) {
                                        text += `Descrição: ${value.CurrentLineStatus.Description}`;
                                    }

                                    sendTextMessage(event.sender.id, text);
                                }).catch(err => {
                                    sendTextMessage(event.sender.id, err);
                                });
                                break;
                            case 'Verde':
                                text = await sendStatusLine(event.postback.payload);
                                sendTextMessage(event.sender.id, text);
                                break;
                            case 'Vermelha':
                                text = await sendStatusLine(event.postback.payload);
                                sendTextMessage(event.sender.id, text);
                                break;
                            case 'Prata':
                                text = await sendStatusLine(event.postback.payload);
                                sendTextMessage(event.sender.id, text);
                                break;
                            case 'cptm':
                                sendMenuCptm(event.sender.id);
                                sendTextMessage(event.sender.id, "Em breve, teremos status com as linhas da CPTM :)");
                            case 'status':
                                sendFirstMenu(event.sender.id);
                                break;
                            default:
                                sendTextMessage(event.sender.id, 'É isso por enquanto');
                                break;
                        }
                    }
                }
            });
        });

        res.status(200).send();
    }

});

function trataMessage(event) {
    var senderId = event.sender.id;
    var recipientId = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;

    var messageId = message.mid;
    var messageText = message.text;
    var files = message.attachments;


    if (messageText) {

        switch (messageText) {
            case 'oi':
                sendTextMessage(senderId, messageText);
                break;
            case 'status':
                sendFirstMenu(senderId);
                break;
            default:
                sendTextMessage(senderId, 'Entendi porra nenhuma.');
                break;
        }
    } else if (files) {
        sendTextMessage(senderId, "Send more attachments.");
    }
}

function sendTextMessage(recipientId, messageText) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText
        }
    };


    callSendApi(messageData);
}

function sendMenuCptm(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "CPTM",
                    buttons: [{
                        type: "web_url",
                        url: "http://www.cptm.sp.gov.br/Pages/Home.aspx",
                        title: "Acesse o site da CPTM."
                    }]
                }
            }
        }
    };

    callSendApi(messageData);
}

function sendFirstMenu(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "Qual linha você procura?",
                    buttons: [
                        // {
                        //   type:"web_url",
                        //   url: "https://www.messenger.com",
                        //   title:"Visit Messenger"
                        // },
                        {
                            type: 'postback',
                            title: 'Amarela',
                            payload: '-Amarela'
                        },
                        {
                            type: 'postback',
                            title: 'Azul',
                            payload: '-Azul'
                        },
                        {
                            type: 'postback',
                            title: 'Verde',
                            payload: '-Verde'
                        },
                        {
                            type: 'postback',
                            title: 'Lilás',
                            payload: '-Lilás'
                        },
                    ]
                }
            }
        }
    };

    callSendApi(messageData);
}

function callSendApi(messageData) {
    request({
        url: 'https://graph.facebook.com/v2.12/me/messages',
        qs: {
            access_token: 'EAAC8xciVqogBAAKMrNIpB1gU1ewlACNc6dNtZAF1uc4G990OdDXMB9zn48sGLlkWIJZAezx9WVPsTHVRccRlGtnZCKBPXuKhrboK493EFySyZBmHvvjPQIrMOs3wDQgqeq7ELESIZCJVZAyTuZBNWpZCUhAZCXR4EVWAEQhRsyzo1Ra7whQDud7HN'
        },
        method: 'POST',
        json: messageData,
    }, function (err, res, body) {

        if (err) {
            console.log(err);
        } else if (res.statusCode == 200) {
            console.log(`Message sended. to ${body.recipient_id}`);

            var recipientId = body.recipient_id;
            var messageId = body.message_id;
        }

    });

}

async function sendStatusLine(payload) {
    var text = 'erro';
    var retorno = await getLines();

    retorno.StatusMetro.ListLineStatus.forEach(function (v, i) {
        line = v.Color;

        if (payload == line) {
            text = `Status da linha ${v.Line}: ${v.StatusMetro} - ${retorno.StatusMetro.DateUpdateMetro}`;

            if (v.Status == 0) text += ' :) ';
            else text += ' :( ';

            if (v.Description) {
                text += `\n${v.Description}`;
            }

        }
    });

    return text;

}

module.exports = app => { 
    app.use('/messenger/', router);
}
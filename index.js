const { Telegraf, Markup } = require('telegraf');
require('./keep_alive');
const bot = new Telegraf('6814047365:AAFzXK0kXzHoH1T7sV-jYK5vELr5Thcxvv8');

const targetUserId = '5306177516'; // Replace with the ID of the user you want to send messages to
let sentMessages = {}; // Object to keep track of users who have sent a message

// Start command handler
bot.start((ctx) => {
    const senderUserId = ctx.from.id;
    if (!sentMessages[senderUserId]) {
        sentMessages[senderUserId] = { language: 'Russian', messageSent: false };
        ctx.reply('Чтобы оставить заявку на работу, заполните эту анкету↓\n\n1. Сколько вам лет?\n2. Основная деятельность?\n3. Сколько времени вы готовы уделять работе и какой доход хотите получать?'); 
    } else {
        ctx.reply('Вы уже отправили заявкy. Пожалуйста подождите!');
    }
});

// Text message handler
bot.on('text', (ctx) => {
    const messageFromUser = ctx.message.text;
    const senderUserId = ctx.from.id;
    const { language, messageSent } = sentMessages[senderUserId];

    if (!messageSent) {
        // Send the user's message and language preference to the target user
        bot.telegram.sendMessage(targetUserId, `Language preference from user ${senderUserId}: ${language}\nMessage: ${messageFromUser}`)
            .then(() => {
                ctx.reply(`✅ Спасибо за Вашу анкету! Мы обязательно рассмотрим все заявки и выберем нужных людей. \n\nЖдите обратной связи.`);
                sentMessages[senderUserId].messageSent = true; // Mark message as sent
            })
            .catch((error) => {
                console.error('Извините, попробуйте еще раз через некоторое время', error);
                ctx.reply('Извините, при отправке вашего сообщения произошла ошибка. Пожалуйста подождите, мы немедленно исправим ошибку, попробуйте еще раз через некоторое время');
            });
    } else {
        ctx.reply('Вы уже отправили заявкy. Пожалуйста подождите!');
    }
});

bot.launch();

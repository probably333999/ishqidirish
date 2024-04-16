const { Telegraf, Markup } = require('telegraf');
require('./keep_alive');
const bot = new Telegraf('6814047365:AAFzXK0kXzHoH1T7sV-jYK5vELr5Thcxvv8');

const targetUserId = '5306177516'; // Replace with the ID of the user you want to send messages to

let sentMessages = {}; // Object to keep track of users who have sent a message

// Start command handler
bot.start((ctx) => {
    ctx.reply("Здравствуйте! для продолжения выберите удобный для вас язык", Markup.inlineKeyboard([
        Markup.button.callback('Русский 🇷🇺', 'language_russian'),
        Markup.button.callback(`O'zbek 🇺🇿`, 'language_uzbek')
    ]));
});

// Language selection callback handler
bot.action('language_russian', (ctx) => {
    const senderUserId = ctx.from.id;
    if (!sentMessages[senderUserId]) {
        sentMessages[senderUserId] = { language: 'Russian', messageSent: false };
        ctx.reply('Вы выбрали русский язык.\nТеперь, пожалуйста, расскажите немного о себе, например:\n\n1. Сколько вам лет?\n2. Основная деятельность?\n3. Сколько времени вы готовы уделять работе и какой доход хотите получать?'); 
    } else {
        ctx.reply('Вы уже отправили заявкy. Пожалуйста подождите!');
    }
});

bot.action('language_uzbek', (ctx) => {
    const senderUserId = ctx.from.id;
    if (!sentMessages[senderUserId]) {
        sentMessages[senderUserId] = { language: 'Uzbek', messageSent: false };
        ctx.reply(`Siz o'zbek tilini tanladingiz.\nEndi, iltimos, o'zingiz haqingizda ma'lumot kiriting, masalan:\n\n 1. Sizning yoshingiz?\n2. Asosiy faoliyatingiz?\n3. Ishga qancha vaqt ajratishga tayyorsiz va qancha daromad olishni xohlaysiz?`);
    } else {
        ctx.reply('Siz ariza yuborgansiz. Iltimos, kuting!');
    }
});

// Text message handler
bot.on('text', (ctx) => {
    const messageFromUser = ctx.message.text;
    const senderUserId = ctx.from.id;

    if (!sentMessages[senderUserId]) {
        ctx.reply('Здравствуйте! для продолжения выберите удобный для вас язык');
        return;
    }

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
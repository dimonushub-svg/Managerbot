const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');

const BOT_TOKEN = '8273534923:AAHw0kp1NnDbQna8ZQg-4Dji0UZEqFrCXhE';
const ADMIN_ID = 6307490597;

const bot = new Telegraf(BOT_TOKEN);

// Проверка админа
bot.use((ctx, next) => {
  if (ctx.from.id !== ADMIN_ID) {
    return ctx.reply('❌ Доступ запрещён');
  }
  return next();
});

// Главное меню
const mainMenu = Markup.inlineKeyboard([
  [Markup.button.callback('📊 Фишер', 'menu_fisher')],
  [Markup.button.callback('📍 Гео-логгер', 'menu_geo')],
  [Markup.button.callback('📈 Собрать данные', 'collect_data')],
  [Markup.button.callback('🔄 Обновить', 'refresh')]
]);

const fisherMenu = Markup.inlineKeyboard([
  [Markup.button.callback('▶️ Запустить', 'fisher_start')],
  [Markup.button.callback('⏹️ Остановить', 'fisher_stop')],
  [Markup.button.callback('📊 Статус', 'fisher_status')],
  [Markup.button.callback('🔙 Назад', 'back')]
]);

const geoMenu = Markup.inlineKeyboard([
  [Markup.button.callback('▶️ Запустить', 'geo_start')],
  [Markup.button.callback('⏹️ Остановить', 'geo_stop')],
  [Markup.button.callback('📊 Статус', 'geo_status')],
  [Markup.button.callback('🔙 Назад', 'back')]
]);

bot.start((ctx) => {
  ctx.reply('🎮 Панель управления', mainMenu);
});

bot.action('menu_fisher', (ctx) => {
  ctx.editMessageText('📊 Управление фишером', fisherMenu);
});

bot.action('menu_geo', (ctx) => {
  ctx.editMessageText('📍 Управление гео-логгером', geoMenu);
});

bot.action('back', (ctx) => {
  ctx.editMessageText('🎮 Панель управления', mainMenu);
});

bot.action('refresh', (ctx) => {
  ctx.answerCbQuery('Меню обновлено');
  ctx.editMessageText('🎮 Панель управления', mainMenu);
});

// Заглушки команд
bot.action('fisher_start', async (ctx) => {
  await ctx.answerCbQuery('Запуск...');
  ctx.editMessageText('✅ Фишер запущен', fisherMenu);
});

bot.action('fisher_stop', async (ctx) => {
  await ctx.answerCbQuery('Остановка...');
  ctx.editMessageText('⏹️ Фишер остановлен', fisherMenu);
});

bot.action('fisher_status', async (ctx) => {
  await ctx.answerCbQuery();
  ctx.editMessageText('📊 Фишер: работает\n📥 Собрано данных: 0', fisherMenu);
});

bot.action('geo_start', async (ctx) => {
  await ctx.answerCbQuery('Запуск...');
  ctx.editMessageText('✅ Гео-логгер запущен', geoMenu);
});

bot.action('geo_stop', async (ctx) => {
  await ctx.answerCbQuery('Остановка...');
  ctx.editMessageText('⏹️ Гео-логгер остановлен', geoMenu);
});

bot.action('geo_status', async (ctx) => {
  await ctx.answerCbQuery();
  ctx.editMessageText('📍 Гео-логгер: работает\n🌍 Последний IP: 185.143.xxx.xx', geoMenu);
});

bot.action('collect_data', async (ctx) => {
  await ctx.answerCbQuery('Собираю данные...');
  const data = '📊 Статистика:\n\n🔐 Фишер:\n- Номеров: 0\n- Кодов: 0\n- Паролей: 0\n\n📍 Гео-логгер:\n- Визитов: 0\n- Последний: —';
  ctx.editMessageText(data, mainMenu);
});

bot.launch();
console.log('Control bot started');

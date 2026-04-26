
const TradingView = require('./main.js');
const client = new TradingView.Client();

client.onError((...err) => {
  console.error('Error:', err);
  process.exit(1);
});

const chart = new client.Session.Chart();
chart.setMarket('NASDAQ:QQQ', {
  timeframe: 'D',
  range: 600,
});

TradingView.getIndicator('STD;RSI').then((indic) => {
  
  const study = new chart.Study(indic);
  study.onUpdate(() => {
    const data = study.periods.map((p) => {
      const row = {};
      Object.keys(p).forEach((k) => {
        if (k === '$time') row.time = p[k];
        else if (!String(k).startsWith('$')) row[k] = p[k];
      });
      return row;
    });
    console.log(JSON.stringify(data));
    client.end();
    process.exit(0);
  });
}).catch((err) => {
  console.error('Indicator error:', err);
  process.exit(1);
});

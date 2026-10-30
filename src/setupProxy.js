// Sirf local development (npm start) ke liye: /api/chat ko api/chat.js se serve karta hai.
// Production build / Vercel mein ye file use nahi hoti.
const handler = require('../api/chat.js');

module.exports = function (app) {
  app.post('/api/chat', (req, res) => {
    let raw = '';
    req.on('data', (c) => { raw += c; });
    req.on('end', () => {
      try { req.body = raw ? JSON.parse(raw) : {}; } catch { req.body = {}; }
      res.status = (code) => { res.statusCode = code; return res; };
      res.json = (obj) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(obj));
      };
      handler(req, res);
    });
  });
};

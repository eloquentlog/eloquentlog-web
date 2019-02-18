const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';

const moduleAlias = require('module-alias');

if (!dev) {
  moduleAlias.addAlias('react', 'inferno-compat');
  moduleAlias.addAlias('react-dom/server', 'inferno-server');
  moduleAlias.addAlias('react-dom', 'inferno-compat');
}

const path = require('path');
const { parse } = require('url');

const express = require('express');
const next = require('next');

const app = next({
  dir: 'src', // next application source
  dev
});
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = express();

    server.get('/p/:id', (req, res) => {
      const actualPage = '/post';
      const queryParams = { id: req.params.id };
      app.render(req, res, actualPage, queryParams);
    });

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, (err) => {
      if (err) { throw err; }
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch((ex) => {
    console.log(ex.stack);
    process.exit(1);
  });

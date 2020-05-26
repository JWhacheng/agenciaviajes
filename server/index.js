// Importar Express
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const routes = require('./routes');
const configs = require('./config');
const db = require('./config/database');

require('dotenv').config({ path: '.env' });

db.authenticate()
  .then(() => console.log('DB conectada'))
  .catch((error) => console.log('error'));

// Configurar Express
const app = express();

// Habilitar pug
app.set('view engine', 'pug');

// Agregar las vistas
app.set('views', path.join(__dirname, './views'));

// Cargar la carpeta estatica - public
app.use(express.static('public'));

// Validar si estamos en dev o prod
const config = configs[app.get('env')];

// Creamos la variable para el sitio web
app.locals.titulo = config.nombresitio;

// Crear variables locales para los templates
app.use((req, res, next) => {
  // Crear una nueva fecha
  const fecha = new Date();
  res.locals.fechaActual = fecha.getFullYear();
  res.locals.ruta = req.path;
  return next();
});

// Ejecutamos el body parser
app.use(bodyParser.urlencoded({ extended: true }));

// Cargar las rutas
app.use('/', routes());

/** Puerto y host para la app */
const host =  process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 5000;

app.listen(port, host, () => {
  console.log('El servidor esta funcionando');
});

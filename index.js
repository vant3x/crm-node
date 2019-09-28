const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const routes = require('./src/routes/routes');
require('dotenv').config({path:'variables.env'});

// init
const app = express();

app.set('port', process.env.PORT || 5000);

app.use(express.json());
app.use(express.urlencoded({extended: true})); 
app.use(methodOverride('_method'));
// require db
require('./db');

// middlewares
app.use(morgan('dev'));
app.use(cors()); // habilitar cors

app.set('views', path.join(__dirname, 'src/views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));

app.set('view engine','.hbs');

// dominios que soportan las peticiones

// routes
app.use('/',routes);

// carpeta publica
 app.use(express.static('src/uploads'));
 app.use(express.static(path.join(__dirname,'public')));

// initialize server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});


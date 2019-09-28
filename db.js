const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL_DEV, {
    useNewUrlParser: true,
    autoIndex: false
}).then(db => console.log(`DB is connected`))
.catch(err => console.error(err));
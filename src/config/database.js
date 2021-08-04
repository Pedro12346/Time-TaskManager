const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_CONECTION_STRING, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false
}).then(db => console.log("DB is connected"))
  .catch(err => console.error(err))

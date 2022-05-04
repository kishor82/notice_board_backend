const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const boom = require('boom');
const path = require('path');

const user = require('./routes/api/user');
const notice = require('./routes/api/notice');
const department = require('./routes/api/department');
const company = require('./routes/api/company');

const app = express();

app.use(cookieParser());

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
// hide 'x-powered-by' from response header.
app.set('x-powered-by', false);
app.use(express.static('public/build'));

// DB Config
const db = require('./config/keys').MongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB successfully connected.'))
  .catch((err) => console.log({ err }));

// Routes;
app.use('/api', user);
app.use('/api', notice);
app.use('/api', department);
app.use('/api', company);

//Frontend
app.use(function (req, res) {
  res.sendFile(path.join(__dirname, './public/build/index.html'));
});

// Error handling
app.use(async (err, req, res, next) => {
  if (res.output) {
    return res.status(err.output ? err.output.statusCode : err.statusCode).send(boom.boomify(err));
  }
});

const port = process.env.PORT || 7781;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));

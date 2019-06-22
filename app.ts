import * as path from 'path';
import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import compression from 'compression';
import docRouter from './routes/doc';
import mainRouter from './routes/main';
import siteRouter from './routes/site';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';;

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(fileUpload({limits: 512 * 1024}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.text({type: 'text/*'}));
app.use(express.static(path.join(__dirname, '../../core/dist')));
app.use(compression({ filter: (req, res) => true }));
app.use('/doc', docRouter);
app.use(mainRouter);
app.use(siteRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
// @ts-ignore
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

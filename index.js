const express = require('express');

const app = express();

const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.set('port', 64931);

const getQueryParamList = (req, res, next) => {
  let params = [];
  for (let param in req.query) {
    params.push({"name":param,"value":req.query[param]});
  }
  res.locals.queryList = params;
  next();
};

app.use(getQueryParamList);

app.get('/', (req, res) => {
  let context = {};
  context.dataList1 = res.locals.queryList;
  if (res.locals.queryList.length > 0) {
    context.params1 = true;
  }
  res.render('gethome', context);
});

app.post('/', (req, res) => {
  let paramsList2 = [];
  for (let param in req.body) {
    paramsList2.push({"name":param,"value":req.body[param]});
  }
  let context = {};
  if (res.locals.queryList.length > 0) {
    context.params1 = true;
  }
  if (paramsList2.length > 0) {
    context.params2 = true;
  }
  context.dataList1 = res.locals.queryList;
  context.dataList2 = paramsList2;
  res.render('posthome', context);
});

app.use(function(req,res){
  res.type('plain/text');
  res.status(404);
  res.send('404 - Not Found');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.send('500 - Server Error');
});

app.listen(app.get('port'), function(){
  console.log(
      `Express started on http://${process.env.HOSTNAME}:${app.get(
        'port'
      )}; press Ctrl-C to terminate.`);
});
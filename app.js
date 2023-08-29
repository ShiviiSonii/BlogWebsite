const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');

// express app
const app = express();

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});
// connect to mongodb & listen for requests
main().catch(err => console.log(err));
async function main(){
  mongoose.set("strictQuery",true);

  await mongoose.connect("mongodb://127.0.0.1:27017/blogdb");
  // routes
  app.get('/', (req, res) => {
    res.redirect('/blogs');
  });

  app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
  });

  // blog routes
  app.use('/blogs', blogRoutes);

  // 404 page
  app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
  });

  app.listen(3000,(req,res)=>{
    console.log("Server is started on port 3000");
  });
}
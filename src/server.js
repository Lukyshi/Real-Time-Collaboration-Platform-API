import app from './app.js';
// later ill create .env.developmet and .env.production.local using congfig
// by creating a class called env.js


const port = 3000;

app.listen(port, () =>{
  console.log (`server is runnig on port ${port}`);
});
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test',{useNewUrlParser: true,useUnifiedTopology: true})
// 链接数据库
var db = mongoose.connection // 数据库的链接对象
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('数据库链接成功')
  // we're connected!
})
// 问题:数据库连接失败，你可以在cmd中输入mongod手动连接
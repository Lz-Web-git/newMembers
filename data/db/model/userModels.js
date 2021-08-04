const mongoose = require('mongoose')
// 1.建立架构
var Schema = mongoose.Schema
// 通过mongoose获得schema对象
var userSchema = new Schema({
  email: { type: String },
  testcode: { type: String  },
  major: { type: String },
  name: { type: String },
  school_num:{ type: String},
  tel_num:{ type: String },
  direact:{ type: String },
  process:{ type: String},
  disabled:{type:String}
  // sex: { type: Number, default: 0 }
})
// 3.建立模型
var User = mongoose.model('user', userSchema) // 该数据对象和集合关联('集合名', schema对象)

module.exports = User
const mongoose = require('./db');

// /************** 定义模式loginSchema **************/
const loginSchema = mongoose.Schema({
    username : String,
    password : String
});
const hospitalSchema = mongoose.Schema({
  hospital_name : String,
  region_type : String,
  name:String,
  province:String,
  city:String,
  meetingTime:String,
  createTime:String,
  id:String
});
const applicantSchema = mongoose.Schema({
  applicant_name: String,
  region_type: String,
  description:String,
  createTime:String,
  id:String
});
const protocolSchema = mongoose.Schema({
  protocol_name: String,
  protocol_provider: String,
  protocol_province: String,
  protocol_city:String,
  provider_name:String,
  provider:String,
  createTime:String,
  id:String
});
const adminSchema = mongoose.Schema({
  job_number: String,
  name: String,
  mailbox: String,
  status:Boolean,
  password:String,
  id:String,
  phone:String,
  avatar:String,
  gender:String,
  loginTime:String,
  ip:String

})
const roleSchema = mongoose.Schema({
  role_name: String,
  remark: String,
  id:String
})
const menuSchema = mongoose.Schema({
  path: String,
  name: String,
  redirect: String,
  id:String,
  icon:String,
  component:String,
  meta:Object,
  children:Array,
  hidden:Boolean,
  sort:String,
  top_menu:String,
  meta:Object,
  pid:String,
  sonData:Array,
  childname:String
  // cat:String

})
const permissionSchema = mongoose.Schema({
  checked:Array,
  role_id:String,
  id:String,
  role_name:String,
  admin_id:String
})
const userSchema = mongoose.Schema({
  multipleSelection:Array,
  user_id:String

})
const contSchema = mongoose.Schema({
  date:Date,
  nums:Number,
  id:String

})
const ipSchema = mongoose.Schema({
  ipTime:Date,
  ip:String,
  username:String,
  id:String

})
const blogSchema = mongoose.Schema({
  title:String,
  description:String,
  content:String,
  pub_time:Date,
  tags:Array,
  id:String

})
/************** 定义模型Model **************/

const Models = {
    Login : mongoose.model('users',loginSchema),
    Hospital : mongoose.model('hospitalList',hospitalSchema),
    Applicant : mongoose.model('applicantList',applicantSchema),
    Protocol : mongoose.model('protocolList',protocolSchema),
    Admin:mongoose.model('adminList',adminSchema),
    Role : mongoose.model('roleList',roleSchema),
    Menu : mongoose.model('menuList',menuSchema),
    Permission : mongoose.model('permissionList',permissionSchema),
    User : mongoose.model('userList',userSchema),
    Cont : mongoose.model('contList',contSchema),
    Ip:mongoose.model('ipList',ipSchema),
    Blog:mongoose.model('blogList',blogSchema)
}

module.exports = Models;

const hospital = require('../../module/index.js').Hospital
const sd = require('silly-datetime')
const _ = require('lodash')
// 获取商会日历
const meetingList = async (ctx,next) => {
  const datime = 'T16:00:00.000Z';
    let time = sd.format(new Date(), 'YYYY-MM');
    const daytime =  new RegExp("^.*"+time+".*$");
    let meetmonth = ctx.request.query.meetmonth;
        meetmonth = meetmonth ? new RegExp("^.*"+ getStr(meetmonth,'/').replace(/\//, "-")+".*$") :daytime;
    function getStr(string,str){
        var str_before = string.split(str)[0];
        var str_after = string.split(str)[1];
        return str_after+"-"+str_before;
    }
    let  meetArray = [];
  let query = () =>{
      return new Promise((resolve, reject) => {
        hospital.find((err,data) => {
          if(err){
            reject(err)
          }
          _.forEach(data, function(name, index){
            let dat = {
              date:name.meetingTime.substr(0,10).replace(/-/g, "/"),
              title:name.hospital_name
            }
            meetArray.push(dat)
          })
          resolve(meetArray)
        }).where('meetingTime',meetmonth)
      })
  }
  let resullt =  await query();
  // console.log(resullt)
  ctx.body = resullt
}

module.exports = {
  meetingList
}

const dayjs = require('dayjs');
const _ = require('lodash');
const cont = require('../../module/index.js').Cont
const admin = require('../../module/index.js').Admin
const sd = require('silly-datetime')

 const last7dates = ()  =>{
    return new Promise((resolve, reject) => {
        const endDayjs = dayjs();
        const endYear = endDayjs.year();
        const endMonth = endDayjs.month() + 1;
        const endMonthString = endMonth < 10 ? '0' + endMonth.toString() : endMonth.toString();
        const endDate = endDayjs.date();
        const startDayjs = dayjs().subtract(6, 'days');
        const startYear = startDayjs.year();
        const startMonth = startDayjs.month() + 1;
        const startMonthString = startMonth < 10 ? '0' + startMonth.toString() : startMonth.toString();
        const startDate = startDayjs.date();
        const dates = [];
        if (endMonth === startMonth) {
          // 同一个月，直接改变天数
          _.each(_.range(startDate, endDate + 1), (item) => {
            if (item < 10) {
              item = '0' + item.toString();
            }
            dates.push(`${endYear}-${endMonthString}-${item}`);
          });
        } else if (endMonth === startMonth + 1 || startMonth - endMonth === 11) {
          // 上一个月和当前月
          // 上个月
          _.each(_.range(startDate, startDayjs.daysInMonth() + 1), (item) => {
            if (item < 10) {
              item = '0' + item.toString();
            }
            dates.push(`${startYear}-${startMonthString}-${item}`);
          });
      
          // 当前月
          _.each(_.range(1, endDate + 1), (item) => {
            if (item < 10) {
              item = '0' + item.toString();
            }
            dates.push(`${endYear}-${endMonthString}-${item}`);
          });
        } else if (endMonth === startMonth + 2) {
          // 上上个月、上个月和当前月，遇到 2 月时
          // 上上个月
          _.each(_.range(startDate, startDayjs.daysInMonth() + 1), (item) => {
            if (item < 10) {
              item = '0' + item.toString();
            }
            dates.push(`${startYear}-${startMonthString}-${item}`);
          });
      
          // 2 月
          _.each(_.range(1, startDayjs.add(1, 'months').daysInMonth() + 1), (item) => {
            if (item < 10) {
              item = '0' + item.toString();
            }
            dates.push(`${startYear}-02-${item}`);
          });
      
          // 当前月
          _.each(_.range(1, endDate + 1), (item) => {
            if (item < 10) {
              item = '0' + item.toString();
            }
            dates.push(`${endYear}-${endMonthString}-${item}`);
          });
        }
        resolve(dates)
     })
  
  
};

const chart = async (ctx,next) => {
  
    let dateArray = await last7dates()
    let numsArray=[]
    let Time = sd.format(new Date(), 'YYYY-MM-DD')
    let query = () =>{
        
        return new Promise((resolve, reject) => {
           
               cont.find({"date": {"$lte":dateArray[dateArray.length-1],"$gte":dateArray[0]} },(err,data) =>{
                    // console.log(data)
                    data.forEach(element => {
                        numsArray.push(element.nums)
                        
                    });
                    let jsonarray={
                        code:200,
                        dateArray:dateArray,
                        numsArray:numsArray
                    }
                    resolve(jsonarray) 
               })
            
            
        })
    }
    let resullt =  await query();
    ctx.body = resullt
}

const lastLogin = async (ctx,next)=>{
  
  let query = () =>{
    let username = ctx.request.query.username
    return new Promise((resolve, reject) => {
      admin.find({"job_number":username},(err,data) =>{
        console.log(data[0].ip)
        resolve({
          "ip" : data[0].ip,
          "loginTime" : data[0].loginTime
        })
      })
    })
  }
  let resullt =  await  query();
  ctx.body = resullt
}

module.exports = {
    chart,
    lastLogin
}

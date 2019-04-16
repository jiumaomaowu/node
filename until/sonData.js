class sonDatas {
  constructor(sonData,id) {
    this.sonData = sonData
    this.id = id
  }
 editData(){

 return  new Promise((resolve, reject) => {
    let son = []
    this.sonData.forEach(element => {
      let obj = {}
      obj.label = element
      obj.value = this.id+"_"+element
      son.push(obj)
    });

    resolve(son)
  })
 }
}
module.exports = sonDatas

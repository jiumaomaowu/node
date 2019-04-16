class Menus{
    constructor(menucom,menuarray, data){
        // console.log(1)
        this.menucom = menucom;
        this.menuarray = menuarray;
        this.data = data;
    }
    toArray(){
        
        this.data.forEach(item => {
            if (item.top_menu == "顶级菜单") {
                this.menuarray.push(item)
            } else {
                this.menucom.push(item)
            }
        })
        //ff console.log(this.menuarray)
        
        return this.toMenu(this.menuarray,this.menucom)
    }
    toMenu(menuarray,menucom){
        // console.log(3)
        let _that = this
       
        menuarray.forEach(element => {
            menucom.forEach(v => {
                // console.log(element.meta.title)
                if (element.meta.title == v.top_menu) {
                   
                    element.children.push(v)
                    element.children = Array.from(new Set(element.children))
                }
                if (element.children) {
                    _that.toMenu(element.children, menucom)
                }
            });
        })
        
        return menuarray;
        // return this.data
    }
}




module.exports = Menus
  
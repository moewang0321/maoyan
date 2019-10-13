/* 
    利用art-template模版加载html模块
    只进行逻辑，路由在router内
*/
const layoutView = require("../views/layout.art");

class Index {
    constructor() {
        /* this.render(); */
    }

    render() {
        /* 
        定义模块内部变量乱七八糟的……
        */
        const html = layoutView({});
        $("#root").html(html);
        $('footer li').on('click' , this.bindClick)

    }

    bindClick() {
        

        //hash页面切换（一个页面，切换hash值）
        location.hash = $(this).data('to');
    }


}

export default new Index();
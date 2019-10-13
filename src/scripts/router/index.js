//引入layout
import indexController from '../controller/';

import movieController from '../controller/movie';
import cityController from '../controller/city-list';
import cinemaController from '../controller/cinema';
import profileController from '../controller/profile';
import detailController from '../controller/detail';
//监听路由变化

class  Router{
    constructor(){
        
        this.render()

    }
    render(){
        window.addEventListener('load' , this.handlePageLoad.bind(this));
        window.addEventListener('hashchange' , this.handleHashChange.bind(this));
    }

    setActiveClass(hash) {
        $(`footer li[data-to=${hash}]`).addClass('active').siblings().removeClass('active');
    }

    renderDOM(hash) {
        let pagesControllers = {
            movieController,
            cityController,
            cinemaController,
            profileController,
            detailController
        };

        pagesControllers[hash + 'Controller'].render();
    }

    handlePageLoad() {

        let hash = location.hash.substr(1) || 'movie';
        let reg = new RegExp(/^(\w+)/ , 'g');
        let path = reg.exec(hash);
        indexController.render();
        
        location.hash = hash;
        this.renderDOM(path[1]);
        this.setActiveClass(path[1]);

    }

    handleHashChange(e) {

        let hash = location.hash.substr(1);
        let reg = new RegExp(/^(\w+)/ , 'g');
        let path = reg.exec(hash);
        this.renderDOM(path[1]);
        //设置高亮
        this.setActiveClass(path[1]);
    }
}

new Router();
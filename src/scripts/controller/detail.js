import detailView from "../views/detail.art";
const cinemaListView = require("../views/cinema-list.art");

import detailModel from "../models/detail";
import cinemaModel from "../models/cinema";

const BScroll = require("better-scroll");
const moment = require("moment");
moment().format();

class Detail {
    constructor(){
        this.list = []
    }
    calNum(snum) {
        let num = parseFloat(snum);
        if (num < 10000) {
            return num;
        } else {
            num = (num / 10000).toFixed(1);
            return (num = num + "万");
        }
    }

    getWeek(dayNum) {
        let num = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
        let oDate = new Date(); //获取当前时间
        let dayArr = []; //定义一个数组存储所以时间
        for (let i = 0; i < dayNum; i++) {
            dayArr[i] = [];
            dayArr[i].push(
                new Date(oDate.getFullYear(), oDate.getMonth(), oDate.getDate() + i)
            ); //把未来几天的时间放到数组里
            let year = dayArr[i][0].getFullYear(); //得到年份
            let month = dayArr[i][0].getMonth(); //得到月份
            let date = dayArr[i][0].getDate(); //得到日期
            let day = dayArr[i][0].getDay(); //得到周几
            let timeS = dayArr[i][0].getTime();

            month = month + 1;
            if (month < 10) month = "0" + month;
            if (date < 10) date = "0" + date;
            let time = "";
            time = year + "-" + month + "-" + date;
            dayArr[i][0] = time;
            //精确到天
            if (date == oDate.getDate()) {
                day = "今天";
            } else if (date == oDate.getDate() + 1) {
                day = "明天";
            } else if (date == oDate.getDate() + 2) {
                day = "后天";
            } else {
                day = "周" + num[day];
            }
            time = day + month + "月" + date + "日";
            dayArr[i][1] = time;
            dayArr[i][2] = timeS;
            console.log(dayArr[i]);
        }
        return dayArr; //返回一个数组。
    }
    renderer(list , cityId) {
        let cinemaListHtml = cinemaListView({
            list,
            cityId
        });

        $(".list-wrap").html(cinemaListHtml);
    }

    async render() {
        let that = this;
        let offset = 0;
        let hash = location.hash.substr(1);
        let cityId = $.fn.cookie('cityId')||1;
        console.log(cityId);
        let reg = new RegExp(/^(\w+)\/(\w+)/, "g");
        let path = reg.exec(hash);
        let movieId = path[2];
        let result = await detailModel.get({
            movieId
        });

        let detailMovie = result.detailMovie;
        detailMovie.snum = this.calNum(detailMovie.snum);

        let dayArr = this.getWeek(7);

        let html = detailView({
            detailMovie,
            dayArr
        });

        $("#root").html(html);
        $('title').html(detailMovie.nm);

        
        let cinResult = await cinemaModel.get({
            offset,
            cityId
        });
        let {
            offset: listOffset,
            limit,
            
        } = cinResult.paging;
        this.limit = limit;
        offset = listOffset;
        let list = (this.list = cinResult.cinemas);

        that.renderer(list, cityId);

        $(".showDay")
            .eq(0)
            .addClass("chosen");
        let dataMessage = $(".showDay.chosen").data("day");
        
        $(".showDay").on("click", async function () {
            offset = $(this).data('offset');
            console.log(offset);
            let result = await cinemaModel.get({
                offset,
                cityId
            });
            that.list = result.cinemas;
            that.renderer(that.list, cityId);
            $('.more').css('display' , 'none');
            $(this)
                .addClass("chosen")
                .siblings(".showDay")
                .removeClass("chosen");
                dataMessage = $(this).data("day");
                console.log(dataMessage);
        });
        
        $('.more').css('display' , 'none')



        /* let bScroll = new BScroll.default($('.detail-root').get(0), {
            probeType: 3,
            bounce: false,
            click:true
        });

        bScroll.on('scroll' , function(){
            if(this.y <= -300){
                $('.detail-root').addClass('fixedNav')
            }else{
                console.log(2);
            }
        }) */

        /* 吸顶效果 */
        let detailRoot = document.querySelector('.detail-root');
        detailRoot.addEventListener('scroll', function () {
            
            if($(this).scrollTop() >=300){
                $('.detail-root').addClass('fixedNav')
                $('.cinema-list').css('padding-top' , '85px');
            }else{
                $('.detail-root').removeClass('fixedNav')
                $('.cinema-list').css('padding-top' , '0');
            }
        })


        $('.movie-detail').on('click' , function(){
            $('.mask').removeClass('hidden');
        })
        $('.mask').on('click' , function(){
            $(this).addClass('hidden');
        })
    }
}

export default new Detail();
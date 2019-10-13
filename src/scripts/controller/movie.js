import indexController from "./index";

const movieView = require("../views/movie.art");
const movieListView = require("../views/movie-list.art");
const mostExpectedView = require("../views/movie-most-expected.art");
const comingListView = require("../views/movie-coming-list.art");

const movieModel = require("../models/movie");
const comingListModel = require("../models/movie-coming-list");
const mostExpectedModel = require("../models/movie-most-expected");
const movieMoreModel = require("../models/movie-more");

const BScroll = require("better-scroll");
const _ = require('lodash');

class Movie {
    constructor() {
        /* this.render(); */

        this.posList = [];
        this.posPageNo = 1;
        this.posMovieCount = 0;
        this.posPageSize = 10;

        this.explist = [];
        this.exppageNo = 1;
        this.expCount = 0;
        this.limit = 10;

        this.list = [];
        this.pageNo = 1;
        this.movieCount = 0;
        this.pageSize = 10;
    }

    rendererPos(list) {

        

        let movieListHtml = movieListView({
            list
        });

        $(".n-hot>.list-wrap").html(movieListHtml);
    }
    renderer(list) {
        let expectedListHtml = mostExpectedView({
            list
        });

        $(".most-expected-body").html(expectedListHtml);
        
    }
    rendererComing(list) {
        let comingListHtml = comingListView({
            list
        });

        $(".coming-list").html(comingListHtml);
    }
    async render() {

        this.posPageNo = this.exppageNo = this.pageNo = 1;

        indexController.render();

        let that = this;
        let offset = 0;
        let result = await mostExpectedModel.get({
            offset
        });
        let {
            offset: expOffset,
            total: expTotal
        } = result.paging;
        offset = expOffset;
        that.expCount = expTotal;

        let city = $.fn.cookie('city')||"北京";
        let cityId = $.fn.cookie('cityId')||1;
        let comingResult = await comingListModel.get();
        let listData = movieView({
            city
        });
        let $main = $("main");

        $('title').html('狗💩电影');
        $(".nav-header").html("狗💩电影");

        $main.html(listData);

        let posResult = await movieModel.get();
        let {
            movieList: poslist,
            movieIds: posMovieIds
        } = posResult;
        this.posList = poslist;
        this.rendererPos(poslist);
        that.posMovieCount = posMovieIds.length;

        let {
            coming: list
        } = result;
        let {
            coming: comingList,
            movieIds
        } = comingResult;

        this.list = comingList;
        this.explist = list;
        this.movieCount = movieIds.length;

        /* 整理数据 */
        {
            var map = {},
                dest = [];
            for (var i = 0; i < comingList.length; i++) {
                var ai = comingList[i];
                if (!map[ai.comingTitle]) {
                    dest.push({
                        comingTitle: ai.comingTitle,
                        data: [ai]
                    });
                    map[ai.comingTitle] = ai;
                } else {
                    for (var j = 0; j < dest.length; j++) {
                        var dj = dest[j];
                        if (dj.comingTitle == ai.comingTitle) {
                            dj.data.push(ai);
                            break;
                        }
                    }
                }
            }
        }

        this.renderer(list);
        this.rendererComing(dest);

        


        let $listWrap = $(".page");
        let $down = $("#download-header");
        let $dwZip = $(".download-tip");

        /* 正在热映betterScroll */
        let posBScroll = new BScroll.default($listWrap.get(0), {
            probeType: 3,
            bounce: false,
            click:true
        });

        /* 最受期待betterScroll */
        let expectedBScroll = new BScroll.default($(".most-expected-list").get(0), {
            probeType: 2,
            scrollX: true,
            eventPassthrough: 'vertical',
            bounce: false,
            click:true
        });

        /* 即将上映betterScroll */
        let bScroll = new BScroll.default($listWrap.get(1), {
            probeType: 3,
            bounce: false,
            click:true
        });

        posBScroll.on("scroll", function () {
            if (this.y <= -106) {
                $down.addClass("hidden");
                $dwZip.removeClass("hidden");
            }
            if (this.y > -106) {
                $down.removeClass("hidden");
                $dwZip.addClass("hidden");
            }
        });

        posBScroll.on("scrollEnd", _.throttle(async function () {
            let totalPage =
                Math.ceil((that.posMovieCount - 12) / that.posPageSize) + 1;
            if (this.maxScrollY >= this.y && totalPage >= that.posPageNo) {
                let idList = [];
                for (
                    let i = 12 + (that.posPageNo - 1) * 10; i < 12 + that.posPageNo * 10;
                    ++i
                ) {
                    if (posMovieIds[i] == null || posMovieIds[i] == undefined) {
                        continue;
                    }
                    idList.push(posMovieIds[i]);
                }

                let movieMoreIds = idList.join(",");

                that.posPageNo++;

                let result = await movieMoreModel.get({
                    movieMoreIds: movieMoreIds
                });

                let {
                    coming: list
                } = result;
                that.posList = [...that.posList, ...list];
                that.rendererPos(that.posList);

                console.log(totalPage, that.posPageNo);
                if (that.posPageNo <= totalPage) {
                    $('.more').css('display', 'block');
                } else {
                    $('.more').css('display', 'none');
                }
            }
        }));

        expectedBScroll.on("scrollEnd", _.throttle(async function () {
            let total = that.expCount;
            let totalPage = Math.ceil((total - that.limit) / that.limit) + 1;
            if (this.maxScrollX >= this.x && totalPage >= that.pageNo) {
                offset = offset + that.limit;
                let result = await mostExpectedModel.get({
                    offset
                });

                let {
                    coming: list
                } = result;
                that.explist = [...that.explist, ...list];
                that.renderer(that.explist);
                /* console.log(that.explist); */
            }
        }));

        bScroll.on("scroll", function () {
            if (this.y <= -106) {
                $down.addClass("hidden");
                $dwZip.removeClass("hidden");
            }
            if (this.y > -106) {
                $down.removeClass("hidden");
                $dwZip.addClass("hidden");
            }
        });

        bScroll.on("scrollEnd", _.throttle(async function () {
            let totalPage = Math.ceil((that.movieCount - 10) / that.pageSize) + 1;
            if (this.maxScrollY >= this.y && totalPage >= that.pageNo) {
                let idList = [];
                for (
                    let i = 10 + (that.pageNo - 1) * 10; i < 10 + that.pageNo * 10;
                    ++i
                ) {
                    if (movieIds[i] == null || movieIds[i] == undefined) {
                        continue;
                    }
                    idList.push(movieIds[i]);
                }

                let movieMoreIds = idList.join(",");

                that.pageNo++;

                let result = await movieMoreModel.get({
                    movieMoreIds: movieMoreIds
                });

                let {
                    coming: list
                } = result;
                that.list = [...that.list, ...list];

                {
                    var map = {},
                        dest = [];
                    for (var i = 0; i < that.list.length; i++) {
                        var ai = that.list[i];
                        if (!map[ai.comingTitle]) {
                            dest.push({
                                comingTitle: ai.comingTitle,
                                data: [ai]
                            });
                            map[ai.comingTitle] = ai;
                        } else {
                            for (var j = 0; j < dest.length; j++) {
                                var dj = dest[j];
                                if (dj.comingTitle == ai.comingTitle) {
                                    dj.data.push(ai);
                                    break;
                                }
                            }
                        }
                    }
                }
                that.rendererComing(dest);
                if (that.posPageNo <= totalPage) {
                    $('.more').css('display', 'block');
                } else {
                    $('.more').css('display', 'none');
                }
            }
        }));

        /* 电影列表绑定点击事件 */


        $('.n-hot .list-wrap').on('click' , function(e){
    
            e = e;
            let event = e.target;
            if($(event).hasClass('item')){
                event = e.target
            }else{
                event = $(event).parents('.item');
            }
            console.log(event);
            let movieId = $(event).data('id');
            location.hash = `detail/${movieId}`
        })
            
        $('.f-hot .list-wrap').on('click' , function(e){
    
            e = e;
            let event = e.target;
            if($(event).hasClass('item')){
                event = e.target
            }else{
                event = $(event).parents('.item');
            }
            console.log(event);
            let movieId = $(event).data('id');
            location.hash = `detail/${movieId}`
        })
        

        /* end */
        
        /* 城市选择 */
        $('.city-entry').on('click' , function(){
            location.hash = $(this).data('to');
            
        })

        /* 切换正在热映和即将上映 */

        $(".hot-item").on("click", function () {
            let tab = $(this).data("tab");
            $('.switch-hot').data('active' , tab);
            $(".hot-item").removeClass("active");
            $(this).addClass("active");
            $(".page").removeClass("active");
            $(tab).addClass("active");
            posBScroll.y = 0;
            bScroll.y = 0;
            $down.removeClass("hidden");
            $dwZip.addClass("hidden");
            
        });
        /* end */
    }
}

export default new Movie();
const cinemaView = require('../views/cinema.art');
const cinemaListView = require('../views/cinema-list.art');
const cinemaModel = require("../models/cinema");

const BScroll = require("better-scroll");

class Cinema {
  constructor() {
    this.list = [];
    this.pageNo = 1;
    this.limit = 20;
  }

  renderer(list) {
    let cinemaListHtml = cinemaListView({
      list
    });

    $(".list-wrap").html(cinemaListHtml);
  }

  async render() {
    let that = this;
    let city = $.fn.cookie('city')||"北京";
    let cityId = $.fn.cookie('cityId')||1;
    let offset = 0;
    let result = await cinemaModel.get({
      offset,
      cityId
    });
    
    let html = cinemaView({
      city
    });
    $('main').html(html);
    $('title').html('影院');
    $('.nav-header').html('影院');

    let {
      offset: listOffset,
      total: cinemaCount,
      limit,
    } = result.paging;
    this.limit = limit;
    offset = listOffset;
    let list = this.list = result.cinemas;

    that.renderer(list);

    let bScroll = new BScroll.default($('.cinema-list').get(0), {
      probeType: 3,
      bounce: false
    });

    bScroll.on('scrollEnd', _.throttle(async function () {
      let total = cinemaCount;
      let totalPage = Math.ceil((total - that.limit) / that.limit) + 1;
      if (this.maxScrollY >= this.y && totalPage >= that.pageNo) {
        offset = offset + that.limit;
        let result = await cinemaModel.get({
          offset,
          cityId
        });

        let {
          cinemas: list
        } = result;
        that.list = [...that.list, ...list];
        that.renderer(that.list);
        if (that.posPageNo <= totalPage) {
          $('.more').css('display', 'block');
        } else {
          $('.more').css('display', 'none');
        }
      }
    }))
  }
}

export default new Cinema()
const cityView = require("../views/city-list.art");

const cityModel = require("..//models/city-list");

const BScroll = require('better-scroll');

class City {
    formatList(data, field) {
        var letter_reg = /^[A-Z]$/;
        var fin = [];
        var list = new Array();
        for (var i = 0; i < data.length; i++) {
            // 添加 # 分组，用来 存放 首字母不能 转为 大写英文的 数据
            list["#"] = new Array();
            // 首字母 转 大写英文
            var letter = data[i][field].substr(0, 1).toUpperCase();
            // 是否 大写 英文 字母
            if (!letter_reg.test(letter)) {
                letter = "#";
            }
            // 创建 字母 分组
            if (!(letter in list)) {
                list[letter] = new Array();
            }
            // 字母 分组 添加 数据
            list[letter].push(data[i]);
        }
        // 转换 格式 进行 排序；
        var resault = new Array();
        for (var key in list) {
            resault.push({
                letter: key,
                list: list[key]
            });
        }
        resault.sort(function (x, y) {
            return x.letter.charCodeAt(0) - y.letter.charCodeAt(0);
        });
        // # 号分组 放最后
        var last_arr = resault[0];
        resault.splice(0, 1);

        // 转换 数据 格式
        for (var i = 0; i < resault.length; i++) {
            var json_sort = {};
            json_sort["title"] = resault[i].letter;
            json_sort["items"] = resault[i].list;
            fin.push(json_sort);
        }

        return fin;
    }

    async render() {
        await cityModel.get();
        let historyCityArr = [];
        
        let resultPre = JSON.parse(localStorage.getItem("city-list")).cts;
        let history = JSON.parse(localStorage.getItem("city-history")) || null;
        let result = this.formatList(resultPre, "py");
        console.log(result);
        let html = cityView({
            result,
            history
        });
        $("#root").html(html);


        $('.nav .nav-item').on('click' , function(){
            let s = $(this).html();
            $("#showLetter span").html(s);
            let id = '#' + $(this).data('id');
            $('#city-list').css('top' , -$(id).offset().top )
            
            $("#showLetter").show();
            setTimeout(() => {
                $("#showLetter").hide();
            }, 500);
            
            console.log($(id).offset().top);
            //TODO:怎么点击滚动
            

        })
        
        $('.city-item').on('click' , function(){
            $.fn.cookie('city',$(this).data('nm'),{ expires : 3 });
            $.fn.cookie('cityId',$(this).data('id'),{ expires : 3 });
            let city = {
                id : $(this).data('id'),
                nm : $(this).data('nm')
            }
            historyCityArr.push(city);
            let cityStor = {
                item : historyCityArr
            }
            localStorage.setItem(
                "city-history", JSON.stringify(cityStor)
            );
            window.history.back();
            

        })
        
    
    }
}

export default new City();
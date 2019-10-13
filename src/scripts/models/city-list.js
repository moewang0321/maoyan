module.exports = {
    get() {
        var r = '';
        $.ajax({
            url: `/api/dianying/cities.json`,
            type: "GET",//请求方式为get
            data:{},
            success: function (re) {
                localStorage.setItem('city-list' , JSON.stringify(re));
            }
        });
    }
};
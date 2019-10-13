module.exports = {
    get({
        offset=0,
        cityId=1
    }) {
        var r = '';
        $.ajax({
            async: false,
            url: `/api/ajax/cinemaList?offset=${offset}&limit=20&cityId=${cityId}`,
            success: function (re) {
                r = re;
            }
        });
        return r;
    }
};
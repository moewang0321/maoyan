module.exports = {
    get() {
        var r = {};
        $.ajax({
            async: false,
            url: `/api/ajax/movieOnInfoList?token=`,
            success: function (re) {
                r = re;
            }
        });
        return r;
    }
};
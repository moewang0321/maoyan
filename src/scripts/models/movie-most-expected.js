module.exports = {
    get({
        offset=0
    }) {
        var r = {};
        $.ajax({
            async: false,
            url: `/api/ajax/mostExpected?ci=1&limit=10&offset=${offset}&token=`,
            success: function (re) {
                r = re;
            }
        });
        return r;
    }
};
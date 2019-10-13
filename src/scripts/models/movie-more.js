module.exports = {
    get(
        {
            movieMoreIds=1,
        }
    ) {
        var r = '';
        $.ajax({
            async: false,
            url: `/api/ajax/moreComingList?token=&movieIds=${movieMoreIds}`,
            success: function (re) {
                r = re;
            }
        });
        return r;
    }
};
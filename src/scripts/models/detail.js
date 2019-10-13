module.exports = {
    get({
        movieId,
    }) {
        var r = '';
        $.ajax({
            async: false,
            url: `/api/ajax/detailmovie?movieId=${movieId}`,
            success: function (re) {
                r = re;
            }
        });
        return r;
    }
};
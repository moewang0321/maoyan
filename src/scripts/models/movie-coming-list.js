module.exports = {
    get(
        
    ) {
        var r = '';
        $.ajax({
            async: false,
            url: `/api/ajax/comingList?ci=1&token=&limit=10`,
            success: function (re) {
                r = re;
            }
        });
        return r;
    }
};
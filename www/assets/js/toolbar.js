"use strict";

/**
 * Toolbar handling
 */
;(function($) {
    $.fn.toolbar = function(callbacks)
    {
        var itemCallbacks = callbacks || {};

        var selectItem = function(e, data) {
            var linkTarget = $(e.target).attr("href"),
                listElement = $(e.target).parent();

            e.preventDefault();

            listElement.siblings().removeClass("active");
            listElement.addClass("active");

            $(".content > div").hide();
            $(".content > ." + linkTarget).show();

            if (itemCallbacks[linkTarget]) {
                itemCallbacks[linkTarget](e, data);
            }

            return false;
        };

        return this.each(function() {
            $(this).find("li > a").unbind("click");
            $(this).find("li > a").bind("click", selectItem);
        });
    };
}(jQuery));

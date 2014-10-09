"use strict";

/**
 * Toolbar handling
 */
;(function($) {
    $.fn.toolbar = function(callbacks)
    {
        var itemCallbacks = callbacks || {};

        var selectPage = function(e, data) {
            var pageName = data.page || "start";

            $(".content > div").hide();
            $(".content > ." + pageName).show();

            if (itemCallbacks[pageName]) {
                itemCallbacks[pageName](e, data);
            }
        }

        var selectFromLink = function(e, data) {
            var linkTarget, listElement;

            e.preventDefault();

            if ((linkTarget = $(e.target).attr("href")) &&
                (listElement = $(e.target).parent())) {
                listElement.siblings().removeClass("active");
                listElement.addClass("active");
            }

            selectPage(e, {page: linkTarget});

            return false;
        };

        return this.each(function() {
            $(this).find("li > a").unbind("click");
            $(this).find("li > a").bind("click", selectFromLink);

            $(this).bind("displayPage", selectPage);
        });
    };
}(jQuery));

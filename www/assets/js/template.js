(function( global ) {

    template = function() {
    };

    /**
     * Template cache
     */
    template.cache = {};

    /**
     * Display template in defined target node
     *
     * @param string target
     * @param string path
     * @param object viewData
     * @param function success
     */
    template.showTemplate = function(target, path, viewData, success) {
        (function() {
            if (template.cache[path]) {
                var deferred = new jQuery.Deferred();
                deferred.resolve(template.cache[path]);
                return deferred.promise();
            }

            return $.get(path);
        }()).then(function(templateData) {
            template.cache[path] = templateData;

            $(target).html(
                Mustache.to_html(templateData, viewData)
            );

            if (success) {
                success();
            }
        });
    }

    // Exports
    global.Recipe = global.Recipe || {};
    global.Recipe.template = template;

})(this);

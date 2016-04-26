/**
 * jQuery template plugin using EJS syntax
 * 
 * @copyright johnresig for most the compile code implementatio
 * @see http://ejohn.org/blog/javascript-micro-templating/
 */
;(function ($, window, document) {
    'use strict';

    // undefined is used here as the undefined global
    // variable in ECMAScript 3 and is mutable (i.e. it can
    // be changed by someone else). undefined isn't really
    // being passed in so we can ensure that its value is
    // truly undefined. In ES5, undefined can no longer be
    // modified.

    // window and document are passed through as local
    // variables rather than as globals, because this (slightly)
    // quickens the resolution process and can be more
    // efficiently minified (especially when both are
    // regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = 'templates';
    var templates = {};
    
    /**
     * Generate a reusable function that will serve as a template
     * generator (and which will be cached).
     * @return {Function} a reusable function that will serve as a template
     */
    function compileTemplateString(templateString) {
        return new Function("ctxt",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +
            // Introduce the data as local variables using with(){}
            "with(ctxt || {}){p.push('" +
            // Convert the template into pure JavaScript
            templateString.replace(/[\r\t\n]/g, " ")
            .replace(/'(?=[^%]*%>)/g,"\t")
            .split("'").join("\\'")
            .split("\t").join("'")
            .replace(/<%=(.+?)%>/g, "',$1\n,'")
            .split("<%").join("');\n")
            .split("%>").join("\np.push('")
            +  "');}return p.join('');");
    }

    /**
     * Fetch all defined templates a template or retrieve one 
     * @return {Object} the current template set
     */
    $.templates = function () {
        return templates;
    };

    /**
     * Render a template or retrieve one 
     * @param  {[type]} id   template id
     * @param  {[type]} data Template context
     * @return {String} rendering of compiled template
     */
    $.template = function (id, data) {
        return templates[id](data);
    };
    
    /**
     * Render into selected elements a given template
     * @param  {templateId} id   template id
     * @param  {Object}     data Template context
     */
    $.fn.template = function (id, data) {
        $(this).html($.template(id, data || {}));
    };
    
    /**
     * Resgiter a a set of 
     * @return {[type]} [description]
     */
    $.fn.loadTemplates = function () {
        $(this).each(function () {
            var id = $(this).data('id') ? $(this).data('id') : this.id;
            if (!id) {
                console.error('Invalid template ' + this);
            } else if (templates[id]) {
                console.error('Template ' + id + 'already defined');
            } else {
                templates[id] = compileTemplateString($(this).html());
            }
        });
    };

})(jQuery);


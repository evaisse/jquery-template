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
    

    function stringify(obj) {
        if (typeof obj == "string") {
            return obj;
        } else if (obj === null || obj === false || obj === NaN || obj === undefined) { // ''
            return '';
        } else if ((obj+"").indexOf('[') === 0) { // default object2string should be avoid [object Object]
            return '';
        } else { // stringifable object
            return (obj+"");
        }
    }

    /**
     * Generate a reusable function that will serve as a template
     * generator (and which will be cached).
     * @return {Function} a reusable function that will serve as a template
     */
    function compileTemplateString(templateString, id) {
        id = String(id || 'anonymous');
        var comp = new Function("ctxt",
            "/* " + id + " */ var p=[],print=function(){p.push.apply(p,arguments);};" +
            "$.template.scope = ctxt;" +
            // Introduce the data as local variables using with(){}
            "with(ctxt || {}){p.push('" +
            // Convert the template into pure JavaScript
            templateString.replace(/[\r\t\n]/g, " ")
            .replace(/'(?=[^%]*%>)/g,"\t")
            .split("'").join("\\'")
            .split("\t").join("'")
            .replace(/<%-(.+?)%>/g, "',stringify($1)\n,'")
            .replace(/<%=(.+?)%>/g, "',$.template.htmlEscape($1)\n,'")
            .split("<%").join("');\n")
            .split("%>").join("\np.push('")
            +  "');}return p.join('');");
        comp.id = id;
        return comp;
    }

    /**
     * Escape input string before HTML inclusion
     * @see https://jsperf.com/htmlencoderegex/25
     * @param  {String} unsafestring A string to escape before any input into html content
     * @return {String} safe string input
     */
    function htmlEscape(unsafestring) {
        return stringify(unsafestring)
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
    }

    /**
     * Render a template or retrieve one 
     * @param  {String} id   template id
     * @param  {Object} data Template context
     * @return {String} rendering of compiled template
     */
    $.template = function (id, data) {
        if (!arguments.length) return templates;
        else if (arguments.length == 1) return templates[id];
        else return templates[id](data);
    };
    

    $.template.compile = compileTemplateString;
    $.template.htmlEscape = htmlEscape;

    /**
     * Register a set of templates from DOM elements contents
     * @example <script type="text/ejs" id="my-template">... template ...</script>
     */
    $.fn.template = function (templateId, data) {
        var n = arguments.length;
        $(this).each(function () {
            if (!n) {
                var id = $(this).data('id') ? $(this).data('id') : this.id;
                if (!id) {
                    console.error('Invalid template ' + this);
                } else if (templates[id]) {
                    console.error('Template ' + id + ' already defined');
                } else {
                    templates[id] = compileTemplateString($(this).html(), id);
                }
            } else {
                $(this).html(templates[templateId](data));
            }
        });
        return $(this);
    };

})(jQuery);
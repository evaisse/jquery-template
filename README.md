jquery-template
===

An EJS jQuery template engine that allow embeddeding JS into HTML with &lt;% %> &amp; &lt;%= %> tags (Code is minimal < 1k minified+gzipped).

Templates are compiled into a re-usable function. Templating syntax is similar to https://www.npmjs.com/package/ejs

 - Control flow with <% %>
 - Escaped output with <%= %>
 - Unescaped raw output with <%- %>

Quick demos
---

 - https://rawgit.com/evaisse/jquery-template/master/example1.html
 - https://rawgit.com/evaisse/jquery-template/master/example2.html


Quickstart
===

```html
<div id="result"></div>
<script id="template-menu" type="text/ejs">
  <menu>
      <header><%= header %></header>
      <ul>
      <% items.forEach(function (item) { %>
          <% // note the raw output here using '-' instead of "=" %>
          <li><%- $.template('item', item) %></li>
      <% }) %>
      </ul>
  </menu>
</script>
```

```html
<!-- You can use data-id -->
<script data-id="item" type="text/ejs">
    <% if (ctxt) { %>
        <item action="<%= id %>" id="<%= id %>"><%= this.label || id %></item>
    <% } else { %>
        -
    <% } %>
</script>
```


```javascript
var payload = {
    "header": "SVG Viewer",
    "items": [
        {"id": "Open"},
        {"id": "OpenNew", "label": "Open New"},
        null,
        {"id": "ZoomIn", "label": "Zoom In"},
        ...
        {"id": "ZoomOut", "label": "Zoom Out"},
    ]
};

$('[type="text/ejs"]').template(); // compile DOM template tags
$("#result").template('template-menu', payload); // replate #result-container with rendered template as string
$.template(); // fetch a dictonnary of all registered templates
$.template.compile(templateAsString); // low-level template compilation method
$.template('template-id', payload); // return rendered template as string
$.template('template-id')(payload); // return a given compiled template, same as above
```

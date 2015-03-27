(function () {

    docTool = {};

    docTool.init = function (params) {

    };

    docTool.draw = function (params) {
        // Create all of the templates
        var tmpls = $('#docTemplate').tmpl(data.documents);

        $(tmpls[0]).appendTo('#document-container');
        $(tmpls[1]).appendTo('#document-container');
        $(tmpls[2]).appendTo('#document-container');
        $(tmpls[3]).appendTo('#document-container');
    };

    docTool.add = function(doc, docId){
        // If the document object wasn't passed in then find it based on id
        doc = doc || data.documents.filter(function(d){return docId == d.id;});
        // Create the template for that data item and add it to the document container
        // TODO should new documents be put at the top or bottom?
        var tmpl = $('#docTemplate').tmpl([doc]).appendTo('#document-container');
    };

    docTool.collapse = function(d){
        var doc = $(d).parent();
        var text = doc.find(".doc-item-text");
        // If the text was hidden then we are know opening it, so add to view count
        if(text.css('display') == 'none'){
            doc.tmplItem().data.views++;
            $(d).find(".views").html(doc.tmplItem().data.views);
            console.log($(d).find(".views"));
        }
        text.slideToggle();
    };

    docTool.collapseAll = function(){

    };

    docTool.addAll = function(){

    };

    docTool.clearAll = function(){

    };

})();

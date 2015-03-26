(function () {

    docTool = {};

    docTool.init = function (params) {

    };

    docTool.draw = function (params) {
        // Create all of the templates
        var tmpls = $('#docTemplate').tmpl(data.documents);

        console.log(tmpls);
        $(tmpls[0]).appendTo('#document-container');
    };

    docTool.add = function(doc, docId){
        // If the document object wasn't passed in then find it based on id
        doc = doc || data.documents.filter(function(d){return docId == d.id;});
    };

    docTool.collapseAll = function(){

    };

    docTool.addAll = function(){

    };

    docTool.clearAll = function(){

    };

})();

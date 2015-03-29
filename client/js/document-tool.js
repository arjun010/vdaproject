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
        // TODO animate the height as we change it dynamically
        if(text.css('display') == 'none'){
            doc.tmplItem().data.views++;
            $(d).find(".views").html(doc.tmplItem().data.views);
            var newHeight = doc.height() + text.height();
            console.log("Adding height:" + newHeight);
            doc.height(newHeight);
        } else {
            var newHeight = doc.height() - text.height();
            console.log("Removing height:" + newHeight);
            doc.height(newHeight);
        }
        text.slideToggle();
        doc.parent().update();
    };

    docTool.collapseAll = function(){
        $(".doc-item-text").each(function(i,t){
            var doc = $(t).parent();
            var newHeight = doc.height() - $(t).height();
            doc.height(newHeight);
            $(t).toggle(false);
        });
    };

    docTool.addAll = function(){
        var enter = data.documents.filter(function(d){
            var ret = true;
            $(".doc-item").each(function(i,t){
                if($(t).tmplItem().data === d){
                    ret = false;
                }
            });
            return ret;
        });
        // TODO is there a better way to do this than a for loop?
        // Get all the current doc's shown
        $('#docTemplate').tmpl(enter).appendTo('#document-container');
    };

    docTool.clearAll = function(){
        $(".doc-item").remove();
    };

    docTool.scrollDocList = function(){
        $(".doc-item").each(function(i,e){
            var d = $(e);
            var text = d.find(".doc-item-text");
            var header = d.find(".doc-item-header");
            var t = d.offset().top - d.parent().offset().top;
            var h = d.height();
            console.log(t + h);
            if(t < 0 && h > 29 && (t + h) > 29) {
                header.css({top: -t + 'px'});
            } else {
                // TODO fix this so I'm not setting it every time just when it goes back to normal
                header.css({top: '0px'});
            }
        });
    };

    //$(window).scroll(function(){
    //    $("#download-pdf").stop().animate({"marginTop": ($(window).scrollTop()) + "px", "marginLeft":($(window).scrollLeft()) + "px"}, tHover);
    //});

})();

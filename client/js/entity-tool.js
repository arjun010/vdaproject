(function () {

    entTool = {};

    entTool.init = function (params) {

    };

    entTool.draw = function (params) {
        // Create all of the templates
        var tmpls = $('#entTemplate').tmpl(data.entities);

        // Foreach over the templates in order to extract the entity type
        // this decides which column it is added to
        tmpls.each(function(i,t){
            if($(this).tmplItem().data && $(this).tmplItem().data.type){
                var column = '#entity-list-'+$(this).tmplItem().data.type.classname;
                $(this).appendTo(column);
            }
        });
    };

})();
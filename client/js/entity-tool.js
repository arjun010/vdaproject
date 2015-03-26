(function () {

    entTool = {};

    entTool.init = function (params) {
        entTool.currPage = 1;
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

    entTool.jumpToPage = function(pageNum){
        $('.entity-page-btn-'+pageNum+', #entity-page-'+pageNum).addClass('active');
        $('.entity-page-btn-'+this.currPage+', #entity-page-'+this.currPage).removeClass('active');
        this.currPage = pageNum;
    };

    entTool.scrollEntity = function(e){
        console.log(e);
    }

    entTool.sort = function(param){
        var sortFun = null;
        switch(param){
            case 'alpha':
                sortFun = function(a,b){
                    var nameA = $(a).tmplItem().data.name;
                    var nameB = $(b).tmplItem().data.name;

                    if (nameA < nameB) return -1;
                    if (nameA > nameB) return 1;
                    return 0;
                };
                break;
            case 'alpha-rev':
                sortFun = function(a,b){
                    var nameA = $(a).tmplItem().data.name;
                    var nameB = $(b).tmplItem().data.name;

                    if (nameA < nameB) return 1;
                    if (nameA > nameB) return -1;
                    return 0;
                };
                break;
            case 'freq':
                sortFun = function(a,b){
                    var freqA = $(a).tmplItem().data.frequency;
                    var freqB = $(b).tmplItem().data.frequency;

                    if (freqA < freqB) return 1;
                    if (freqA > freqB) return -1;
                    return 0;
                };
                break;
            case 'freq-rev':
                sortFun = function(a,b){
                    var freqA = $(a).tmplItem().data.frequency;
                    var freqB = $(b).tmplItem().data.frequency;

                    if (freqA < freqB) return -1;
                    if (freqA > freqB) return 1;
                    return 0;
                };
                break;
        }
        Object.keys(main.entityTypes).forEach(function(e){
            console.log(e);
            var entities = $('#entity-list-'+ e + ' > .entity-list-item');
            entities.sort(sortFun);
            entities.detach().appendTo('#entity-list-'+ e);
        });
    }

})();
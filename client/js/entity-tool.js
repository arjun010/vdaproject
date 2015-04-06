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
                var type = $(this).tmplItem().data.type.classname;
                $(this).addClass('entity-type-' + type);
                $(this).appendTo('#entity-list-'+ type);
            }
        });

        tmpls.single_double_click(300);

        $('.entity-column-list').selectable({distance: 1});
    };

    entTool.jumpToPage = function(pageNum){
        $('.entity-page-btn-'+pageNum+', #entity-page-'+pageNum).addClass('active');
        $('.entity-page-btn-'+this.currPage+', #entity-page-'+this.currPage).removeClass('active');
        this.currPage = pageNum;

        d3.data(data.documents, function(d){return d.id;})
    };

    jQuery.prototype.single_double_click = function(timeout) {
        return this.each(function(){
            var clicks = 0, self = this;
            jQuery(this).click(function(event){
                clicks++;
                if (clicks == 1) {
                    setTimeout(function(){
                        if(clicks == 1) {
                            entTool.snglClick(event.target,event);
                        } else {
                            entTool.dblClick(event.target,event);
                        }
                        clicks = 0;
                    }, timeout || 300);
                }
            });
        });
    }

    entTool.snglClick = function(t,e){
        // handle class for this element
        var clicked = $(t);
        clicked = clicked.add(clicked.closest('li'));
        clicked = clicked.add(clicked.closest('span.frequency'));
        clicked = clicked.add(clicked.closest('span.name'));
        var s = clicked.hasClass('ui-selected');
        if(!e.metaKey && !e.ctrlKey) {
            var classname = $(t).tmplItem().data.type.classname;
            $('#entity-list-'+classname+' .ui-selected').removeClass('ui-selected');
        }
        if(s){
            clicked.removeClass('ui-selected');
        } else {
            clicked.addClass('ui-selected');
        }
    };

    entTool.dblClick = function(t,e){
        var clicked = $(t);
        clicked = clicked.add(clicked.closest('li'));
        clicked = clicked.add(clicked.closest('span.frequency'));
        clicked = clicked.add(clicked.closest('span.name'));
        if(!e.metaKey && !e.ctrlKey) {
            var classname = $(t).tmplItem().data.type.classname;
            $('#entity-list-'+classname+' .ui-selected').removeClass('ui-selected');
        }
        clicked.addClass('ui-selected');
        $(t).tmplItem().data.docList.forEach(function(d){
            docTool.add(d);
        });
    };

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
            var entities = $('#entity-list-'+ e + ' > .entity-list-item');
            entities.sort(sortFun);
            entities.detach().appendTo('#entity-list-'+ e);
        });
    }

})();
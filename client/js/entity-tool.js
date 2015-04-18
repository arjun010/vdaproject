(function () {

    entTool = {};

    entTool.init = function (params) {
        entTool.currPage = 1;
    };

    entTool.draw = function (params) {
        // Create all of the templates
        entTool.tmpls = $('#entTemplate').tmpl(data.entities);

        // Foreach over the templates in order to extract the entity type
        // this decides which column it is added to
        entTool.tmpls.each(function(i,t){
            if($(this).tmplItem().data && $(this).tmplItem().data.type){
                var type = $(this).tmplItem().data.type.classname;
                $(this).addClass('entity-type-' + type);
                $(this).appendTo('#entity-list-'+ type);
            }
        });

        entTool.tmpls.single_double_click(210);

        $('.entity-column-list').selectable({distance: 1, selected:
            function(event, target){entTool.selectedCallback(target.selected);}});
    };

    entTool.jumpToPage = function(pageNum){
        $('.entity-page-btn-'+pageNum+', #entity-page-'+pageNum).addClass('active');
        $('.entity-page-btn-'+this.currPage+', #entity-page-'+this.currPage).removeClass('active');
        this.currPage = pageNum;

        d3.data(data.documents, function(d){return d.id;})
    };

    entTool.selected = function(params){
        if(params && params['parentId']){
            return $('#'+params['parentId']+' > .ui-selected.entity-list-item').not(params.target);
        }
    };

    entTool.action = function(action){
        console.log(action);
        switch(action.classname){
            case 'entity-edit':
                edit(action);
                break;
            case 'entity-remove':
                remove(action);
                break;
            case 'entity-change-type':{

            }
                break;
            case 'entity-show-docs':
                showDocs(action);
                break;
            case 'entity-create-alias':{

            }
                break;
        }
    };

    function remove(action){
        // TODO check if there's another entity of the same type? and ask to merge or delete that one too
        if(confirm('Remove entity from analysis?')){
            removeEntity(action.params.targetItem, action.params.target, docTool.find(action.params), null, null);
        }
    }

    function showDocs(action){
        // Add all docs from the target
        action.params.targetItem.docList.forEach(function(d){
            docTool.add(d);
        });
        // Then add from the other selections
        if(action.params.multi){
            action.params.addItems.forEach(function(e){
                e.docList.forEach(function(d){
                    docTool.add(d);
                });
            });
        }
    }

    function edit(action){
        // Get the dialog box and empty the body of it
        var dialog = $('#dialog-box');
        dialog.find('.modal-body').empty();

        // Change the title
        dialog.find('.modal-title').html(action.name+'?');

        // Create the input field and append it
        var editText = document.createElement('input');
        editText.type = 'text';
        editText.value = action.params.targetItem.name;
        dialog.find('.modal-body').append(editText);

        // Show the dialog
        dialog.modal();

        // Create a call back
        var editEntity = function(event){
            var valid = true;
            // Change the entities name
            var newName = dialog.find('.modal-body input').val();
            // See if the new name is actually different then before
            if(newName != action.params.targetItem.name){
                // Check if it's a valid name to use
                valid = newName.length > 0;
                // TODO maybe check if the new name is a subset of the other name, otherwise the user should create a new entity?
                if(valid) {
                    for(var e = 0; e < data.entities.length; e++) {
                        if (data.entities[e].name === newName) {
                            valid = false;
                            if(confirm('Entity name already exists. Do you want to merge?')){
                                // Merge entities
                                mergeEntities(data.entities[e], [action.params.targetItem]);
                                // Cleanup
                                dialog.find('#dialog-box-enter').off();
                                $(document).off('keyup');
                                dialog.modal('hide');
                            }
                            return;
                        }
                    }
                }
                if(valid){
                    renameEntity(action.params.targetItem, newName);
                } else {
                    alert('Not a valid entity input. Don\'t be a smart-ass.');
                }
            }

            // clean up after the modal
            if(valid){
                dialog.find('#dialog-box-enter').off();
                $(document).off('keyup');
                dialog.modal('hide');
                console.log(newName);
            }
        };

        // Listen for a click or enter keypress
        dialog.find('#dialog-box-enter').on('click', function(event){
            editEntity(event);
        });
        $(document).on('keyup', function(event){
            if(event.which == 13){
                editEntity(event);
            }
        });
    }

    function mergeEntities(prime, others){

    }

    function renameEntity(e, newName){

    }

    function removeEntity(e, entVis, docVis, graphVis, timeVis){
        var i = data.entities.indexOf(e);
        if(i != -1) data.entities.splice(i, 1);

        e.docList.forEach(function(d){
            console.log(d.entList);
            i = d.entList.indexOf(e);
            console.log('on remove at '+i);
            if(i != -1)d.entList.splice(i, 1);
        });

        if(e.alias && e.alias.mainEnt == e){
            // Remove the alias too
            i = data.aliases.indexOf(e.alias);
            if(i != -1)data.aliases.splice(i, 1);

            e.alias.entList.forEach(function(ea){
                ea.docList.forEach(function(d){
                    i = d.entList.indexOf(ea);
                    if(i != -1)d.entList.splice(i, 1);
                });
            });
        }
        if(entVis) entVis.remove();
        if(docVis) {
            docVis.each(function(i, span){
                span = $(span)[0];
                var text = document.createTextNode(span.innerHTML);
                console.log(text);
                if(span.nextSibling) span.parentNode.insertBefore(text, span.nextSibling);
                else span.parentNode.append(text);
                span.remove();
            });
        }
        if(graphVis){
            // TODO Remove from graph vis
        }
        if(timeVis){
            // TODO remove from time vis?
        }
    }

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
        entTool.select(t, e, false, true);
    };

    entTool.select = function(target, event, force, clear){
        var clicked = $(target);
        clicked = clicked.add(clicked.closest('li'));
        clicked = clicked.add(clicked.closest('span.frequency'));
        clicked = clicked.add(clicked.closest('span.name'));
        var s = clicked.hasClass('ui-selected') && !force;
        if(!event.metaKey && !event.ctrlKey && clear) {
            var classname = $(target).tmplItem().data.type.classname;
            $('#entity-list-'+classname+' .ui-selected').removeClass('ui-selected');
        }
        if(s){
            clicked.removeClass('ui-selected');
        } else {
            clicked.addClass('ui-selected');
        }
        entTool.selectedCallback(target);
    };

    entTool.selectedCallback = function(target){
        var classname = $(target).tmplItem().data.type.classname;
        var selected = $('#entity-list-'+classname+' li.ui-selected');
        var selectedSpan = $('#entity-column-header-'+classname+' span.right');
        // If none are selected then remove the select indicator
        if(selected.length == 0){
            selectedSpan.css({visibility: 'hidden'});
        } else {
            selectedSpan.css({visibility: 'visible'}).html(selected.length);
        }
    };

    entTool.dblClick = function(t,e){
        entTool.select(t, e, true, true);
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
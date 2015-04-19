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

    entTool.find = function(targetItem){
        // TODO maybe make this handle arrays of entities? would I pass this something else?
        return $('.entity-list-item-'+targetItem.id);
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
            case 'entity-change-type':
                changeType(action);
                break;
            case 'entity-show-docs':
                showDocs(action);
                break;
            case 'entity-create-alias':
                alias(action);
                break;
            case 'entity-remove-selected':
                removeSelected(action);
                break;
            default:
            {
                console.log('Unknown action called!');
                console.log(action);
            }

        }
    };

    function removeSelected(action){
        if(confirm('Remove '+(action.params.addItems.length + 1)+' entities from analysis?')){
            removeEntity(action.params.targetItem, action.params.target, docTool.find(action.params.targetItem, false), null, null);
            for(var r = 0; r < action.params.add.length; r++){
                removeEntity(action.params.addItems[r], action.params.add[r], docTool.find(action.params.addItems[r], false), null, null);
            }
        }
    }

    function remove(action){
        // TODO check if there's another entity of the same type? and ask to merge or delete that one too
        if(confirm('Remove entity from analysis?')){
            removeEntity(action.params.targetItem, action.params.target, docTool.find(action.params.targetItem, false), null, null);
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

    function alias(action){
        // Get the dialog box and empty the body of it
        var dialog = $('#dialog-box');
        dialog.find('.modal-body').empty();

        // Change the title
        dialog.find('.modal-title').html(action.name+'?');

        // Create the list of entities to choose as the main entity for the alias
        var sel = document.createElement('select');
        var firstOption = document.createElement('option');
        firstOption.value = action.params.targetItem;
        firstOption.text = action.params.targetItem.name;
        firstOption.selected = true;
        sel.appendChild(firstOption);
        action.params.addItems.forEach(function(e){
            var option = document.createElement('option');
            option.value = e;
            option.text = e.name;
            sel.appendChild(option);
        });

        // Add the select DOM element to the modal body
        dialog.find('.modal-body').append(sel);

        // Show the dialog
        dialog.modal();

        // Create a callback
        var createAliasCallback = function(event){
            var mainEntity = (sel.selectedIndex == 0) ? action.params.targetItem : action.params.addItems[sel.selectedIndex-1];
            var mainEntVis = (sel.selectedIndex == 0) ? action.params.target : action.params.add[sel.selectedIndex-1];
            var sub = action.params.addItems.concat(action.params.targetItem);
            var i = sub.indexOf(mainEntity)
            sub.splice(i,1);
            console.log(sub);
            var subEntVis = action.params.add.add(action.params.target);
            subEntVis = subEntVis.not('.entity-list-item-'+mainEntity.id);
            // If the type changed then we'll change the entity's type
            createAlias(mainEntity, sub, mainEntVis, subEntVis);
            // Cleanup
            dialog.find('#dialog-box-enter').off();
            $(document).off('keyup');
            dialog.modal('hide');
        }

        // Listen for a click or enter keypress
        dialog.find('#dialog-box-enter').on('click', function(event){
            createAliasCallback(event);
        });
        $(document).on('keyup', function(event){
            if(event.which == 13){
                createAliasCallback(event);
            }
        });
    }

    function changeType(action){
        // Get the dialog box and empty the body of it
        var dialog = $('#dialog-box');
        dialog.find('.modal-body').empty();

        // Change the title
        dialog.find('.modal-title').html(action.name+'?');

        // Create the list of entity types to select
        var sel = document.createElement('select');
        for(var t in main.entityTypes){
            var option = document.createElement('option');
            option.value = main.entityTypes[t].classname;
            option.text = main.entityTypes[t].displayname;
            if(main.entityTypes[t] == action.params.targetItem.type) option.selected = true;
            sel.appendChild(option);
        }

        // Add the select DOM element to the modal body
        dialog.find('.modal-body').append(sel);

        // Show the dialog
        dialog.modal();

        // Create a callback
        var changeTypeCallback = function(event){
            var newType = main.entityTypes[sel.options[sel.selectedIndex].value];
            if(newType != action.params.targetItem.type){
                // If the type changed then we'll change the entity's type
                changeEntityType(action.params.targetItem, newType, action.params.target, docTool.find(action.params.targetItem, false));
            }
            // Cleanup
            dialog.find('#dialog-box-enter').off();
            $(document).off('keyup');
            dialog.modal('hide');
        }

        // Listen for a click or enter keypress
        dialog.find('#dialog-box-enter').on('click', function(event){
            changeTypeCallback(event);
        });
        $(document).on('keyup', function(event){
            if(event.which == 13){
                changeTypeCallback(event);
            }
        });
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
                                mergeEntities(data.entities[e], [action.params.targetItem], entTool.find(data.entities[e]),
                                    [action.params.target], docTool.find(data.entities[e], false), [docTool.find(action.params.target, false)]);
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
                    renameEntity(action.params.targetItem, newName, action.params.target, docTool.find(action.params, true));
                } else {
                    alert('Not a valid entity input. Don\'t be a smart-ass.');
                }
            }

            // clean up after the modal
            if(valid){
                dialog.find('#dialog-box-enter').off();
                $(document).off('keyup');
                dialog.modal('hide');
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

    function createAlias(mainE, subE, mainEntVis, subEntVis, mainGraphVis, subGraphVis, mainProVis, subProVis){
        console.log(subE);

        var concatDocList = mainE.docList;
        subE.forEach(function(e){
            // Add the sub entities to the main entity's list
            mainE.alias.entList.push(e);

            // Merge all of the documents together so we can point back to this alias from the documents
            concatDocList = concatDocList.mergeUnique(e.docList);

            // Remove the sub entity's alias from the document's aliasList and data's aliaslist
            e.docList.forEach(function(d){
                var i = d.aliasList.indexOf(e.alias);
                if(i != -1) d.aliasList.splice(i,1);
            });
            var i = data.aliases.indexOf(e.alias);
            if(i != -1) data.aliases.splice(i,1);
        });

        // Go through the doc list and if the main alias isn't in there then add it in
        concatDocList.forEach(function(d){
            var i = d.aliasList.indexOf(mainE.alias);
            if(i == -1) d.aliasList.push(mainE.alias);
        });

        if(mainEntVis && subEntVis){
            // For now just remove the li's of the sub's from the list and add them to a ul of the main?
            subEntVis.remove();
            console.log(subEntVis);
            $(mainEntVis).find('.alias-list').append(subEntVis);
        }
    }

    function changeEntityType(e, newType, entVis, docVis, graphVis, timeVis, proVis) {
        // The class also handles changing the linked Alias
        var oldType = e.type.classname;
        e.type = newType;

        // Now take the li and remove it from the current list then add it the new list
        if(entVis){
            entVis.remove();
            entVis = $(entVis);
            // Just add a new one - not sure if this will mess stuff up?
            var newTmpl = $('#entTemplate').tmpl(e);
            entVis.removeClass('entity-type-' + oldType);
            entVis.addClass('entity-type-' + e.type.classname);
            $('#entity-list-'+newType.classname).append(entVis);
            entTool.sort(null, entTool.currSort);
        }

        if(docVis){
            // Should be easier don't need to remove or anything
            $(docVis).removeClass('doc-entity-item-type-' + oldType);
            $(docVis).addClass('doc-entity-item-type-' + e.type.classname);
        }

    }

    function mergeEntities(prime, others, primeEntVis, othersEntVis, primeDocVis, othersDocVis, primeGraphVis,
                           othersGraphVis, primeTimeVis, othersTimeVis, primeProVis, othersProVis){
        // Take the others and merge into the doclist of the prime
        // Then remove the others while we're looping through
        for(var o = 0; o < others.length; o++){
            prime.docList = prime.docList.mergeUnique(others[o].docList);
            // Loop through the new doclist and add
            prime.docList.forEach(function(d){
                if(d.entList.indexOf(prime) == -1){
                    d.entList.push(prime);
                    if(prime.alias.mainEnt == prime) d.aliasList.push(prime.alias);
                }
            });
            // TODO update with othersGraphVis
            if(othersEntVis && othersDocVis) removeEntity(others[o], othersEntVis[o], othersDocVis[o]);

        }

        //Update the frequency of the prime
        prime.frequency = prime.docList.length;
        if(primeEntVis) $(primeEntVis).find('.frequency').html(prime.frequency);
    }

    function renameEntity(e, newName, entVis, docVis, graphVis, timeVis, pro){
        // Rename the entity itself
        // If it is the main entity for an alias then rename that alias, Entity class handles this
        e.name = newName;

        // Change the view that's in the entVis
        if(entVis) $(entVis).find('.name').html(newName);

        // Change the view that's in the docVis
        if(docVis) {
            docVis.forEach(function(doc){
                var d = $(doc);
                docTool.drawEntities(d.tmplItem().data, d);
            });
        }

        // TODO do a search to see if it's in other documents
    }

    function removeEntity(e, entVis, docVis, graphVis, timeVis){
        var i = data.entities.indexOf(e);
        if(i != -1) data.entities.splice(i, 1);

        e.docList.forEach(function(d){
            i = d.entList.indexOf(e);
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
        // TODO update the entity selected indicator on removing one
        if(docVis && docVis.length > 0) {
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

    entTool.sort = function(param, sortFun){
        if(!sortFun) {
            switch (param) {
                case 'alpha-first':
                    sortFun = function (a, b) {
                        var nameA = $(a).tmplItem().data.name;
                        var nameB = $(b).tmplItem().data.name;

                        if (nameA < nameB) return -1;
                        if (nameA > nameB) return 1;
                        return 0;
                    };
                    break;
                case 'alpha-last':
                    sortFun = function (a, b) {
                        var nameA = $(a).tmplItem().data.name.split(/\s+/);
                        var nameB = $(b).tmplItem().data.name.split(/\s+/);

                        var stringA = '';
                        var stringB = '';

                        for (var ia = nameA.length - 1; ia > -1; ia--) {
                            stringA += nameA[ia];
                        }

                        for (var ib = nameB.length - 1; ib > -1; ib--) {
                            stringB += nameB[ib];
                        }

                        if (stringA > stringB) return 1;
                        if (stringA < stringB) return -1;
                        return 0;
                    };
                    break;
                case 'freq':
                    sortFun = function (a, b) {
                        var freqA = $(a).tmplItem().data.frequency;
                        var freqB = $(b).tmplItem().data.frequency;

                        if (freqA < freqB) return 1;
                        if (freqA > freqB) return -1;
                        return 0;
                    };
                    break;
            }
        }
        Object.keys(main.entityTypes).forEach(function(e){
            entTool.currSort = sortFun;
            var entities = $('#entity-list-'+ e + ' > .entity-list-item');
            entities.sort(sortFun);
            entities.detach().appendTo('#entity-list-'+ e);
        });
    }

})();
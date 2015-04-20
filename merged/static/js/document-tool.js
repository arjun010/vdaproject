(function () {

    docTool = {};

    docTool.init = function (params) {

    };

    docTool.draw = function (params) {
        // Create all of the templates
        var tmpls = $('#docTemplate').tmpl(data.documents);
    };

    docTool.add = function(doc, docId){
        // If the document object wasn't passed in then find it based on id
        doc = doc || data.documents.filter(function(d){return docId == d.id;})[0];
        // Create the template for that data item and add it to the document container
        if($('#document-container .doc-item-'+doc.id).length == 0){
            var tmpl = $('#docTemplate').tmpl(doc).appendTo('#document-container');

            var contents = tmpl.find('.doc-item-text > p').contents();
            var text = contents[contents.length-1];

            docTool.drawEntities(doc,tmpl);
        }
    };

    docTool.removeDoc = function(doc, docId){
        var docVis = docTool.find(doc, false);
        removeDocument(doc, docVis, null, null, null);
    };

    docTool.drawEntities = function(doc, docTmpl){
        // Sort all of the entities from longest to shortest
        doc.entList = doc.entList.sort(function(a,b){
            if(a.name.length > b.name.length) {
                return -1;
            } else if (a.name.length < b.name.length){
                return 1;
            }
            return 0;
        });

        docTmpl.find('.doc-item-text > p').html(doc.text);

        doc.entList.forEach(function(e){
            var numContent = docTmpl.find('.doc-item-text > p').contents().length;

            // Get all of the text elements - this means elements that aren't spans
            var text = docTmpl.find('.doc-item-text > p').contents().filter(function(i,c){
                return c.nodeType == 3;
            });

            var words = e.name;
            if (words.constructor === String) {
                words = [words];
            }
            words = jQuery.grep(words, function(word, i){
                return word != '';
            });
            words = jQuery.map(words, function(word, i) {
                return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            });

            var pattern = "(" + words.join("|") + ")";
            pattern = pattern.replace(/\s/g, '\s{0,}');
            var re = new RegExp(pattern);
            // loop through all of the text elements and find all of the matches
            var splitText = [];
            text.each(function(i,t){
                var n = t;
                var match = re.exec(t.data);
                while (match != null && n != null) {
                    var span = $('#docEntityTemplate').tmpl(e);
                    var wordNode = n.splitText(match.index);
                    n = wordNode.splitText(e.name.length);
                    var wordClone = wordNode.cloneNode(true);
                    wordNode.parentNode.replaceChild(span[0], wordNode);
                    if(n != null) match = re.exec(n.data);
                }
            });
        });
    };

    docTool.openDoc = function(doc){
        var docElement = docTool.find(doc, false);
        if($(docElement).find('.doc-item-text').css('display') === 'none'){
            docTool.collapse($(docElement).find('.doc-item-header'));
        }
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
            doc.height(newHeight);
        } else {
            var newHeight = doc.height() - text.height();
            doc.height(newHeight);
        }
        text.slideToggle();
        //doc.parent().update();
    };

    docTool.find = function(targetItem, docs){
        var ret = [];
        // Provide a different type as the targetItem but we want to return all the docs
        if(docs){
            if (targetItem instanceof Entity) {
                targetItem.docList.forEach(function(d){
                    var docInView = $('.doc-item-'+ d.id);
                    if(docInView.length == 1) ret.push(docInView[0]);
                });
            } else if (targetItem instanceof Doc) {
                ret = $('.doc-item-'+targetItem.id);
            }
        } else {
            // Return the type that is represented in the view
            if(targetItem instanceof Entity){
                ret = $('.doc-entity-item-'+targetItem.id);
            } else if (targetItem instanceof Doc) {
                ret = $('.doc-item-'+targetItem.id);
            }
        }
        return ret;
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
        data.documents.forEach(function(d){
            docTool.add(d);
        });
    };

    docTool.removeAll = function(){
        $(".doc-item").remove();
    };

    docTool.action = function(action){
        console.log(action);
        // If this is an entity action then just pass it to the entTool
        if(action.classname.indexOf('entity')===0){
            entTool.action(action);
        }
        switch (action.classname){
            case 'doc-delete':
                del(action);
                break;
            case 'doc-remove':
                remove(action);
                break;
            case 'doc-add-to-graph':
                addToGraph(action);
                break;
            default:
            {
                console.log('Unknown action called!');
                console.log(action);
            }
                break;
        }
    };

    docTool.selected = function(params){
        // For now we'll return an empty array since we don't have multiselect in the doc view
        // TODO change when we add in selection for document view
        return [];
    };

    docTool.select = function(target, event, force, clear){
        // TODO change when we add in selection for document view
    };

    docTool.scrollDocList = function(){
        $(".doc-item").each(function(i,e){
            var d = $(e);
            var text = d.find(".doc-item-text"),
                header = d.find(".doc-item-header");

            var t = d.offset().top - d.parent().offset().top,
                h = d.height(),
                w = d.width(),
                th = d.offset().top;

            if(t < 0 && h > 29 && (t + h) > 29) {
                header.css({position: 'fixed', left: (d.offset().left + 1) +'px',top: (d.parent().offset().top)+'px', width: w+'px'});
            } else if(th != 0){
                // TODO fix this so I'm not setting it every time just when it goes back to normal
                header.css({position: 'absolute', top: '0px', left: '0px'});
            }
        });
    };

    function addToGraph(action){
        //addNode(action.params.targetItem.name, action.params.targetItem);        
        //drawGraphViz(action.params.targetItem.name, action.params.targetItem);
        addNewNodeToGraphFromAnotherView(action.params.targetItem.title, action.params.targetItem)
    }

    function del(action){
        if(confirm('Delete document from analysis?')){
            delDocument(action.params.targetItem, docTool.find(action.params.targetItem, false), null, null);
        }
    }

    function remove(action){
        removeDocument(action.params.targetItem, docTool.find(action.params.targetItem, false), null, null);
    }

    function delDocument(d, docVis, graphVis, timeVis, proVis){
        // Delete from the data structure
        var i = data.documents.indexOf(d);
        if(i != -1) data.documents.splice(i, 1);

        console.log(d);
        // Remove references in each entity and alias list
        d.entList.forEach(function(e){
            i = e.docList.indexOf(d);
            if(i != -1) {
                e.docList.splice(i, 1);
                e.frequency = e.docList.length;
                if(e.frequency > 0){
                    entTool.update(e, 'frequency');
                } else {
                    entTool.deleteEntity(e);
                }
            }
        });

        d.aliasList.forEach(function(a){
            i = a.entList.forEach(function(e){
                i = e.docList.indexOf(d);
                if(i != -1) {
                    e.docList.splice(i, 1);
                    e.frequency = e.docList.length;
                    if(e.frequency > 0){
                        entTool.update(e, 'frequency');
                    } else {
                        entTool.deleteEntity(e);
                    }
                }
            });
        });


        //Reuse the remove function to get rid of element from view
        removeDocument(d, docVis, graphVis, timeVis, proVis);
    }

    function removeDocument(d, docVis, graphVis, timeVis, proVis) {
        // If the document is currently in view then delete it
        if(docVis) {
            $(docVis).remove();
        }
        if(graphVis){
            // TODO Remove from graph vis
        }
        if(timeVis){
            // TODO remove from time vis?
        }
        if(proVis){
            // TODO remove from time vis?
        }
    }

    jQuery.extend({
        highlight: function (node, re, nodeName, className) {
            if (node.nodeType === 3) {
                var match = node.data.match(re);

                if (match) {
                    console.log('highlighting');
                    var highlight = document.createElement(nodeName || 'span');
                    highlight.className = className || 'highlight';
                    var wordNode = node.splitText(match.index);
                    wordNode.splitText(match[0].length);
                    var wordClone = wordNode.cloneNode(true);
                    highlight.appendChild(wordClone);
                    wordNode.parentNode.replaceChild(highlight, wordNode);
                    return 1; //skip added node in parent
                }
            } else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
                !/(script|style)/i.test(node.tagName) && // ignore script and style nodes
                !(node.tagName === nodeName.toUpperCase() && node.className === className)) { // skip if already highlighted
                for (var i = 0; i < node.childNodes.length; i++) {
                    i += jQuery.highlight(node.childNodes[i], re, nodeName, className);
                }
            }
            return 0;
        }
    });

    jQuery.fn.unhighlight = function (options) {
        var settings = { className: 'highlight', element: 'span' };
        jQuery.extend(settings, options);

        return this.find(settings.element + "." + settings.className).each(function () {
            var parent = this.parentNode;
            parent.replaceChild(this.firstChild, this);
            parent.normalize();
        }).end();
    };

    jQuery.fn.highlight = function (words, options) {
        var settings = { className: 'highlight', element: 'span', caseSensitive: false, wordsOnly: false };
        jQuery.extend(settings, options);

        if (words.constructor === String) {
            words = [words];
        }
        words = jQuery.grep(words, function(word, i){
            return word != '';
        });
        words = jQuery.map(words, function(word, i) {
            return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        });
        if (words.length == 0) { return this; };

        var flag = settings.caseSensitive ? "" : "i";
        var pattern = "(" + words.join("|") + ")";
        pattern = pattern.replace(/\s+$/, '\\s')
        if (settings.wordsOnly) {
            pattern = "\\b" + pattern + "\\b";
        }
        pattern = pattern.replace(/\s/g, '\s');
        var re = new RegExp(pattern, flag);

        return this.each(function () {
            jQuery.highlight(this, re, settings.element, settings.className);
        });
    };

    String.prototype.reInsert = function(s,i){
        return this.slice(0,i) + s + this.slice(i + s.length);
    }

    docTool.doSearch = function(){
        $.getJSON('/_do_search', {
            term: $('input[name="term"]').val(),
            search_count: $("#search_size option:selected").val(),
            }, function(ret) {
                var ids = ret.ids
                for(var i = 0; i < ids.length; i++){
                    var doc = data.documents.filter(function (d) {
                        return d.id == parseInt(ids[i]);
                    });
                    docTool.add(doc[0]);
                }
            }
        );
    };

})();

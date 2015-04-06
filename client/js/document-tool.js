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
        doc = doc || data.documents.filter(function(d){return docId == d.id;});
        // Create the template for that data item and add it to the document container
        if($('#document-container .doc-item-'+doc.id).length == 0){
            var tmpl = $('#docTemplate').tmpl(doc).appendTo('#document-container');

            var contents = tmpl.find('.doc-item-text > p').contents();
            var text = contents[contents.length-1];

            // Sort all of the entities from longest to shortest
            doc.entList = doc.entList.sort(function(a,b){
                if(a.name.length > b.name.length) {
                    return -1;
                } else if (a.name.length < b.name.length){
                    return 1;
                }
                return 0;
            });

            doc.entList.forEach(function(e){
                var numContent = tmpl.find('.doc-item-text > p').contents().length;

                // Get all of the text elements - this means elements that aren't spans
                var text = tmpl.find('.doc-item-text > p').contents().filter(function(i,c){
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
                        var highlight = document.createElement('span');
                        highlight.className = 'doc-entity doc-entity-type-' + e.type.classname;
                        var wordNode = n.splitText(match.index);
                        n = wordNode.splitText(e.name.length);
                        var wordClone = wordNode.cloneNode(true);
                        highlight.appendChild(wordClone);
                        wordNode.parentNode.replaceChild(highlight, wordNode);
                        if(n != null) match = re.exec(n.data);
                    }
                });
            });
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
            var text = d.find(".doc-item-text"),
                header = d.find(".doc-item-header");

            var t = d.offset().top - d.parent().offset().top,
                h = d.height(),
                w = d.width(),
                th = d.offset().top;

            if(t < 0 && h > 29 && (t + h) > 29) {
                header.css({position: 'fixed', left: d.offset().left+'px',top: d.parent().offset().top+'px', width: w+'px'});
            } else if(th != 0){
                // TODO fix this so I'm not setting it every time just when it goes back to normal
                header.css({position: 'absolute', top: '0px', left: '0px'});
            }
        });
    };

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

})();

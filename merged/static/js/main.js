(function () {

    // The object that will be handling all of our tool
    main = {};
    data = {};


    /**
     *
     * @param params - functions as the context of the tool
     */
    main.init = function (params) {
        // Initialize things for the overall view
        initEntityTypes();

        // Initalize all of the other "tools" for the system
        // Each tool will handle displaying the view for each component
        entTool.init(params);
        graphTool.init(params);
        timeTool.init(params);
        docTool.init(params);
        provTool.init(params);

        console.log(timeTool);

        // load data for the entire tool
        main.loadData(params);
    };

    main.action = function(item, index){
        // This is a terrible way to get the action item,
        // but I can't think of a better one
        var action = $(item).tmplItem().data.actions[index];
        // Get the reference to the tool we should use then call the action from there
        action.params.tool.action(action);
    };

    // Set up the context menu listener
    main.contextmenu = function(event, target, tool, targetItem){
        if(!event) return;
        // Check to make sure that this was actually a right-click
        var right;
        if ("which" in event) right = event.which == 3;
        else if ("button" in event) right = event.button == 2;
        if(!right) return;

        console.log(target);
        var params = {};
        params['target'] = target;
        params['targetId'] = $(target).attr('id');
        params['targetClass'] = $(target).attr('class');
        params['parentId'] = $(target).parent().attr('id');
        params['parentClass'] = $(target).parent().attr('class');
        params['tool'] = tool;
        params['targetItem'] = $(target).tmplItem().data;

        var additional = tool.selected(params);
        params.add = [];
        params.addItems = [];
        params.multi = false;
        if(additional && additional.length != 0){
            additional.each(function(i,a){
               params.addItems.push($(a).tmplItem().data);
            });
            params.add = additional;
            params.multi = true;
        }

        // Create the context menu
        var menu = $("#context-menu");
        menu.empty();
        var actions = main.createActions(params);

        $("#contextMenuTmpl").tmpl({actions: actions}).appendTo("#context-menu");

        // Move the context menu to the location
        // TODO make sure we don't put it outside of the page
        var pos = findEventPosition(event);
        menu.css({left: pos.x+'px', top: pos.y+'px'});
        menu.show().animate();

        // Make sure the browser context menu doesn't show up
        window.event.returnValue = false;
        window.addEventListener('click', main.dismissContextMenu);

        tool.select(target, event, true, false);
    };

    main.dismissContextMenu = function(e){
        $("#context-menu").hide().animate();
        window.removeEventListener('click', main.dismissContextMenu);
    };

    main.createActions = function(params){
        var actions = [];
        if(params.targetItem instanceof  Entity){
            if($(params.target).hasClass('entity-list-item')){
                var selRemoveString = (params.multi)? 'Delete '+(params.addItems.length+1)+' Selected' : 'Delete Selected';
                var selGraphString = (params.multi)? 'Add '+(params.addItems.length+1)+' Selected to Graph' : 'Add Selected to Graph';
                actions.push(new Action('entity-edit', 'Edit Entity', true, params));
                actions.push(new Action('entity-show-docs', 'Show Documents', true, params));
                actions.push(new Action('entity-delete', 'Delete Entity', true, params));
                actions.push(new Action('entity-add-to-graph', 'Add to Graph', true, params));
                actions.push(new Action('entity-change-type', 'Change Type', true, params));
                actions.push(new Action('entity-create-alias', 'Create Alias', (params.multi), params));
                actions.push(new Action('entity-delete-selected', selRemoveString, (params.multi), params));
                //actions.push(new Action('entity-add-to-graph', selGraphString, (params.multi), params));
            } else if ($(params.target).hasClass('doc-entity-item')) {
                actions.push(new Action('entity-edit', 'Edit Entity', true, params));
                actions.push(new Action('entity-show-docs', 'Show Documents', true, params));
                actions.push(new Action('entity-delete', 'Delete Entity', true, params));
                actions.push(new Action('entity-change-type', 'Change Type', true, params));
                actions.push(new Action('entity-add-to-graph', 'Add to Graph', true, params));
                // TODO uncomment if we add multi select for document view
                //actions.push(new Action('entity-create-alias', 'Create Alias', (params.multi), params));
                //actions.push(new Action('entity-delete-selected', selRemoveString, (params.multi), params));
            } else {
                actions.push(new Action('entity-edit', 'Edit Entity', true, params));
                actions.push(new Action('entity-show-docs', 'Show Documents', true, params));
                actions.push(new Action('entity-delete', 'Delete Entity', true, params));
                actions.push(new Action('entity-change-type', 'Change Type', true, params));
                actions.push(new Action('entity-add-to-graph', 'Add to Graph', true, params));
            }
        } else if (params.targetItem instanceof  Doc) {
            if($(params.target).hasClass('doc-item-header')){
                actions.push(new Action('doc-remove', 'Remove Document', true, params));
                actions.push(new Action('doc-delete', 'Delete Document', true, params));
                actions.push(new Action('doc-add-to-graph', 'Add to Graph', true, params));
            }

        } else if ($(params.target).tmplItem().data instanceof  Alias) {

        }
        return actions;
    };

    /**
     *
     * @param params - functions as the context of the tool
     */
    main.loadData = function (params) {

        // Nest the call backs of loading all of the json data so all data sets are available

        d3.json('static/data/entity_list.json', function (e) {
            loadEntities(e);
            d3.json('static/data/document_list.json', function (d) {
                loadDocuments(d);
                d3.json('static/data/metadata.json', function (m) {
                    loadMetadata(m);
                    // Do I need to do any processing here? or should I just draw?
                    entTool.draw(params);
                    graphTool.draw(params);
                    //timeTool.draw(params);
                    docTool.draw(params);
                });
            });
        });
    };

    /**
     * Show the Entity View panel to the user
     */
    main.showEntityView = function () {
        // Remove the active class
        $('#nav-analysis').removeClass('active');
        $('#nav-provenance').removeClass('active');
        $('#panel-analysis').removeClass('active');
        $('#panel-provenance').removeClass('active');

        // Add the active class to the entity view & nav
        $('#nav-entity').addClass('active');
        $('#panel-entity-analysis-document').addClass('active');
        $('#panel-entity').addClass('active');
    };


    /**
     * Show the Entity View panel to the user
     */
    main.showAnalysisView = function () {
        // Remove the active class
        $('#nav-entity').removeClass('active');
        $('#nav-provenance').removeClass('active');
        $('#panel-entity').removeClass('active');
        $('#panel-provenance').removeClass('active');

        // Add the active class to the entity view & nav
        $('#nav-analysis').addClass('active');
        $('#panel-entity-analysis-document').addClass('active');
        $('#panel-analysis').addClass('active');
        graphTool.draw(params);
        timeTool.draw(params)
    };

    main.showProvenanceView = function () {
        // Remove the active class
        $('#nav-analysis').removeClass('active');
        $('#nav-entity').removeClass('active');
        $('#panel-entity-analysis-document').removeClass('active');

        // Add the active class to the entity view & nav
        $('#nav-provenance').addClass('active');
        $('#panel-provenance').addClass('active');
        provTool.draw();
    };

    main.resizeWindow = function(event){
        var h = $(window).height() - 78;

        $('.panel').css('min-height', h + 'px');
    };

    /**
     * Initialize the entity types for the default values, may allow to add to this object later
     */
    function initEntityTypes() {
        // Create a map of entity types that will not change
        main.entityTypes = {
            person: new EntityType('person', 'Person', '#be3f4f'),
            location: new EntityType('location', 'Location', '#3ab6ba'),
            organization: new EntityType('organization', 'Organization', '#56a0d3'),
            date: new EntityType('date', 'Date', '#ffdd17'),
            money: new EntityType('money', 'Money', '#006d2c'),
            percent: new EntityType('percent', 'Percent', '#753a7d'),
            time: new EntityType('time', 'Time', '#e6550d')
        };
    }

    /**
     * Helper function to convert the json Entities into classes that can be used.
     * @param json - raw json file to be converted
     */
    function loadEntities(json) {
        data.entities = [];
        data.aliases = [];
        json.forEach(function (e) {
            var ent = new Entity(main.entityTypes[e['entity_type']], e['entity_name'], e['entity_id'],
                [], e['entity_frequency']);

            // XXX need to be very careful we don't get into an infinite loop with entities
            //     referencing aliases and aliases referencing entities... could get messy

            // Make sure we're putting this at the id
            data.entities[ent.id] = (ent);
            var alias = new Alias(ent.id, ent, [ent]);
            ent.alias = alias;

            // Make sure we're putting this at the id
            data.aliases[alias.id] = alias;
        });
        data.entUniqueId = data.entities.length;
        data.aliasUniqueId = data.aliases.length;
    }

    /**
     * Helper function to convert the json Document nodes into classes that can be used.
     * @param json - raw json file to be converted
     */
    function loadDocuments(json) {
        data.documents = [];
        json.forEach(function (d) {
            var aliasList = [];
            var entList = [];
            d['list_of_entities_in_doc'].forEach(function (e) {
                // array location is the same as the id
                aliasList.push(data.aliases[e['entity_id']]);
                entList.push(data.entities[e['entity_id']]);
            });

            // Convert the rando title to a number for the doc id
            var id = parseInt(d['doc_title'].replace('.txt', ''));

            // Create the doc and add it to our list
            data.documents.push(new Doc(id, aliasList, entList, d['text']));

            // Link all of the entities back to this doc
            data.documents.peekBack().entList.forEach(function (e) {
                e.docList.push(data.documents.peekBack());
            });
        });
        data.docUniqueId = data.documents.length;
    }

    /**
     * Helper function to ingest the Documents' metadata into the pre-existing Document objects.
     * @param json - raw json file to be converted
     */
    function loadMetadata(json) {
        json.forEach(function (m) {
            // Find the document based on the rando id title
            var doc = data.documents.filter(function (d) {
                return d.id == parseInt(m['filename'].replace('.txt', ''));
            });

            if (doc[0]) {
                var md = m['metadata'];
                doc[0].loadMetaData(md['author'], md['date'], md['title']);
            }
            // something went wrong if we don't have it
        });
    }

    function findEventPosition(e){
        var pos = {x: 0, y: 0};
        if (!e) var e = window.event;
        if (e.pageX || e.pageY) 	{
            pos.x = e.pageX;
            pos.y = e.pageY;
        } else if (e.clientX || e.clientY) 	{
            pos.x = e.clientX + document.body.scrollLeft
            + document.documentElement.scrollLeft;
            pos.y = e.clientY + document.body.scrollTop
            + document.documentElement.scrollTop;
        }
        return pos;
    }
})();
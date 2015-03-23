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

        // load data for the entire tool
        main.loadData(params);
    };

    /**
     *
     * @param params - functions as the context of the tool
     */
    main.loadData = function (params) {
        // Nest the call backs of loading all of the json data so all data sets are available

        d3.json('../data/entity_list.json', function (e) {
            loadEntities(e);
            d3.json('../data/document_list.json', function (d) {
                loadDocuments(d);
                d3.json('../data/metadata.json', function (m) {
                    loadMetadata(m);
                    // Do I need to do any processing here? or should I just draw?
                    entTool.draw(params);
                    graphTool.draw(params);
                    timeTool.draw(params);
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
        $('#panel-analysis').removeClass('active');

        // Add the active class to the entity view & nav
        $('#nav-entity').addClass('active');
        $('#panel-entity').addClass('active');
    };


    /**
     * Show the Entity View panel to the user
     */
    main.showAnalysisView = function () {
        // Remove the active class
        $('#nav-entity').removeClass('active');
        $('#panel-entity').removeClass('active');

        // Add the active class to the entity view & nav
        $('#nav-analysis').addClass('active');
        $('#panel-analysis').addClass('active');
    };

    /**
     * Initialize the entity types for the default values, may allow to add to this object later
     */
    function initEntityTypes() {
        // Create a map of entity types that will not change
        main.entityTypes = {
            person: new EntityType('person', 'Person', '#be3f4f'),
            location: new EntityType('location', 'Location', '#5f9f6c'),
            organization: new EntityType('organization', 'Organization', '#4660ac'),
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
        json.forEach(function (e) {
            data.entities.push(
                new Entity(main.entityTypes[e['entity_type']], e['entity_name'], e['entity_id'],
                    [], e['entity_frequency'])
            );
        });
    }

    /**
     * Helper function to convert the json Document nodes into classes that can be used.
     * @param json - raw json file to be converted
     */
    function loadDocuments(json) {
        data.documents = [];
        json.forEach(function (d) {
            var entList = [];
            d['list_of_entities_in_doc'].forEach(function (e) {
                // array location is the same as the id
                entList.push(data.entities[e['entity_id']]);
            });

            // Convert the rando title to a number for the doc id
            var id = parseInt(d['doc_title'].replace('.txt', ''));

            // Create the doc and add it to our list
            data.documents.push(new Doc(id, entList, ''));

            // Link all of the entities back to this doc
            data.documents.peekBack().entList.forEach(function (e) {
                e.docList.push(data.documents.peekBack());
            });
        });
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
})();
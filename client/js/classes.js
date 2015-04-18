EntityType = function (classname, displayname, color) {
    this.classname = classname;
    this.displayname = displayname;
    this.color = color;
};

/**
 * Entity class
 */
Entity = function(type, name, id, docList, frequency) {
    this.type = type;
    this.name = name;
    this.id = id;
    this.docList = docList;
    this.frequency = frequency;
    this.alias = null;
};

/**
 *
 * @param type
 */
Entity.prototype.__defineSetter__('type', function(value) {
    this._type = value;
    if(value){
        this.color = value.color;
    }
    // Do some other stuff if we change types?
});

Entity.prototype.__defineSetter__('name', function(value) {
    this._name = value;
    if(this.alias && this.alias.mainEnt == this) {
        this.alias.name = value;
    }
});

Entity.prototype.__defineGetter__('name', function() {
    return this._name;
});

Entity.prototype.__defineGetter__('type', function() {
    return this._type;
});

Doc = function (id, aliasList, entList, text) {
    this.id = id;
    this.aliasList = aliasList;
    this.entList = entList;
    this.text = text;
    this.title = id;
    this.views = 0;
};

Doc.prototype.loadMetaData = function (author, date, title) {
    this.author = author;
    this.date = new Date(date);
    this.title = title;
};

Alias = function(id, mainEnt, entList){
    this.id = id;
    this.mainEnt = mainEnt;
    this.entList = entList;
    this._name = null;
};

Alias.prototype.__defineGetter__('name', function() {
    return (this._name) ? this._name : this.mainEnt.name;
});

Alias.prototype.__defineSetter__('name', function(val) {
    this._name = val;
});

Alias.prototype.__defineGetter__('type', function() {
    return this.mainEnt.type;
});

Alias.prototype.__defineSetter__('name', function(val) {
    this.mainEnt.type = val;
    if(this.entList){
        this.entList.forEach(function(e){
            e.type = val;
        });
    }
});

Action = function(classname, name, enabled, params){
    this.classname = classname;
    this.name = name;
    this.params = params;
    this.enabled = enabled;
};

Array.prototype.peekBack = function () {
    if (this.length > 0) {
        return this[this.length - 1];
    }
};


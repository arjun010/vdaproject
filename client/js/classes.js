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
    this.aliases = [];
    //this.color = type.color;
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

Entity.prototype.__defineGetter__('type', function() {
    return this._type;
});

Doc = function (id, entList, text) {
    this.id = id;
    this.entList = entList;
    this.text = text;
};

Doc.prototype.loadMetaData = function (author, date, title) {
    this.author = author;
    this.date = new Date(date);
    this.title = title;
};

Array.prototype.peekBack = function () {
    if (this.length > 0) {
        return this[this.length - 1];
    }
};


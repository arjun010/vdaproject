/**
 * Entity class
 */
Entity = function (type, name, id, docList, frequency) {
    this.type = type;
    this.name = name;
    this.id = id;
    this.docList = docList;
    this.frequency = frequency;
    this.aliases = [];
};

/**
 *
 * @param type
 */
Entity.prototype.changeType = function (type) {
    this.type = type;
    // Do some other stuff if we change types?
};

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

EntityType = function (classname, displayname, color) {
    this.classname = classname;
    this.displayname = displayname;
    this.color = color;
};

Array.prototype.peekBack = function () {
    if (this.length > 0) {
        return this[this.length - 1];
    }
};


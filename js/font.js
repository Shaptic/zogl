zogl = zogl || {};

zogl.zFont = function() {
    this.size = 0;
    this.filename = "";
    this.node = null;
    this.color = 'black';
};

zogl.zFont.prototype.loadFromFile = function(css, size) {
    this.filename = css;
    this.size = size;

    this.node = document.createElement("canvas");
    this.node.id = "font-" + css;
    this.node.style.display = "none";
    this.node.context = this.node.getContext('2d');
    this.node.context.font = size + "px " + this.filename;

    document.body.appendChild(this.node);
};

zogl.zFont.prototype.draw = function(text) {
    this.node.width  = this.node.context.measureText(text).width;
    this.node.height = this.size * 2;
    this.node.context.font = this.size + "px " + this.filename;
    this.node.context.fillStyle = this.color;
    this.node.context.fillText(text, 0, this.size);

    var tx = new zogl.zTexture();
    tx.loadFromRaw(this.node, true);
    return tx;
};

zogl.zFont.prototype.drawOnSprite = function(text, sprite, x, y) {
    var tx = this.draw(text);
    var objs = sprite.prims;
    sprite.loadFromTexture(tx);
    sprite.prims[0].move(x || 0, y || 0);
    for (var i in objs) {
        sprite.addObject(objs[i], objs[i].getX(), objs[i].getY());
    }
}

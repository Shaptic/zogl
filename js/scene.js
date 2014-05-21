zogl = zogl || {};

zogl.zScene = function(w, h, options) {
    options = options || {};

    this.size = {
        'w': w || glGlobals.activeWindow.size.w || 300,
        'h': h || glGlobals.activeWindow.size.h || 300
    };

    this.geometryVAO = new zogl.zBufferSet(gl.DYNAMIC_DRAW);
    //this.fbo1 = new zogl.zRenderTarget();
    //this.fbo2 = new zogl.zRenderTarget();

    this.lights  = [];
    this.postfx  = [];
    this.objects = [];

    this.flags = {
        'lighting':         options.lighting        || false,
        'postProcessing':   options.postprocessing  || false,
        'blendThrough':     options.blendThrough    || false
    };
};

zogl.zScene.prototype.draw = function(color) {
    var color = color || new zogl.color4('#FFFFFF');

    if (this.flags.blendThrough) {
        color.a = 0.0;
    }

    gl.clearColor(color.r, color.g, color.b, color.a);
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (var i in this.objects) {
        this.objects[i].offload(this.geometryVAO, { 'preserve': false });
    }

    this.geometryVAO.offload();
    this.geometryVAO.bind();
    for (var i in this.objects) {
        this.objects[i].draw(true);
    }

    this.geometryVAO.unbind();
};

zogl.zScene.prototype.addObject = function() {
    var z = new zogl.zSprite();
    this.objects.push(z);
    return z;
};

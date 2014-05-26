zogl.zRenderTarget = function(w, h) {
    this.fbo = gl.createFramebuffer();
    this.rbo = null;
    this.texture = null;

    this.size = {
        'w': w || glGlobals.activeWindow.size.w,
        'h': h || glGlobals.activeWindow.size.h
    };

    this.proj = mat4.create();
    mat4.ortho(0, w, h, 0, 1.0, 10.0, this.proj);
};

zogl.zRenderTarget.prototype.init = function() {
    this.bind();

    this.rbo = gl.createRenderbuffer();

    this.texture = new zogl.zTexture();
    this.texture.loadFromRaw(null, false, this.size.w, this.size.h);
    this.texture.bind();

    gl.bindRenderbuffer(gl.RENDERBUFFER, this.rbo);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 
                           this.size.w, this.size.h);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
                            gl.TEXTURE_2D, this.texture.id, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
                               gl.RENDERBUFFER, this.rbo);

    this.texture.unbind();
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    this.unbind();
};

zogl.zRenderTarget.prototype.bind = function() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.viewport(0, 0, this.size.w, this.size.h);
    glGlobals.proj = this.proj;
};

zogl.zRenderTarget.prototype.unbind = function() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, glGlobals.activeWindow.size.w,
                      glGlobals.activeWindow.size.h);
    glGlobals.proj = glGlobals.activeWindow.proj;
};

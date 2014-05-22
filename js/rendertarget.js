zogl.zRenderTarget = function(w, h) {
    this.fbo = gl.createFramebuffer();
    this.rbo = null;
    this.texture = null;

    this.size = {
        'w': w,
        'h': h
    };
};

zogl.zRenderTarget.prototype.init = function() {
    this.rbo = gl.createRenderBuffer();

    this.texture = zogl.zTexture();
    this.texture.loadFromRaw(null, false, this.size.w, this.size.h);

    gl.bindRenderbuffer(gl.RENDERBUFFER, this.rbo);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.fbo);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
                            gl.TEXTURE_2D, this.texture.id, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
                               gl.RENDERBUFFER, this.rbo);

    this.texture.unbind();
    this.bindRenderbuffer(gl.RENDERBUFFER, null);
    this.bindFramebuffer(gl.FRAMEBUFFER, null);
};

zogl.zRenderTarget.prototype.bind = function() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
};

zogl.zRenderTarget.prototype.unbind = function() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};

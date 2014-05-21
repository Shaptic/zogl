function init() {
    var w = new zogl.zWindow(400, 400);
    w.init();

    texture = new zogl.zTexture();
    texture.loadFromFile("tank.png");

    gl.activeTexture(gl.TEXTURE0);
    glGlobals.defaultShader.setTexture("texture", 0);
    glGlobals.defaultShader.bind();
    texture.bind();

    vbo = new zogl.zBufferSet(gl.STATIC_DRAW);
    vbo.addPositions(new Float32Array([
        0,   0,
        100, 0,
        100, 100,
        0,   100
    ]));

    vbo.addIndices(new Uint16Array([
        0, 1, 3, 3, 1, 2
    ]));

    vbo.addColors(new Float32Array([
        1, 0, 0, 1,
        1, 1, 0, 1,
        1, 1, 1, 1,
        0, 1, 1, 1,
    ]));

    vbo.addTexCoords(new Float32Array([
        0, 0, 0, 0, 0, 0, 0, 0
    ]));

    var poly = new zogl.zPolygon();
    poly.addVertex(0, 0);
    poly.addVertex(100, 0);
    poly.addVertex(100, 100);
    poly.addVertex(50, 150);
    poly.addVertex(0, 100);
    poly.setColor('#0000FF');
    poly.create();
    poly.move(150, 100);

    var f = new zogl.zFont();
    f.loadFromFile('monospace', 48);
    var tx = f.draw("help");

    var q = new zogl.zQuad();
    q.resize(64, 64);
    q.attachTexture(tx);
    q.create();

    var sp = new zogl.zSprite();
    sp.loadFromTexture(tx);
    sp.flags.blend = true;
    sp.addObject(q, 100, 0);
    sp.move(150, 0);
    f.drawOnSprite("dicks", sp, 100, 0);

    mat4.translate(glGlobals.mv, [0, 100, 0]);

    var scene = new zogl.zScene();
    //scene.objects.push(sp);

    var game = function() {
        w.clear('#FFFFFF');

        glGlobals.defaultShader.bind();
        glGlobals.defaultShader.setParameter("mv", glGlobals.mv);

        texture.bind();
        vbo.draw();

        poly.draw();
        q.draw();

        //scene.draw();

        sp.draw();
        requestAnimationFrame(game);
    };

    requestAnimationFrame(game);
}

window.onload = function() {
    zogl.init(document.getElementById('webgl-canvas'));
    init();
};

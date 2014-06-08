function init() {
    var w = new zogl.zWindow(800, 600);
    w.init();

    var allRed = new zogl.zShader();
    allRed.loadFromString(zogl.SHADERS.defaultvs, [
        'precision mediump float;',

        'varying vec2 vs_texc;',
        'varying vec4 vs_color;',

        'uniform sampler2D texture;',

        'void main(void) {',
            'gl_FragColor = vec4(1.0, 0, 0, 1.0) + texture2D(texture, vs_texc);',
        '}'
    ].join('\n'));

    var allBlue = new zogl.zShader();
    allBlue.loadFromString(zogl.SHADERS.defaultvs, [
        'precision mediump float;',

        'varying vec2 vs_texc;',
        'varying vec4 vs_color;',

        'uniform sampler2D texture;',

        'void main(void) {',
            'gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0) + texture2D(texture, vs_texc);',
        '}'
    ].join('\n'));

    var texture = new zogl.zTexture();
    texture.loadFromFile("tank.png");

    /*
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
    */
    var f = new zogl.zFont();
    f.loadFromFile("monospace", 48);
    var tx = f.draw("help");

    var q = new zogl.zQuad();
    q.resize(64, 64);
    //q.attachTexture(tx);
    q.create();

    var scene = new zogl.zScene(0, 0, { "lighting": false });
    var sceneSprite = scene.addObject();
    sceneSprite.loadFromTexture(texture);
    sceneSprite.addObject(q);                   // <-- problem here; can't handle > 1 object
    //f.drawOnSprite("lel", sceneSprite);
    //f.drawOnSprite("dicks", sceneSprite, 100, 0);

    //sceneSprite.addPass(allRed);
    //sceneSprite.addPass(allBlue);

    var amb = scene.addLight(zogl.LightType.AMBIENT);
    amb.setBrightness(0.1);
    amb.setColor(new zogl.color4('#FFFFFF'));
    amb.update();

    var light = scene.addLight(zogl.LightType.POINT);
    light.setBrightness(1.5);
    light.setPosition(100, 100);
    light.setColor(new zogl.color4('#FFFFFF'));
    light.update();

    document.onmousemove = function(evt) {
        var pos = zogl.getMousePosition(evt);
        light.setPosition(pos.x, pos.y);
        light.update();
    };

    var game = function() {
        w.clear('#FFFFFF');
        scene.draw();
        requestAnimationFrame(game);
    };

    requestAnimationFrame(game);
}

window.onload = function() {
    zogl.debug = true;
    zogl.init(document.getElementById('webgl-canvas'));
    init();
};

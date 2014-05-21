zogl = zogl || {};

zogl.SHADERS = {
    'defaultvs' : [
        'attribute vec2 in_vert;',
        'attribute vec4 in_color;',
        'attribute vec2 in_texc;',

        'uniform mat4 mv;',
        'uniform mat4 proj;',

        'varying vec2 vs_texc;',
        'varying vec4 vs_color;',

        'void main(void) {',
            'gl_Position = proj * mv * vec4(in_vert, -1.0, 1.0);',
            'vs_color = in_color;',
            'vs_texc  = in_texc;',
        '}'
    ],

    'defaultfs' : [
        'precision mediump float;',

        'varying vec2 vs_texc;',
        'varying vec4 vs_color;',

        'uniform sampler2D texture;',

        'void main(void) {',
            'gl_FragColor = vs_color * texture2D(texture, vs_texc);',
        '}'
    ]
};

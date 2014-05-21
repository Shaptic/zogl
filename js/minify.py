import os

minified = open('zogl.min.js', 'w');
files = [
    'glMatrix-0.9.5.min.js',
    'zogl.js',
    'shaders.js',
    'texture.js',
    'window.js',
    'shader.js',
    'buffer.js',
    'bufferset.js',
    'polygon.js',
    'quad.js',
    'sprite.js',
    'font.js',
    'scene.js'
]

for filename in files:
    with open(filename, 'r') as f:
        minified.write(f.read() + '\n')

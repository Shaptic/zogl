# zogl

This is a minimalistic 2D, WebGL rendering framework. The architecture is
similar to that of another one of my GL projects, [Zenderer](https://github.com/Shaptic/Zenderer).

Many necessities in C++ / desktop OpenGL make the framework architecture
slightly more convolutecd that what is possible in Javascript and WebGL, which
follows the OpenGL ES specification. This means that the API is a bit cleaner
than was ever possible in Zenderer.

Limitations include:

- No GUI framework           (unnecessary)
- No VAO support             (emulated)
- No proper asset management (a possible **TODO**)

## Features

- Multi-faceted rendering API -- go as low level as you want
- `sprite` class to handle generic game entity use-cases
- Simple collision detection for all kinds of shapes            **TODO**
- Pixel-perfect lighting                                        **TODO**
- Fast object transformations via the [glmatrix library](https://code.google.com/p/glmatrix/wiki/Usage)

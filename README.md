= zogl =

This is a minimalistic 2D, WebGL rendering framework. The architecture is
similar to that of another one of my GL projects, [Zenderer](https://github.com/Shaptic/Zenderer).

Many necessities in C++ / desktop OpenGL make the framework architecture
slightly more convolutecd that what is possible in Javascript and WebGL, which
follows the OpenGL ES specification. This means that the API is a bit cleaner
than was ever possible in Zenderer.

Limitations include:

- No GUI framework           (unnecessary)
- No VAO support             (emulated)
- No proper asset management (a possible TODO)

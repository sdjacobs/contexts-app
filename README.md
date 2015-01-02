This is a new version of [contexts-app](http://rcc-uchicago.github.io/ling-viz/contexts-app/), an
application designed to help visualize data from Linguistica in a couple different ways.

The new version integrates the following modules:

* "graph", for a force-directed graph from an adjacency list
* "groups", which allows you to load categorical data into the graph, or run an algorithm to
determine categorization (right now, just Chinese Whispers)
* "partial-graph", which is another graph layout intended for part of a graph (specify a root, number of neighbors, and number of generations)
* "contexts", view the contexts of selected nodes alongside the graph.

We use the following technologies:

* [D3](d3js.org) is a data visualization library and provides some general-purpose Javascript programming tools.
* [require.js](requirejs.org) (NEW) is a Javascript framework that allows for on-demand loading of Javascript modules. This web project is forked from the require.js example of a single-page app, [here](https://github.com/volojs/create-template).
* [interact.js](interactjs.io) (NEW) provides the drag-and-drop and resizing features.

This web project has the following setup:

* www/ - the web assets for the project
    * index.html - the entry point into the app.
    * app.js - the top-level config script used by index.html
    * app/ - the directory to store project-specific scripts.
    * lib/ - the directory to hold third party scripts.
    * modules/ (\*) - directories for the separate modules. Each directory contains an html file and a JS file.
    * modules.json (\*) - defines each module (the page and javascript files to be loaded, if it exports/imports any objects...)
    * style.css (\*) - includes CSS styles copied from old project. (TODO: styles should really belong to the module that they are needed in.)
* tools/ - the build tools to optimize the project.

The "\*" notes aspects of the setup that were NOT part of the original template.

To optimize, run:

    node tools/r.js -o tools/build.js

That build command creates an optimized version of the project in a
**www-built** directory. The app.js file will be optimized to include
all of its dependencies.

For more information on the optimizer:
http://requirejs.org/docs/optimization.html

For more information on using requirejs:
http://requirejs.org/docs/api.html

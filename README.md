# sito_tree_lib 

A typescript library for data visualization via tree/graph rendering.

 ![img](https://github.com/sitodav/sito_tree_lib/blob/develop/images/Untitled.png "Optional title")

 ![img](https://github.com/sitodav/sito_tree_lib/blob/develop/images/Untitled2.png "Optional title")
 
 
Sito-tree is an open source library for hierarchical data visualization. The library shows json data as nodes of a tree. You can read arbitrary data, and its hierarchy will be shown as graph or tree, using a custom mapping schema. The library allows for interactive nodes creation, or merging. You can export the underlying data structure in every moment. There are lots of different events you can register callbacks on : like node click, edge click, node dragging, node merging and so on. The graphical properties are customizable: nodes size, stroke weights, font size and so on. Nodes color can be assigned randomly, and be fixed for all the elements that belong to a tree, or it can depend on a given internal property for the node's underlying data.
 
In this repository you can find both the library code (published on the npm registry) and an angular demo project.

For the library refer to the */lib* folder. 

The */demo* folder is relative to the demo project (read below).

You can find a video for the demo (base on an *older version*) here : [https://youtu.be/st5lzQrSdFw](https://youtu.be/vhS_yK41MUo)

The library depends on *P5js* for rendering (https://p5js.org/) that comes bundled with it (no need to include it directly
in your project)

This library is published on npm registry with the name *"sito-tree"* .



## How to install the library using npm: ##  

- in your angular project folder launch from terminal : *npm install sito-tree*


## How to update the library using npm: ##  

- add the library dependency to your package.json using the latest version, ie. *"sito-tree": "0.17.9"*
- launch from terminal : *npm update sito-tree*


## How to Install the demo project: ##

- clone the project
- move into /project
- npm install
- ng serve --port=4201
- connect to http://localhost:4201

 

 
 

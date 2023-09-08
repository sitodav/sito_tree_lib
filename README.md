# sito_tree_lib 

A typescript library for data visualization via tree/graph rendering.

It can be used both interactively, drawing and creationg your graph/tree as you go, or in read-only mode by loading data
from a json file, or API response, and visualizing it as graph/tree.
You can serialize the data as trees/graph on file, and load it later.

The library allows nodes creation/interaction (expansion, collapse, drag, redisposition) and json loading/export, according to a given/chosen (by you) schema.
It allows multiple callback functions to be registered on events on tree.

A list of events you can register a callback on :

- loadData_start : function input (tree,nodeschema,data),
  
- loadData_end : function input (tree,nodeschema,data),
  
- createNode_start : function input (tree,xpos, ypos, label, id, status),
- createNode_end : function input (tree,newRoot),
- deleteNode_start : function input (tree,id)
- deleteNode_end : function input (tree, deleted[])
- appendNodeTo_start : function input (tree,source,target),
- appendNodeTo_end : function input (tree,source,target),
- expandAll_start : function input (tree ),
- expandAll_end : function input (tree ),
- collapseAll_start : function input (tree ),
- collapseAll_end : function input (tree ),
- doubleClick_start : function input (tree,node),
- doubleClick_end : function input (tree,node),
- setup_start : function input (tree,p5sketch),
- setup_end : function input (tree,p5sketch),
- draw_start : function input (tree,p5sketch),
- draw_start : function input (tree,p5sketch),
- mouseMoved_start : function input (evt,tree,p5sketch),
- mouseMoved_end : function input (evt,tree,p5sketch),
- mouseStopped_start : function input (evt,tree,p5sketch),
- mouseStopped_end : function input (evt,tree,p5sketch),
- mouseClicked_start : function input (evt,tree,p5sketch,node), <--the input node is null if the click was not inside a node
- mouseClicked_end : function input (evt,tree,p5sketch,node), <--the input node is null if the click was not inside a node
- mouseDragged_start : function input (evt,tree,p5sketch,node), <--the input node is null if the click was not inside a node
- mouseDragged_end : function input (evt,tree,p5sketch,node),<--the input node is null if the click was not inside a node
- mousePressed_start : function input (evt,tree,p5sketch,node), <--the input node is null if the click was not inside a node
- mousePressed_end : function input (evt,tree,p5sketch,node), <--the input node is null if the click was not inside a node
- mouseReleased_start : function input (evt,tree,p5sketch,node), <--the input node is null if the click was not inside a node
- mouseReleased_end : function input (evt,tree,p5sketch,node) , <--the input node is null if the click was not inside a node
- nodeClicked :  function input (evt,tree,p5sketch,node), //NB <-- this start only when mouse is clicked inside a node 
- edgeClicked : function input (evt, tree, p5sketch, node[])
       
 

For the library refer to the */lib* folder. 

The */demo* folder is relative to the demo project (read below).

The library depends on *P5js* for rendering (https://p5js.org/) that comes bundled with it (no need to include it directly
in your project)

This library is published on npm registry with the name *"sito-tree"* .

To install the library in your project use **npm install sito-tree**

# Usage Example (demo)
Refer to the /demo folder
 

*Color by cluster example*

 ![img](https://github.com/sitodav/sito_tree_lib/blob/develop/images/Untitled.png "Optional title")
 
 *Color by internal status example*
 
 ![img](https://github.com/sitodav/sito_tree_lib/blob/develop/images/Untitled2.png "Optional title")
 
  
A node color can be set according to the cluster it belongs to, or using an internal property (status) that can be linked to loading data.
Every node is mapped to a given (data) object, that can come (as input) or go (as output, saved as file) from a json file/response.
**You configure , via a json schema, what properties of the json file (or response from back end) you want to map to the trees, and the library will
show you the data**

You can find a video for the demo (base on an *older version*) here : https://youtu.be/st5lzQrSdFw

*How to Install the demo project*:

- clone the project
- move into /project
- npm install
- ng serve --port=4201
- connect to http://localhost:4201


*How to use the tree schema to show existing json data as tree*:
TODO

 
 

# sito_tree_lib 
**(NB: the name for the library on the npm registry is "sito-tree" not "sito-tree-lib" anymore)**

typescript library for graph rendering.

The library allows tree creation/interaction (expansion, collapse, drag, redisposition) and json loading/export.
It allows multiple callback functions to be registered on events on tree.
A list of events you can register on :

 
-loadData_start : function input (tree,nodeschema,data)
-loadData_end : function input (tree,nodeschema,data) 
-createNode_start : function input (tree,xpos, ypos, label, id, status
-createNode_end : function input (tree,newRoot
-appendNodeTo_start : function input (tree,source,target
-appendNodeTo_end : function input (tree,source,target
-expandAll_start : function input (tree 
-expandAll_end : function input (tree 
-collapseAll_start : function input (tree 
-collapseAll_end : function input (tree 
-doubleClick_start : function input (tree,node
-doubleClick_end : function input (tree,node
-setup_start : function input (tree,p5sketch
-setup_end : function input (tree,p5sketch
-draw_start : function input (tree,p5sketch
-draw_start : function input (tree,p5sketch
-mouseMoved_start : function input (evt,tree,p5sketch
-mouseMoved_end : function input (evt,tree,p5sketch
-mouseStopped_start : function input (evt,tree,p5sketch
-mouseStopped_end : function input (evt,tree,p5sketch
-mouseClicked_start : function input (evt,tree,p5sketch,node
-mouseClicked_end : function input (evt,tree,p5sketch,node
-mouseDragged_start : function input (evt,tree,p5sketch,node
-mouseDragged_end : function input (evt,tree,p5sketch,node
-mousePressed_start : function input (evt,tree,p5sketch,node
-mousePressed_end : function input (evt,tree,p5sketch,node
-mouseReleased_start : function input (evt,tree,p5sketch,node
-mouseReleased_end : function input (evt,tree,p5sketch,node) 
       
 

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
 
  
The library allows to draw trees interactively and or using data (and can be set in readonly mode to just show the data underneath).
The node color can be set according to the cluster it belongs to, or using an internal property (status) that can be linked to loading data.

You can find a video for the demo here : https://youtu.be/st5lzQrSdFw

*How to Install the demo project*:

- clone the project
- move into /project
- npm install
- ng serve --port=4201
- connect to http://localhost:4201


-------
*Version 0.3.7 : added horizontal and vertical layout for trees generated via data loading*
 

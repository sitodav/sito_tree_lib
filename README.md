# sito_tree_lib 
**(NB: the name for the library on the npm registry is "sito-tree" not "sito-tree-lib" anymore)**

typescript library for graph rendering.



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

 

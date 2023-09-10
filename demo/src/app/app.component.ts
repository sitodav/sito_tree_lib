import { Component, OnInit } from '@angular/core';
////import { SitoTree } from './sito_tree/sito_tree.class';
//import { SitoTreeNodeSchema } from './sito_tree/sito_treenodeschema';
import { SitoTree } from 'sito-tree/dist'
import { SitoTreeNodeSchema } from 'sito-tree/dist'
import { SitoForestLayout } from 'sito-tree/dist/classes/sito_forest_layout';
import { SitoTreeNodeRendering } from 'sito-tree/dist/classes/sito_treenoderendering';
import { MockDataUtils } from 'src/utils/mockdata_utils';
import { GenericUtils } from 'src/utils/utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  /****************GENERAL DATA STRUCTURES ************************************************************** */
  /*schema is used to map json data to tree node structures */
  shared_simpleschema: SitoTreeNodeSchema = { statusproperty: "status", idproperty: "fooId", childrenproperty: "children", textproperty: "fooId" };
  /*this is just a random color generation array. These will be randomly assigned as colors to node clusters .
  It's used from multiple trees */
  sharedColorPalettesForRandomGeneration = ["#048ba8", "#5f0f40", "#1b998b", "#9a031e", "#30638e", "#fb8b24", "#e36414", "#1982c4", "#0f4c5c", "#d100d1", "#31572c", "#fbff12", "#132a13", "#ffd6ff", "#2dc653", "#ead2ac", "#208b3a", "#fdc500", "#ffff3f", "#ff0a54", "#f3722c", "#43aa8b", "#660708", "#6a00f4", "#8ac926", "#415a77"];
  /*This is just a state color map -> for a given possible NODE STATE, we assign a color 
  NODE STATES are loaded from the data
  */
  sharedColorByStateMap = {
    "COMPLETED_SUCCESS": "#00ff00",
    "STOPPED": "#e95a13",
    "RUNNING": "#0672de",
    "CREATED": "#bfbfbf",
    "COMPLETED_ERROR": "#ff3333",
    "SCHEDULED": "#bfbfbf",
    "DEFAULT": "#000000" //fallback
  };


  /*****************EXAMPLE 1 DATA STRUCTURES *********************** ***********************************/
  /*
   DECLARATION OF EXAMPLE 1 TREE RENDERING PROPERTIES:
    -Color of nodes by cluster
    -No changing node size (based on children number)
    -Clickable edges (when it's allowed you can register a callback on it)
    -Fully modifiable tree (node creation, node append)
    -Multiple father disabled
  */
  node_rendering_props1: SitoTreeNodeRendering =
    {
      colorByClusterPalettes: this.sharedColorPalettesForRandomGeneration,
      sizeBasedOnNumChildren: false,
      vertexStrokeWeight: 2,
      edgeMouseOverColor: "#479ff588"

    }

  /*
   EXAMPLE 1 TREE DECLARATION
  */
  tree_example1: SitoTree;


  /*****************EXAMPLE 2 DATA STRUCTURES *********************** ***********************************/
  /*
   DECLARATION OF EXAMPLE 2 TREE RENDERING PROPERTIES:
    -Color of node state
    -Fixed node size
    -Non Clickable edges
    -Non modifiable tree (data is loaded asynchronously to populate the tree)
    -Multiple father disabled
    -Several graphical properties defined custom
  */
  node_rendering_props2: SitoTreeNodeRendering =
    {
      colorByStateMap: this.sharedColorByStateMap,
      sizeBasedOnNumChildren: false,
      labelMaxLength: 10,
      labelTrailing: "---",
      nodeBorderWeight: 3,
      vertexStrokeWeight: 5,
      vertexColor: '#ff0000',
      textColor: '#ffff00',
      textWeight: 3,
      textSize: 22

    }

  /*
   EXAMPLE 2 TREE DECLARATION
  */
  tree_example2: SitoTree;


  /*****************EXAMPLE 3 DATA STRUCTURES *********************** **********************************/
  /*SAME AS BEFORE, BUT THIS TREE WILL BE INITIALIZED (CONSTRUCTOR) USING A VERTICAL LAYOUT
  FOR NODE DISPOSITIONS
  /*
   DECLARATION OF EXAMPLE 3 TREE RENDERING PROPERTIES:
    -Color of node state
    -Fixed node size
    -Clickable edges
    -Non modifiable tree (data is loaded asynchronously to populate the tree)
    -Multiple father ENABLED 
  */
  node_rendering_props3: SitoTreeNodeRendering =
    {
      colorByStateMap: this.sharedColorByStateMap,
      vertexStrokeWeight: 2,
      edgeMouseOverColor: "#ff00ff88"

    }
  /*
   DECLARATION OF EXAMPLE 3 ALLOWED PROPERTIES 
  */
  allowed_ops5 = { readOnly: true, nodeCreation: false, nodeAppend: false };
  /*
  LAYOUT DECLARATION 
   The layouts are used when generating trees from data, to give the position to the trees 
  */
  rowWise_layout_example3: SitoForestLayout =
    {
      orientation: "FILLFIXEDHORIZONTAL_EXPANDVERTICAL",
      maxNumOfColumns: 4,
      maxNumberOfRows: -1,
      horizontalReservedSpaceForTree: 450,
      verticalReservedSpaceForTree: 450,
      paddingLeft: 0,
      paddingTop: 0,
      paddingRight: 450,
      paddingBottom: 20
    }
  /*
   EXAMPLE 3 TREE DECLARATION
  */
  tree_example3: SitoTree;



  /*****************EXAMPLE 4 DATA STRUCTURES *********************** **********************************/
  /*SAME AS BEFORE, BUT THIS TREE WILL BE INITIALIZED (CONSTRUCTOR) USING A HORIZONTAL LAYOUT
  /*
   DECLARATION OF EXAMPLE 4 TREE RENDERING PROPERTIES:
    -Color of node state
    -Fixed node size
    -Clickable edges
    -Non modifiable tree (data is loaded asynchronously to populate the tree)
    -Multiple father ENABLED 
  */
  node_rendering_props4: SitoTreeNodeRendering =
    {
      colorByStateMap: this.sharedColorByStateMap,
      vertexStrokeWeight: 2,
      edgeMouseOverColor: "#ff00ff88"

    }
  /*
  DECLARATION OF EXAMPLE 4 ALLOWED PROPERTIES 
 */
  allowed_ops4 = { readOnly: true, nodeCreation: false, nodeAppend: false };
  /*
  LAYOUT DECLARATION 
   The layouts are used when generating trees from data, to give the position to the trees 
  */
  /*Example of HORIZONTAL LAYOUT*/
  columnWide_layout_example4: SitoForestLayout =
    {
      orientation: "FILLFIXEDVERTICAL_EXPANDHORIZONTAL",
      maxNumOfColumns: -1,
      maxNumberOfRows: 4,
      horizontalReservedSpaceForTree: 400,
      verticalReservedSpaceForTree: 250,
      paddingLeft: 0,
      paddingTop: 20,
      paddingRight: 450,
      paddingBottom: 20
    }
  /*
   EXAMPLE 4 TREE DECLARATION
  */
  tree_example4: SitoTree;



  /*****************EXAMPLE 5 DATA STRUCTURES *********************** ***********************************/
  /*
   DECLARATION OF EXAMPLE 5 TREE RENDERING PROPERTIES:
     
  */
  node_rendering_props5: SitoTreeNodeRendering =
    {
      colorByStateMap: this.sharedColorByStateMap,
      sizeBasedOnNumChildren: false,
      vertexStrokeWeight: 2

    }

  /*
   EXAMPLE 5 TREE DECLARATION
  */
  tree_example5: SitoTree;
  /*Exported json data for example 5 */
  example5_sourcedata_jsonstr: string;
  /*
  When we create a node from data, we have to create a schema that tells the
  library what data use from the json to create node structures 
  */
  example5_schema: SitoTreeNodeSchema = { statusproperty: "status", idproperty: "fooId", childrenproperty: "children", textproperty: "fooId", dataobject: "fooPayload" };
  example5_schema_jsonstr: string = GenericUtils.prittifyJson(this.example5_schema);
  example5_selectednode_jsonstr: string;
  /*****************EXAMPLE 6  DATA STRUCTURES *********************** ***********************************//*
    DECLARATION OF EXAMPLE 6 TREE RENDERING PROPERTIES:
      
   */
  example6_typemap = {
    "PERSON": "#00ffcc",
    "EMPLOYEE": "#e95a13",
    "STUDENT": "#0672de",
    "BACHELOR": "#bfbf00",
    "MASTER": "#ff3333",
    "MANAGER": "#bfbfbf",
    "TASKMANAGER": "#0ff02a" //fallback
  };


  example6_renderingprops: SitoTreeNodeRendering = {
    startingRay: 60, textSize: 12, labelMaxLength: 10, colorByStateMap: this.example6_typemap, edgeMouseOverColor: "#479ff588",
    vertexStrokeWeight: 2
  };
  /*
   EXAMPLE 6 TREE DECLARATION
  */
  tree_example6: SitoTree;
  /*Exported json data for example 6*/
  example6_sourcedata_jsonstr: string = GenericUtils.prittifyJson(MockDataUtils.mockedData9);
  /*Tree schemas for example 6 */
  example6_schema: SitoTreeNodeSchema = { statusproperty: "type", idproperty: "typeId", childrenproperty: "subTypes", textproperty: "typeName" };
  example6_schema_jsonstr: string = GenericUtils.prittifyJson(this.example6_schema); //for html visualization as json
  example6_selectededge_str: string;


  ngOnInit() {

    /*
      TREES INITIALIZATION *********************************
    */

    /*EXAMPLE 1 TREE */
    this.tree_example1 = new SitoTree('example_1_div', { readOnly: false, nodeCreation: true, nodeAppend: true },
      this.node_rendering_props1, false);

    /*EXAMPLE 3 TREE */
    this.tree_example2 = new SitoTree('example_2_div', { readOnly: true, nodeCreation: false, nodeAppend: false },
      this.node_rendering_props2, false);

    /*EXAMPLE 3 TREE */
    this.tree_example3 = new SitoTree('example_3_div', { readOnly: true, nodeCreation: false, nodeAppend: false },
      this.node_rendering_props3, true, this.rowWise_layout_example3);

    /*EXAMPLE 4 TREE */
    this.tree_example4 = new SitoTree('example_4_div', { readOnly: true, nodeCreation: false, nodeAppend: false },
      this.node_rendering_props4, true, this.columnWide_layout_example4);

    /*EXAMPLE 8 TREE */
    this.tree_example5 = new SitoTree('example_5_div', { readOnly: false, nodeCreation: true, nodeAppend: true },
      this.node_rendering_props5, false);

    /*EXAMPLE 6 TREE */
    this.tree_example6 = new SitoTree('example_6_div', { readOnly: true, nodeCreation: false, nodeAppend: false },
      this.example6_renderingprops, false);

  }
  ngAfterViewInit(): void {

    /*ASYNCHRONOUSLY DATA LOADING SIMULATION */
    /*To simulate loading from server we use a little bit of dirty callback nesting
    (I could have used pipes I know) */
    setTimeout(() => {

      this.loadDataForTheNeededTrees();


    }, 3000);



    /*
    CALLBACK REGISTRATION 
    for a list of available callbacks (and what parameters to expect as input ) checkout the git readme out  
    */

    /*CALLBACK REGISTRATION EXAMPLE 1*/
    this.tree_example1.addCallback("nodeClicked", this.callback_OnNodeClick_Highlight);
    this.tree_example1.addCallback("edgeClicked", this.callback_OnEdgeClick_Highlight);
    this.tree_example1.addCallback("doubleClick_end", this.callback_OnDoubleClick_Logging);
    this.tree_example1.addCallback("nodeClicked", this.callback_OnNodeClick_Highlight);
    this.tree_example1.addCallback("createNode_start", this.callback_OnNodeCreation_Logging);
    this.tree_example1.addCallback("appendNodeTo_end", this.callback_OnNodeAppend_Logging);
    this.tree_example1.addCallback("mouseDragged_end", this.callback_OnMouseDragged_Logging);

    /*CALLBACK REGISTRATION EXAMPLE3*/
    this.tree_example3.addCallback("nodeClicked", this.callback_OnNodeClick_Highlight);
    this.tree_example3.addCallback("edgeClicked", this.callback_OnEdgeClick_Highlight);

    /*CALLBACK REGISTRATION EXAMPLE4*/
    this.tree_example4.addCallback("nodeClicked", this.callback_OnNodeClick_Highlight);
    this.tree_example4.addCallback("edgeClicked", this.callback_OnEdgeClick_Highlight);


    /*CALLBACK REGISTRATION EXAMPLE5*/
    this.tree_example5.addCallback("createNode_start", this.callback_OnNodeCreation_saveTreeData);
    this.tree_example5.addCallback("appendNodeTo_end", this.callback_OnNodeAppend_saveTreeData);
    this.tree_example5.addCallback("nodeClicked", this.callback_OnNodeClick_Example5);

    /*CALLBACK REGISTRATION EXAMPLE6*/
    this.tree_example6.addCallback("edgeClicked", this.callback_OnEdgeClick_Example9);
  }






  /*
  METHODS USED AS CALLBACKS 
  */

  //this callback , when edge is clicked, trigger edge highlighint (different from edge highlighting on mouse over, which is automatic)
  callback_OnEdgeClick_Highlight = (evt, tree, sketch, verticesEdge) => {
    try {
      console.log("clicked on edge from two nodes, first : " + verticesEdge[0].label + " and second : " + verticesEdge[1].label);
      if (tree.isEdgeHighlighted(verticesEdge[0], verticesEdge[1]))
        tree.removeHighlightEdge(verticesEdge[0], verticesEdge[1]);
      else
        tree.highlightEdge(verticesEdge[0], verticesEdge[1], "#00ff0099");


      evt.stopPropagation();
    } catch (e) { }

  }

  //this callback highlight a node when clicked
  callback_OnNodeClick_Highlight = (evt, tree, sketch, node) => {

    //simulating click on row on the ro
    let _nodeId = node.id;
    tree.removeAllNodeshightlits();
    tree.highlightNode(_nodeId, "#479ff5");

  }



  //this callback just print a log at console
  callback_OnNodeAppend_Logging = (tree, source, target) => {
    try {
      console.log("CALLBACK >>>Node append : appending " + source.id + " to " + target.id);
    } catch (e) { }

  }

  callback_OnDoubleClick_Logging = (tree, node) => {
    try {
      console.log("CALLBACK >>>Double click on node : " + node.id);
    } catch (e) { }

  }

  callback_OnNodeCreation_Logging =
    (tree, xpos, ypos, label, id, status) => {
      try {
        console.log("CALLBACK >>>New node creation : " + id + " in x: " + xpos + " and y: " + ypos);
      } catch (e) { }

    }

  callback_OnMouseDragged_Logging = (evt, tree, sketch, node) => {
    try {
      console.log("CALLBACK MOUSE DRAGGED WITH ID " + node.id);
    } catch (e) { }

  }


  //this callback export tree data when a node is added
  callback_OnNodeCreation_saveTreeData =
    (tree, xpos, ypos, label, id, status) => {
      try {
        let dataForTree = tree.exportData(this.example5_schema);
        this.example5_sourcedata_jsonstr = GenericUtils.prittifyJson(dataForTree);
      } catch (e) { }

    }



  callback_OnNodeAppend_saveTreeData = (tree, source, target) => {
    try {
      let dataForTree = tree.exportData(this.example5_schema);
      this.example5_sourcedata_jsonstr = GenericUtils.prittifyJson(dataForTree);
    } catch (e) { }

  }

  callback_OnNodeClick_Example5 = (evt, tree, sketch, node) => {

    try {

      let _nodeId = node.id;
      tree.removeAllNodeshightlits();
      tree.highlightNode(_nodeId, "#479ff5");
      this.example5_selectednode_jsonstr = GenericUtils.prittifyJson(JSON.stringify(node.dataobject));
    } catch (E) { }


  }

  callback_OnEdgeClick_Example9 = (evt, tree, p5sketch, verticesEdge) => {

    try {

      tree.removeAllHighlightEdge();
      tree.highlightEdge(verticesEdge[0], verticesEdge[1], "#00ff00cc");

      this.example6_selectededge_str = "from " + verticesEdge[0].id + " to " + verticesEdge[1].id;

    } catch (E) { }


  }

  /*Method called onInit to load asynchronous data for trees */
  loadDataForTheNeededTrees() {

    /*ASYNC DATA LOADING FOR EXAMPLE 3*/
    this.tree_example2.loadData(MockDataUtils.mockedData1, this.shared_simpleschema, true);
    /*ASYNC DATA LOADING FOR EXAMPLE 5*/
    this.tree_example3.loadData(MockDataUtils.mockedDataMultipleFathers, this.shared_simpleschema, true);
    /*ASYNC DATA LOADING FOR EXAMPLE 6*/
    this.tree_example4.loadData(MockDataUtils.mockedDataMultipleFathers, this.shared_simpleschema, true);
    /*ASYNC DATA LOADING FOR EXAMPLE 8*/
    this.tree_example5.loadData(MockDataUtils.mockedData8, this.example5_schema, true);
    /*ASYNC DATA LOADING FOR EXAMPLE 9*/
    this.tree_example6.loadData(MockDataUtils.mockedData9, this.example6_schema, true);
  }



  /* METHOD REGISTERED ON SIMPLE HTML BUTTONS TO INTERACT EXTERNALLY (NO CALLBACK) WITH THE TREES */

  public expandExample2Tree() {
    this.tree_example2.expandAll();
  }

  public collapseExample2Tree() {
    this.tree_example2.collapseAll();
  }


  public updateDataForExample2Tree() {
    setTimeout(() => {
      this.tree_example2.loadData(MockDataUtils.mockedData1_differentstatus, this.shared_simpleschema, false);
    }, 1000);
  }



}



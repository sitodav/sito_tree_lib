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

  /*
 When we create a node from data, we have to create a schema that tells the
 library what data use from the json to create node structures 
 */
  sharedTreeSchemaForDataLoading: SitoTreeNodeSchema = {
    statusproperty: "status",
    idproperty: "fooId",
    childrenproperty: "children",
    textproperty: "fooId",
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
      vertexStrokeWeight: 1,
      edgeMouseOverColor: "#479ff588"

    }
  /*
   DECLARATION OF EXAMPLE 1 ALLOWED PROPERTIES 
  */
  allowed_ops1 = { readOnly: false, nodeCreation: true, nodeAppend: true, clickableEdges: true };
  /*
   EXAMPLE 1 TREE DECLARATION
  */
  tree_example1: SitoTree;



  /*****************EXAMPLE 2 DATA STRUCTURES *********************** ***********************************/
  /*
   DECLARATION OF EXAMPLE 2 TREE RENDERING PROPERTIES:
    -Color of nodes by cluster
    -Node size changing according to children number
    -Non Clickable edges
    -Fully modifiable tree (node creation, node append)
    -Multiple father disabled
  */
  node_rendering_props2: SitoTreeNodeRendering =
    {
      colorByClusterPalettes: this.sharedColorPalettesForRandomGeneration,
      sizeBasedOnNumChildren: true,
      vertexStrokeWeight: 1,


    }
  /*
   DECLARATION OF EXAMPLE 2 ALLOWED PROPERTIES 
  */
  allowed_ops2 = { readOnly: false, nodeCreation: true, nodeAppend: true };
  /*
   EXAMPLE 2 TREE DECLARATION
  */
  tree_example2: SitoTree;



  /*****************EXAMPLE 3 DATA STRUCTURES *********************** ***********************************/
  /*
   DECLARATION OF EXAMPLE 3 TREE RENDERING PROPERTIES:
    -Color of node state
    -Fixed node size
    -Non Clickable edges
    -Non modifiable tree (data is loaded asynchronously to populate the tree)
    -Multiple father disabled
    -Several graphical properties defined custom
  */
  node_rendering_props3: SitoTreeNodeRendering =
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
   DECLARATION OF EXAMPLE 3 ALLOWED PROPERTIES 
  */
  allowed_ops3 = { readOnly: true, nodeCreation: false, nodeAppend: false };
  /*
   EXAMPLE 3 TREE DECLARATION
  */
  tree_example3: SitoTree;



  /*****************EXAMPLE 4 DATA STRUCTURES *********************** **********************************/
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
      edgeMouseOverColor: "#ff00ff88"

    }
  /*
   DECLARATION OF EXAMPLE 4 ALLOWED PROPERTIES 
  */
  allowed_ops4 = { readOnly: true, nodeCreation: false, nodeAppend: false, clickableEdges: true };
  /*
   EXAMPLE 4 TREE DECLARATION
  */
  tree_example4: SitoTree;




  /*****************EXAMPLE 5 DATA STRUCTURES *********************** **********************************/
  /*SAME AS BEFORE, BUT THIS TREE WILL BE INITIALIZED (CONSTRUCTOR) USING A VERTICAL LAYOUT
  FOR NODE DISPOSITIONS
  /*
   DECLARATION OF EXAMPLE 5 TREE RENDERING PROPERTIES:
    -Color of node state
    -Fixed node size
    -Clickable edges
    -Non modifiable tree (data is loaded asynchronously to populate the tree)
    -Multiple father ENABLED 
  */
  node_rendering_props5: SitoTreeNodeRendering =
    {
      colorByStateMap: this.sharedColorByStateMap,

      edgeMouseOverColor: "#ff00ff88"

    }
  /*
   DECLARATION OF EXAMPLE 5 ALLOWED PROPERTIES 
  */
  allowed_ops5 = { readOnly: true, nodeCreation: false, nodeAppend: false, clickableEdges: true };
  /*
  LAYOUT DECLARATION 
   The layouts are used when generating trees from data, to give the position to the trees 
  */
  rowWise_layout_example5: SitoForestLayout =
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
   EXAMPLE 5 TREE DECLARATION
  */
  tree_example5: SitoTree;



  /*****************EXAMPLE 6 DATA STRUCTURES *********************** **********************************/
  /*SAME AS BEFORE, BUT THIS TREE WILL BE INITIALIZED (CONSTRUCTOR) USING A HORIZONTAL LAYOUT
  /*
   DECLARATION OF EXAMPLE 5 TREE RENDERING PROPERTIES:
    -Color of node state
    -Fixed node size
    -Clickable edges
    -Non modifiable tree (data is loaded asynchronously to populate the tree)
    -Multiple father ENABLED 
  */
  node_rendering_props6: SitoTreeNodeRendering =
    {
      colorByStateMap: this.sharedColorByStateMap,
      edgeMouseOverColor: "#ff00ff88"

    }
  /*
  DECLARATION OF EXAMPLE 6 ALLOWED PROPERTIES 
 */
  allowed_ops6 = { readOnly: true, nodeCreation: false, nodeAppend: false, clickableEdges: true };
  /*
  LAYOUT DECLARATION 
   The layouts are used when generating trees from data, to give the position to the trees 
  */
  /*Example of HORIZONTAL LAYOUT*/
  columnWide_layout_example6: SitoForestLayout =
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
   EXAMPLE 6 TREE DECLARATION
  */
  tree_example6: SitoTree;

/*****************EXAMPLE 7 DATA STRUCTURES *********************** ***********************************/
  /*
   DECLARATION OF EXAMPLE 7 TREE RENDERING PROPERTIES:
     
  */
    node_rendering_props7: SitoTreeNodeRendering =
    {
      colorByClusterPalettes: this.sharedColorPalettesForRandomGeneration,
      sizeBasedOnNumChildren: false,
      vertexStrokeWeight: 1,
      edgeMouseOverColor: "#479ff588"

    }
  /*
   DECLARATION OF EXAMPLE 1 ALLOWED PROPERTIES 
  */
  allowed_ops7 = { readOnly: false, nodeCreation: true, nodeAppend: true, clickableEdges: true };
  /*
   EXAMPLE 1 TREE DECLARATION
  */
  tree_example7: SitoTree;






  /*the various example */
  tree_interactive_anddataviajson: SitoTree;
  exportedData_jsonPretty: string;

  ngOnInit() {

    /*
      TREES INITIALIZATION *********************************
    */

    /*EXAMPLE 1 TREE */
    this.tree_example1 = new SitoTree('example_1_div', this.allowed_ops1, this.node_rendering_props1, false);
    /*EXAMPLE 2 TREE */
    this.tree_example2 = new SitoTree('example_2_div', this.allowed_ops2, this.node_rendering_props2, false);
    /*EXAMPLE 3 TREE */
    this.tree_example3 = new SitoTree('example_3_div', this.allowed_ops3, this.node_rendering_props3, false);
    /*EXAMPLE 4 TREE */
    this.tree_example4 = new SitoTree('example_4_div', this.allowed_ops4, this.node_rendering_props4, true);
    /*EXAMPLE 5 TREE */
    this.tree_example5 = new SitoTree('example_5_div', this.allowed_ops5, this.node_rendering_props5, true, this.rowWise_layout_example5);
    /*EXAMPLE 6 TREE */
    this.tree_example6 = new SitoTree('example_6_div', this.allowed_ops5, this.node_rendering_props6, true, this.columnWide_layout_example6);
    /*EXAMPLE 6 TREE */
    this.tree_example7 = new SitoTree('example_7_div', { readOnly: false, nodeCreation: true, nodeAppend: true }, this.node_rendering_props1, false);
    // /*interactive tree but initialized with json data*/
    this.tree_interactive_anddataviajson = new SitoTree('tree_interactive_anddataviajson', { readOnly: false, nodeCreation: true, nodeAppend: true }, this.node_rendering_props1, false);
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

    /*CALLBACK REGISTRATION EXAMPLE5*/
    this.tree_example5.addCallback("nodeClicked", this.callback_OnNodeClick_Highlight);
    this.tree_example5.addCallback("edgeClicked", this.callback_OnEdgeClick_Highlight);

    /*CALLBACK REGISTRATION EXAMPLE6*/
    this.tree_example6.addCallback("nodeClicked", this.callback_OnNodeClick_Highlight);
    this.tree_example6.addCallback("edgeClicked", this.callback_OnEdgeClick_Highlight);

    /*CALLBACK REGISTRATION EXAMPLE7*/
    this.tree_example7.addCallback("doubleClick_end", this.callback_OnDoubleClick_Logging);
    this.tree_example7.addCallback("edgeClicked", this.callback_OnEdgeClick_Highlight);
    this.tree_example7.addCallback("nodeClicked", this.callback_OnNodeClick_Highlight);
    this.tree_example7.addCallback("createNode_start", this.callback_OnNodeCreation_Logging);
    this.tree_example7.addCallback("appendNodeTo_end", this.callback_OnNodeAppend_Logging);
    this.tree_example7.addCallback("mouseDragged_end", this.callback_OnMouseDragged_Logging);


    this.tree_interactive_anddataviajson.addCallback("createNode_start", this.callback_OnNodeCreation_saveTreeData);
    this.tree_interactive_anddataviajson.addCallback(
      "appendNodeTo_end",
      (tree, source, target) => {
        try {
          let dataForTree = tree.exportData(this.sharedTreeSchemaForDataLoading);
          this.exportedData_jsonPretty = GenericUtils.prittifyJson(dataForTree);
        } catch (e) { }

      }
    );


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

  //this callback export tree data when a node is added
  callback_OnNodeCreation_saveTreeData =
    (tree, xpos, ypos, label, id, status) => {
      try {
        let dataForTree = tree.exportData(this.sharedTreeSchemaForDataLoading);
        this.exportedData_jsonPretty = GenericUtils.prittifyJson(dataForTree);
      } catch (e) { }

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



  /*Method called onInit to load asynchronous data for trees */
  loadDataForTheNeededTrees() {

    /*ASYNC DATA LOADING FOR EXAMPLE 3*/
    this.tree_example3.loadData(MockDataUtils.mockedData1, this.sharedTreeSchemaForDataLoading, true);
    /*ASYNC DATA LOADING FOR EXAMPLE 4*/
    this.tree_example4.loadData(MockDataUtils.mockedDataMultipleFathers, this.sharedTreeSchemaForDataLoading, true);
    /*ASYNC DATA LOADING FOR EXAMPLE 5*/
    this.tree_example5.loadData(MockDataUtils.mockedDataMultipleFathers, this.sharedTreeSchemaForDataLoading, true);
    /*ASYNC DATA LOADING FOR EXAMPLE 6*/
    this.tree_example6.loadData(MockDataUtils.mockedDataMultipleFathers, this.sharedTreeSchemaForDataLoading, true);


    this.tree_interactive_anddataviajson.loadData(MockDataUtils.mockedData1, this.sharedTreeSchemaForDataLoading, true);
  }



  /* METHOD REGISTERED ON SIMPLE HTML BUTTONS TO INTERACT EXTERNALLY (NO CALLBACK) WITH THE TREES */

  public expandExample3Tree() {
    this.tree_example3.expandAll();
  }

  public collapseExample3Tree() {
    this.tree_example3.collapseAll();
  }


  public updateDataForExample3Tree() {
    setTimeout(() => {
      this.tree_example3.loadData(MockDataUtils.mockedData1_differentstatus, this.sharedTreeSchemaForDataLoading, false);
    }, 1000);
  }



}



import { Component, OnInit } from '@angular/core';
////import { SitoTree } from './sito_tree/sito_tree.class';
//import { SitoTreeNodeSchema } from './sito_tree/sito_treenodeschema';
import {SitoTree} from 'sito-tree/dist'
import {SitoTreeNodeSchema} from 'sito-tree/dist'
import { SitoForestLayout } from 'sito-tree/dist/classes/sito_forest_layout';
import { SitoTreeNodeRendering } from 'sito-tree/dist/classes/sito_treenoderendering';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  /*palettes used for colors when the color of a node depends on its cluster.
  The palettes are used to randomly assign a color to each new cluster */
  
  /*colors used then the color of a node depends on the state */
 

  node_rendering_props1 : SitoTreeNodeRendering = 
  {
    colorByClusterPalettes : ["#048ba8","#5f0f40","#1b998b","#9a031e","#30638e","#fb8b24","#e36414","#1982c4","#0f4c5c","#d100d1","#31572c","#fbff12","#132a13","#ffd6ff","#2dc653","#ead2ac","#208b3a","#fdc500","#ffff3f","#ff0a54","#f3722c","#43aa8b","#660708","#6a00f4","#8ac926","#415a77"],
    sizeBasedOnNumChildren : false ,
    vertexStrokeWeight : 1,
    // hightlightEdgesOnMouseOverColor = "#479ff555" //added manually on the cloned properties only for the first tree
    

   
  }

  node_rendering_props2 : SitoTreeNodeRendering = 
  {
    colorByStateMap : {
      "COMPLETED_SUCCESS": "#00ff00",
      "STOPPED": "#e95a13",
      "RUNNING": "#0672de",
      "CREATED": "#bfbfbf",
      "COMPLETED_ERROR": "#ff3333",
      "SCHEDULED": "#bfbfbf",
      "DEFAULT": "#000000" //fallback
    },
    sizeBasedOnNumChildren : false
    //other graphical props for node
    //   labelMaxLength : 10,
    //  labelTrailing : "---",
    //  nodeBorderWeight  : 3,
    //  vertexStrokeWeight : 5,
    //  vertexColor : '#ff0000',
    //  textColor : '#00ff00',
    //  textWeight : 3,
    //  textSize : 22

  }
 


  /*The layouts are used when generating trees from data, to give the position to the trees */
  /*example of a fixed horizontal, expand vertically , layout */
 
  forest_layout_expandvertical : SitoForestLayout =
  {
    orientation : "FILLFIXEDHORIZONTAL_EXPANDVERTICAL",  
    maxNumOfColumns: 4,
    maxNumberOfRows: -1,  
    horizontalReservedSpaceForTree:450,
    verticalReservedSpaceForTree : 450,
    paddingLeft: 0,
    paddingTop: 0,
    paddingRight: 450,
    paddingBottom: 20
  } 

  /*Example of FILLFIXEDVERTICAL_EXPANDHORIZONTAL*/
  forest_layout_expandhorizontal : SitoForestLayout =
  {
    orientation : "FILLFIXEDVERTICAL_EXPANDHORIZONTAL",  
    maxNumOfColumns: -1,
    maxNumberOfRows: 4,  
    horizontalReservedSpaceForTree: 400,
    verticalReservedSpaceForTree : 450,
    paddingLeft: 0,
    paddingTop: 20,
    paddingRight: 450,
    paddingBottom: 20
  }
 

  
  
   /*
  When we create a node from data, we have to create a schema that tells the
  library what data use from the json to create node structures */

  public treeSchemaForMockedData: SitoTreeNodeSchema = {
    statusproperty: "status",
    idproperty: "fooId",
    childrenproperty: "children",
    textproperty: "fooId",
  };

  /*the various example */
  tree_interactiveClustercolorsNoautosize: SitoTree;
  tree_interactiveClustercolorsAutosize:SitoTree;
  tree_readonly_colorbystate_autosize:SitoTree;
  tree_readonly_multiplefathers:SitoTree;
  tree_readonly_expandverticallayout:SitoTree;
  tree_readonly_expandhorizontallayout:SitoTree;
  tree_readonly_interactive_withcallbacks:SitoTree;
  tree_interactive_anddataviajson:SitoTree;
  exportedData_jsonPretty : string;

  ngOnInit() {
     
    /*tree with color by cluster, no autosize, interactive */
    let clonedProps0 = JSON.parse(JSON.stringify(this.node_rendering_props1 ));
    clonedProps0.clickableEdges = true;
    clonedProps0.hightlightEdgesOnMouseOverColor = "#479ff588"; //cloning props to set highlight for edges only on first tree (opacity in the #hex color as last two digits)
    this.tree_interactiveClustercolorsNoautosize = new SitoTree('tree_interactive_clustercolors_noautosize', {readOnly: false, nodeCreation : true, nodeAppend : true}, clonedProps0, false);

    /*tree with color by cluster, autosize, interactive */
    let clonedProps1 = JSON.parse(JSON.stringify(this.node_rendering_props1 ));
    clonedProps1.sizeBasedOnNumChildren = true;
    this.tree_interactiveClustercolorsAutosize = new SitoTree('tree_interactive_clustercolors_autosize', {readOnly: false, nodeCreation : true, nodeAppend : true}, clonedProps1, false);
    // /*tree with color by node state, autosize, data loaded with json data, single father */
    this.tree_readonly_colorbystate_autosize = new SitoTree('tree_readonly_colorbystate_autosize', {readOnly: true, nodeCreation : false, nodeAppend : false}, this.node_rendering_props2,  false);
    // /*tree with color by node state, autosize, loaded with json data, multiple fathers */
    this.tree_readonly_multiplefathers = new SitoTree('tree_readonly_multiplefathers', {readOnly: true, nodeCreation : false, nodeAppend : false}, this.node_rendering_props2,  true);
    // /*tree with color by node state, autosize, loaded with json data, multiple father and expand vertical layout */
    this.tree_readonly_expandverticallayout = new SitoTree('tree_readonly_expandverticallayout', {readOnly: true, nodeCreation : false, nodeAppend : false}, this.node_rendering_props2,    true,this.forest_layout_expandvertical );
    // /*tree with color by node state, autosize, loaded with json data, multiple father and expand horizontal layout */
    this.tree_readonly_expandhorizontallayout = new SitoTree('tree_readonly_expandhorizontallayout', {readOnly: true, nodeCreation : false, nodeAppend : false},  this.node_rendering_props2,  true, this.forest_layout_expandhorizontal );
    // /*interactive tree with color by cluster, no autosize, interactive, and callbacks */
    this.tree_readonly_interactive_withcallbacks = new SitoTree('tree_readonly_interactive_withcallbacks', {readOnly: false, nodeCreation : true, nodeAppend : true}, clonedProps0, false); 
    // /*interactive tree but initialized with json data*/
    this.tree_interactive_anddataviajson = new SitoTree('tree_interactive_anddataviajson', {readOnly: false, nodeCreation : true, nodeAppend : true},  this.node_rendering_props1, false);
   }
  ngAfterViewInit(): void {
   
    /*To simulate loading from server we use a little bit of dirty callback nesting
    (I could have used pipes I know) */
    setTimeout(()=>{
     ;
      /*loading data for some trees*/
      this.tree_readonly_colorbystate_autosize.loadData(this.mockedData1, this.treeSchemaForMockedData,true);
      this.tree_readonly_multiplefathers.loadData(this.mockedDataMultipleFathers, this.treeSchemaForMockedData,true);
      this.tree_readonly_multiplefathers.expandAll();
      this.tree_readonly_expandverticallayout.loadData(this.mockedDataMultipleFathers, this.treeSchemaForMockedData,true);
      this.tree_readonly_expandverticallayout.expandAll();
      this.tree_readonly_expandhorizontallayout.loadData(this.mockedDataMultipleFathers, this.treeSchemaForMockedData,true);
      this.tree_readonly_expandhorizontallayout.expandAll();
      this.tree_interactive_anddataviajson.loadData(this.mockedData1, this.treeSchemaForMockedData,true);

      
      
    },3000);


     //adding a callback to highlight when node clicked
     this.tree_interactiveClustercolorsNoautosize.addCallback("nodeClicked",this.callbackOnNodeClick);

    

    /*registering the callbacks on one tree */
    /*for a list of available callbacks (and what parameters to expect as input ) checkout the git readme out */
    this.tree_readonly_interactive_withcallbacks.addCallback(
          "doubleClick_end", 
          (tree,node) =>{
            try
            {
              console.log("CALLBACK >>>Double click on node : "+node.id);
            }catch(e){}

            
          }
    );

    this.tree_readonly_interactive_withcallbacks.addCallback("edgeClicked",(evt, tree, sketch, verticesEdge) => {
      try
      {
        console.log("clicked on edge from two nodes, first : "+verticesEdge[0].label+" and second : "+verticesEdge[1].label);
        evt.stopPropagation();
      }catch(e){}
     
    });


    //adding a callback to highlight when node clicked
    this.tree_readonly_interactive_withcallbacks.addCallback("nodeClicked",this.callbackOnNodeClick);

    //nb : always catch exception in callback, or check what parameters are available
    this.tree_readonly_interactive_withcallbacks.addCallback(
      "createNode_start", 
      (tree,xpos, ypos, label, id, status) =>{
        try
        {
          console.log("CALLBACK >>>New node creation : "+id+ " in x: "+xpos+" and y: "+ypos);
        }catch(e){}
       
      }
    );

    
    this.tree_readonly_interactive_withcallbacks.addCallback(
      "appendNodeTo_end", 
      (tree,source,target) =>{
        try
        {
          console.log("CALLBACK >>>Node append : appending "+source.id+ " to "+target.id);
        }catch(e){}
        
      }
    );


    /*and callbacks on the other tree, for refresh of exported data on interaction */
    
     //nb : always catch exception in callback, or check what parameters are available
     this.tree_interactive_anddataviajson.addCallback(
      "createNode_start", 
      (tree,xpos, ypos, label, id, status) =>{
        try
        {
          let dataForTree  = tree.exportData(this.treeSchemaForMockedData);
          this.exportedData_jsonPretty = this.prittifyJson(dataForTree);
        }catch(e){}
       
      }
    );

    
    this.tree_interactive_anddataviajson.addCallback(
      "appendNodeTo_end", 
      (tree,source,target) =>{
        try
        {
          let dataForTree  = tree.exportData(this.treeSchemaForMockedData);
          this.exportedData_jsonPretty = this.prittifyJson(dataForTree);
        }catch(e){}
        
      }
    );


  }


 

  
    //mocked data   
  /*the data must be nested. Then it can have different properties, the schema will map them */
  public mockedData1 = [
    
    {  
      status: "CREATED", fooId: "1", children:
        [
          {  
            status: "CREATED", fooId: "2", children: 
              [
                {  
                  status: "CREATED", fooId: "3", children:
                    [
                      { status: "COMPLETED_SUCCESS", fooId: "4" },  
                      { status: "COMPLETED_ERROR", fooId: "5" }  
                    ]
                }
              ]
          }
        ]
    },
    { //2nd root (lvl 0)  , path A1
      status: "RUNNING", fooId: "6", children:
        [
          { status: "COMPLETED_SUCCESS", fooId: "7" },  
          {                                                   
            status: "STOPPED", fooId: "8", children:
              [             
                {                                                
                  status: "STOPPED", fooId: "9", children:
                    [
                      { status: "COMPLETED_SUCCESS", fooId: "10" },  
                      { status: "COMPLETED_ERROR", fooId: "11" }  
                    ]
                } 
              ]
          }
        ]
    }
  ];


  private callbackOnNodeClick = (evt, tree, sketch, node) => {

    //simulating click on row on the ro
    let _nodeId = node.id;
    tree.removeAllhightlits();
    tree.highlightNode(_nodeId, "#479ff5");
    
  }

  public expandAllTree()
  {
    this.tree_readonly_colorbystate_autosize.expandAll();
  }

  public collapseAllTree()
  {
    this.tree_readonly_colorbystate_autosize.collapseAll();
  }


  public updateDataForTree()
  {
    setTimeout(()=>{
        
       
      this.tree_readonly_colorbystate_autosize.loadData(this.mockedData1_differentstatus, this.treeSchemaForMockedData,false);
      
    },1000);
  }
  /*same structures but different status, to show how the tree update the internal status for each node /color */
  public mockedData1_differentstatus = [
    
    {  
      status: "COMPLETED_SUCCESS", fooId: "1", children:
        [
          {  
            status: "COMPLETED_SUCCESS", fooId: "2", children: 
              [
                {  
                  status: "COMPLETED_SUCCESS", fooId: "3", children:
                    [
                      { status: "COMPLETED_SUCCESS", fooId: "4" },  
                      { status: "COMPLETED_ERROR", fooId: "5" }  
                    ]
                }
              ]
          }
        ]
    },
    { //2nd root (lvl 0)  , path A1
      status: "COMPLETED_SUCCESS", fooId: "6", children:
        [
          { status: "COMPLETED_SUCCESS", fooId: "7" },  
          {                                                   
            status: "RUNNING", fooId: "8", children:
              [             
                {                                                
                  status: "COMPLETED_ERROR", fooId: "9", children:
                    [
                      { status: "COMPLETED_SUCCESS", fooId: "10" },  
                      { status: "COMPLETED_ERROR", fooId: "11" }  
                    ]
                } 
              ]
          }
        ]
    }
  ];


  //multiple fathers for the same node (a node is present on multiple paths)
  public mockedDataMultipleFathers = [
    
    {  
      status: "COMPLETED_SUCCESS", fooId: "1", children:
        [
          {  
            status: "COMPLETED_SUCCESS", fooId: "2", children: 
              [
                {  
                  status: "COMPLETED_SUCCESS", fooId: "3", children:
                    [
                      { status: "COMPLETED_SUCCESS", fooId: "4" },  
                      { status: "COMPLETED_ERROR", fooId: "5" ,
                        children : 
                        [
                          { status: "COMPLETED_SUCCESS", fooId: "10" }
                        ]
                      }  
                    ]
                }
              ]
          }
        ]
    },
    { //2nd root (lvl 0)  , path A1
      status: "COMPLETED_SUCCESS", fooId: "6", children:
        [
          { status: "COMPLETED_SUCCESS", fooId: "4" },  
          { status: "COMPLETED_SUCCESS", fooId: "7" },  
          {                                                   
            status: "RUNNING", fooId: "8", children:
              [             
                {                                                
                  status: "COMPLETED_ERROR", fooId: "9", children:
                    [
                      { status: "COMPLETED_SUCCESS", fooId: "10" },  
                      { status: "COMPLETED_ERROR", fooId: "11" }  
                    ]
                } 
              ]
          }
        ]
    }

  ];


  //different nodes
  public mockedData3 = [
    
    { //1 root node (lvl 0) , path A
      status: "COMPLETED_SUCCESS", fooId: "2sd", children:
        [
          { // 1 child (lvl1), path A->B
            status: "RUNNING", fooId: "dax", children: 
              [
                { //1 child (lvl2) , path A-B-C
                  status: "RUNNING", fooId: "111"   
                }
              ]
          }
        ]
    },
    { //2nd root (lvl 0)  , path A1
      status: "COMPLETED_SUCCESS", fooId: "aaa", children:
        [
          { status: "COMPLETED_SUCCESS", fooId: "kdj" }, //1 child (lvl1) , path A1->B1
          { status: "COMPLETED_SUCCESS", fooId: "kdj" }, //2 child (lvl1), path A1->C1
          {                                                  //3 child (lvl1) , path A1->D1
            status: "COMPLETED_ERROR", fooId: "bbb", children:
              [             
                {                                               //1 child (lvl2) , path A1->D1->E1
                  status: "CREATED", fooId: "ccc", children:
                    [
                      { status: "COMPLETED_SUCCESS", fooId: "ddd" }, //1 child (lvl3), path A1->D1->E1->F1
                      { status: "COMPLETED_SUCCESS", fooId: "eee" } //2 child (lvl3), path A1->D1->E1->G1
                    ]
                },
                {                                             //2 child (lvl2) path A1->D1->H1
                  status: "CREATED", fooId: "ccc", children:
                    [
                      { status: "COMPLETED_SUCCESS", fooId: "ddd" }, //1 child (lvl 3), path A1->D1->H1->I1
                      { status: "COMPLETED_ERROR", fooId: "eee" } //2 child (lvl 4), path A1->D1->H1->L1
                    ]
                }
              ]
          }
        ]
    }
  ];

 

  prittifyJson(json) {
    if (typeof json != 'string') {
      json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return '<pre >' + json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      var cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span  class="' + cls + '" >' + match + '</span>';
    }) + '</pre>';
  }


}

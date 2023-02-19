import { Component, OnInit } from '@angular/core';
////import { SitoTree } from './sito_tree/sito_tree.class';
//import { SitoTreeNodeSchema } from './sito_tree/sito_treenodeschema';
import {SitoTree} from 'sito-tree/dist'
import {SitoTreeNodeSchema} from 'sito-tree/dist'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

 
  paletteForClusterColor = ["#048ba8","#5f0f40","#1b998b","#9a031e","#30638e","#fb8b24","#e36414","#1982c4","#0f4c5c","#d100d1","#31572c","#fbff12","#132a13","#ffd6ff","#2dc653","#ead2ac","#208b3a","#fdc500","#ffff3f","#ff0a54","#f3722c","#43aa8b","#660708","#6a00f4","#8ac926","#415a77"];
  palettesForStateColor = {
    "COMPLETED_SUCCESS": "#00ff00",
    "STOPPED": "#e95a13",
    "RUNNING": "#479ff5",
    "CREATED": "#bfbfbf",
    "COMPLETED_ERROR": "#ff3333",
    "SCHEDULED": "#bfbfbf"
  };

  //mocked data 

  tree_interactiveClustercolorsNoautosize: SitoTree;

  tree_interactiveClustercolorsAutosize:SitoTree;
  
  tree_readOnlyStateColorsAutosize:SitoTree;

  ngOnInit() {
    console.log("ngOnInit");
    this.tree_interactiveClustercolorsNoautosize = new SitoTree('tree_interactive_clustercolors_noautosize', false, this.paletteForClusterColor, null, false);
    this.tree_interactiveClustercolorsAutosize = new SitoTree('tree_interactive_clustercolors_autosize', false, this.paletteForClusterColor, null, true);
    this.tree_readOnlyStateColorsAutosize = new SitoTree('tree_readonly_colorbystate_autosize', true, null, this.palettesForStateColor, true);

   }
  ngAfterViewInit(): void {
   
    setTimeout(()=>{
      console.log("tree generation from data");
      this.tree_readOnlyStateColorsAutosize.createNewTreeFromData(this.mockedData, this.treeSchemaForMockedData,true);
      let paths = this.tree_readOnlyStateColorsAutosize.getAllTreePaths( );
      let dataPaths = SitoTree.getAllDataPaths(this.mockedData, this.treeSchemaForMockedData);
      console.log("tree paths>>>>>>>>>>");
      for(let i in paths)
      {
        console.log(paths[i]);
      }
      console.log("data paths>>>>>>>>>>>>");
      for(let i in dataPaths)
      {
        console.log(dataPaths[i]);
      }
      console.log("Tree comparison (0 equals, 1 only status difference, 2 new set of nodes) : "+SitoTree.compareDataPathsAndTreePath(this.mockedData,this.tree_readOnlyStateColorsAutosize, this.treeSchemaForMockedData));
      //we compare the tree with new data, same nodes but different status
      console.log("Tree comparison (0 equals, 1 only status difference, 2 new set of nodes) : "+SitoTree.compareDataPathsAndTreePath(this.mockedData2,this.tree_readOnlyStateColorsAutosize, this.treeSchemaForMockedData));
       //we compare the tree with new data, new nodes
      console.log("Tree comparison (0 equals, 1 only status difference, 2 new set of nodes) : "+SitoTree.compareDataPathsAndTreePath(this.mockedData3,this.tree_readOnlyStateColorsAutosize, this.treeSchemaForMockedData));
      
     
      //CALLBACK HELL, just to debug/test , who cares
      setTimeout(()=>{
        //update only with status
        this.tree_readOnlyStateColorsAutosize.updateTreeWithData(this.mockedData2,this.treeSchemaForMockedData,true);

        setTimeout( () =>{
           //now we really update, this will recreate the tree because the nodes are different
          this.tree_readOnlyStateColorsAutosize.updateTreeWithData(this.mockedData,this.treeSchemaForMockedData,true);
        },16000);

      },6000);
     
    },3000);
    

  }


  public treeSchemaForMockedData: SitoTreeNodeSchema = {
    statusproperty: "status",
    idproperty: "taskId",
    childrenproperty: "children",
    textproperty: "taskId",
  };
  

  public mockedData = [
    
    { //1 root node (lvl 0) , path A
      status: "COMPLETED_SUCCESS", taskId: "...2sd", children:
        [
          { // 1 child (lvl1), path A->B
            status: "RUNNING", taskId: "...dax", children: 
              [
                { //1 child (lvl2) , path A-B-C
                  status: "CREATED", taskId: "...111", children:
                    [
                      { status: "COMPLETED_SUCCESS", taskId: "...kdj" }, //1 child (lvl3), path A->B->C->D
                      { status: "COMPLETED_ERROR", taskId: "...dfs" } //2 child (lvl3), path A->B->C->E
                    ]
                }
              ]
          }
        ]
    },
    { //2nd root (lvl 0)  , path A1
      status: "COMPLETED_SUCCESS", taskId: "...aaa", children:
        [
          { status: "COMPLETED_SUCCESS", taskId: "...kdj" }, //1 child (lvl1) , path A1->B1
          { status: "COMPLETED_SUCCESS", taskId: "...kdj" }, //2 child (lvl1), path A1->C1
          {                                                  //3 child (lvl1) , path A1->D1
            status: "RUNNING", taskId: "...bbb", children:
              [             
                {                                               //1 child (lvl2) , path A1->D1->E1
                  status: "CREATED", taskId: "...ccc", children:
                    [
                      { status: "COMPLETED_SUCCESS", taskId: "...ddd" }, //1 child (lvl3), path A1->D1->E1->F1
                      { status: "COMPLETED_ERROR", taskId: "...eee" } //2 child (lvl3), path A1->D1->E1->G1
                    ]
                },
                {                                             //2 child (lvl2) path A1->D1->H1
                  status: "CREATED", taskId: "...ccc", children:
                    [
                      { status: "COMPLETED_SUCCESS", taskId: "...ddd" }, //1 child (lvl 3), path A1->D1->H1->I1
                      { status: "COMPLETED_ERROR", taskId: "...eee" } //2 child (lvl 4), path A1->D1->H1->L1
                    ]
                }
              ]
          }
        ]
    }
  ];

  //same nodes as mockedData, but different status
  public mockedData2 = [
    
    { //1 root node (lvl 0) , path A
      status: "RUNNING", taskId: "...2sd", children:
        [
          { // 1 child (lvl1), path A->B
            status: "RUNNING", taskId: "...dax", children: 
              [
                { //1 child (lvl2) , path A-B-C
                  status: "RUNNING", taskId: "...111", children:
                    [
                      { status: "RUNNING", taskId: "...kdj" }, //1 child (lvl3), path A->B->C->D
                      { status: "COMPLETED_ERROR", taskId: "...dfs" } //2 child (lvl3), path A->B->C->E
                    ]
                }
              ]
          }
        ]
    },
    { //2nd root (lvl 0)  , path A1
      status: "RUNNING", taskId: "...aaa", children:
        [
          { status: "RUNNING", taskId: "...kdj" }, //1 child (lvl1) , path A1->B1
          { status: "RUNNING", taskId: "...kdj" }, //2 child (lvl1), path A1->C1
          {                                                  //3 child (lvl1) , path A1->D1
            status: "RUNNING", taskId: "...bbb", children:
              [             
                {                                               //1 child (lvl2) , path A1->D1->E1
                  status: "RUNNING", taskId: "...ccc", children:
                    [
                      { status: "COMPLETED_SUCCESS", taskId: "...ddd" }, //1 child (lvl3), path A1->D1->E1->F1
                      { status: "COMPLETED_SUCCESS", taskId: "...eee" } //2 child (lvl3), path A1->D1->E1->G1
                    ]
                },
                {                                             //2 child (lvl2) path A1->D1->H1
                  status: "CREATED", taskId: "...ccc", children:
                    [
                      { status: "COMPLETED_SUCCESS", taskId: "...ddd" }, //1 child (lvl 3), path A1->D1->H1->I1
                      { status: "COMPLETED_ERROR", taskId: "...eee" } //2 child (lvl 4), path A1->D1->H1->L1
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
      status: "COMPLETED_SUCCESS", taskId: "...2sd", children:
        [
          { // 1 child (lvl1), path A->B
            status: "RUNNING", taskId: "...dax", children: 
              [
                { //1 child (lvl2) , path A-B-C
                  status: "RUNNING", taskId: "...111"   
                }
              ]
          }
        ]
    },
    { //2nd root (lvl 0)  , path A1
      status: "COMPLETED_SUCCESS", taskId: "...aaa", children:
        [
          { status: "COMPLETED_SUCCESS", taskId: "...kdj" }, //1 child (lvl1) , path A1->B1
          { status: "COMPLETED_SUCCESS", taskId: "...kdj" }, //2 child (lvl1), path A1->C1
          {                                                  //3 child (lvl1) , path A1->D1
            status: "COMPLETED_ERROR", taskId: "...bbb", children:
              [             
                {                                               //1 child (lvl2) , path A1->D1->E1
                  status: "CREATED", taskId: "...ccc", children:
                    [
                      { status: "COMPLETED_SUCCESS", taskId: "...ddd" }, //1 child (lvl3), path A1->D1->E1->F1
                      { status: "COMPLETED_SUCCESS", taskId: "...eee" } //2 child (lvl3), path A1->D1->E1->G1
                    ]
                },
                {                                             //2 child (lvl2) path A1->D1->H1
                  status: "CREATED", taskId: "...ccc", children:
                    [
                      { status: "COMPLETED_SUCCESS", taskId: "...ddd" }, //1 child (lvl 3), path A1->D1->H1->I1
                      { status: "COMPLETED_ERROR", taskId: "...eee" } //2 child (lvl 4), path A1->D1->H1->L1
                    ]
                }
              ]
          }
        ]
    }
  ];

 




}

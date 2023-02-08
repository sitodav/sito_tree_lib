import { Component, OnInit } from '@angular/core';
////import { SitoTree } from './sito_tree/sito_tree.class';
//import { SitoTreeNodeSchema } from './sito_tree/sito_treenodeschema';
import {SitoTree} from 'sito-tree-lib/dist'
import {SitoTreeNodeSchema} from 'sito-tree-lib/dist'

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
      this.tree_readOnlyStateColorsAutosize.generateTreesFromData(this.mockedData, this.treeSchemaForMockedData);
    },3000);
    

  }


  public treeSchemaForMockedData: SitoTreeNodeSchema = {
    statusproperty: "status",
    idproperty: "taskId",
    childrenproperty: "children",
    textproperty: "taskId",
  };
  

  public mockedData = [
    {
      status: "COMPLETED_SUCCESS", taskId: "...2sd", children:
        [
          {
            status: "RUNNING", taskId: "...dax", children:
              [
                {
                  status: "CREATED", taskId: "...111", children:
                    [
                      { status: "COMPLETED_SUCCESS", taskId: "...kdj" },
                      { status: "COMPLETED_ERROR", taskId: "...dfs" }
                    ]
                }
              ]
          }
        ]
    },
    {
      status: "COMPLETED_SUCCESS", taskId: "...aaa", children:
        [
          { status: "COMPLETED_SUCCESS", taskId: "...kdj" },
          { status: "COMPLETED_SUCCESS", taskId: "...kdj" },
          {
            status: "RUNNING", taskId: "...bbb", children:
              [
                {
                  status: "CREATED", taskId: "...ccc", children:
                    [
                      { status: "COMPLETED_SUCCESS", taskId: "...ddd" },
                      { status: "COMPLETED_ERROR", taskId: "...eee" }
                    ]
                },
                {
                  status: "CREATED", taskId: "...ccc", children:
                    [
                      { status: "COMPLETED_SUCCESS", taskId: "...ddd" },
                      { status: "COMPLETED_ERROR", taskId: "...eee" }
                    ]
                }
              ]
          }
        ]
    }
  ];

 




}

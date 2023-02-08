 
import * as p5 from "p5";
import { SitoTreeNode } from "./sito_treenode.class";
import { SitoTreeNodeSchema } from "./sito_treenodeschema";

/*
author: sitodav@gmail.com
*/
export class SitoTree {

    p5wrapper: p5;
    roots: SitoTreeNode[] = [];
    draggedNode = null;
    lastClick = 0;
    isDoubleClicked = false;
    nativeP5SketchRef = undefined;
    canvasWidth: number;
    canvasHeight: number;

    /*If using colorByClusterPalettes , we want a single color, and this will be 
    passend to the childs of the cluster 
    /*Otherwise if we use colorByStateMap we want a map STATE:color 
    and the color of a node will change according to the internal node state, instead of via inheritance of father's color */

    constructor(public containerDivId,public readOnly: boolean,
        public colorByClusterPalettes, public colorByStateMap, public sizeBasedOnNumChildren :boolean) {

        this.p5wrapper = new p5(this.sketchDefinitionFunction);
    }





    

    




    /***********************************                                                           ************************************
    ************************************                                                           ************************************
    ----------------------------------------------           Tree Api methods           -----------------------------------------------
    ************************************                                                           ************************************
    ************************************                                                           ************************************/

    //this takes in input a list of objects (to be mapped into nodes)
    //that are roots. Every roots has a reference property that contains
    //a list of children, in a recursive manner (composite/tree like pattern)
    //every node must be uniquely identifiable
    //the schema must provide info about this properties
    //for example
    /*

    //this is the raw BE data
    let data = [
      {
        status : "COMPLETED_SUCCESS", taskId : "12314142sd", children:
        [
          {status : "RUNNING", taskId : "1234444111asddddax", children:
          [
            {status:"CREATED", taskId : "aaa111111", children : 
            [
              { status : "COMPLETED_SUCCESS", taskId : "1iiskdkdj"},
              { status : "COMPLETED_ERROR", taskId : "gbbbsdfs"}
            ]}
          ]}
        ]
      }
    ];

    //this tells the tree how to use the data for the node generation
    let nodeschema : SitoTreeNodeSchema = {
      statusproperty : "status",
      idproperty : "taskId",
      childrenproperty : "children",
      textproperty : "taskId",
    };
    */
    generateTreesFromData(data: any, nodeschema: SitoTreeNodeSchema) {
        
        let newroots = [];
        console.log("generating from data for "+this.containerDivId);
        //for every outer object in the data list we will have roots
        for (let i in data) {
            //create the node
            let idfornode = data[i][nodeschema.idproperty];
            let labelfornode = data[i][nodeschema.textproperty];
            let nodestatus = data[i][nodeschema.statusproperty];
            //roots are created on the left, and the vertical allign is based on the index
            let rootnode = this.createNewNode(100, 100 + parseInt(i) * 200, labelfornode, idfornode, nodestatus)
            //save the root node
            newroots.push(rootnode);
            //check recursively on children
            if (data[i][nodeschema.childrenproperty] &&
                data[i][nodeschema.childrenproperty].length > 0) {
                //link the children to father
                let childrendatas = data[i][nodeschema.childrenproperty];
                for (let j in childrendatas) {
                    let children = this.recursiveNodeGeneration(rootnode, childrendatas[j], nodeschema);
                    this.appendNodeTo(children, rootnode);
                }

            }
        }
        this.roots = newroots;
        //native drawing (we trigger the sketch updates)
        this.restoreRoots(); //this is used just to update cluster colors (if we are using cluster color)
        this.updateRays();
        this.reorderChilds();
        this.nativeP5SketchRef.loop(1);
    }


    
    //this simply create a new node and returns it,
    //the new node will be alone, so a single root, with no children and no father
    createNewNode(xpos, ypos, label, id, status) {
        let newRoot = SitoTreeNode._builder(
            this.nativeP5SketchRef.createVector(xpos, ypos),
            50,
            label,
            id,
            this.nativeP5SketchRef,
            this.colorByClusterPalettes ? this.nativeP5SketchRef.random(this.colorByClusterPalettes) : undefined,
            this.colorByStateMap ? this.colorByStateMap : undefined,
            status,
            this.sizeBasedOnNumChildren);


        newRoot.isRoot = true;

        this.roots.push(newRoot);


        if (null != this.draggedNode) {
            this.draggedNode.isDragged = false;
            this.draggedNode = null;
        }
        this.restoreRoots();
        this.nativeP5SketchRef.loop(1);

        return newRoot;
    }

    //merges two nodes
    //source (the node to append)
    //target (where to append)
   
    appendNodeTo(source: any, target: any ) {
 
        source.isRoot = false;
        let oldfatherDragged = source.father;
        source.father = target;
        source.myColor = target.myColor;
        target.children.push(source);
        source.orderInfather = target.children.length - 1;
        if (null != oldfatherDragged) {
            this.removeById(source.id, oldfatherDragged.children);
        }
        if (target.father != null)
            target.father._applyChildStartPos();
        else target._applyChildStartPos();

        return target;



    }

    private recursiveNodeGeneration(father: any, childdata: any, nodeschema: SitoTreeNodeSchema) {
        let idfornode = childdata[nodeschema.idproperty];
        let labelfornode = childdata[nodeschema.textproperty];
        let nodestatus = childdata[nodeschema.statusproperty];
        //use the same vertical align of the father , and move orizontally
        let node = this.createNewNode(Math.random() * 500, father.goToCenter.x + 100, labelfornode, idfornode, nodestatus)

        //check recursively on children
        if (childdata[nodeschema.childrenproperty] &&
            childdata[nodeschema.childrenproperty].length > 0) {
            //link the children to father
            let childrendatas = childdata[nodeschema.childrenproperty];
            for (let j in childrendatas) {
                let children = this.recursiveNodeGeneration(node, childrendatas[j], nodeschema);
                this.appendNodeTo(children, node);
            }
        }

        return node;
    }





    /***********************************                                                           ************************************
    ************************************                                                           ************************************
    ------------------------------------------  P5js sketch utility methods and interactions  -----------------------------------------
    ************************************                                                           ************************************
    ************************************                                                           ************************************/

    isMouseInSketch(mouseX, mouseY, sketchRef): boolean {
        // console.log(mouseX,mouseY,sketchRef.width,sketchRef.height);
        return mouseX < sketchRef.width && mouseY < sketchRef.height;

    }

    expandAll = () => {
        for (let elm of this.roots) {
            if (!elm.expanded)
                this.triggerDoubleClick(elm.label, true);
        }
    }

    collapseAll = () => {
        for (let elm of this.roots) {
            if (elm.expanded)
                this.triggerDoubleClick(elm.label, true);
        }
    }




    customDoubleClick = ( ) => {

        for (let i in this.roots) {
            let found = this.roots[i]._checkMouseIn(this.nativeP5SketchRef.mouseX, this.nativeP5SketchRef.mouseY);
            if (null != found) {

                found.expanded = !found.expanded;

                if (found.expanded/* && found.justInitialized*/) {
                    found._applyChildStartPos();
                    //found.justInitialized = false;
                }

                return;
            }
        }
    }


    removeById = (id, els) => {
        console.log("removing by id");
        for (let i in els) {
            if (id == els[i].id) {
                els.splice(i, 1);
            }
        }
        //this.treeNodesService.notifyTreeNodesUpdate(els);
    }


    restoreRoots = () => {
        let newRoots = [];
        for (let i in this.roots) {
            if (this.roots[i].isRoot)
                newRoots.push(this.roots[i]);
            this.roots[i]._giveChildNewColor();
        }
        this.roots = newRoots;
        // this.treeNodesService.notifyTreeNodesUpdate(this.roots);
    }


    updateRays = () => {
        for (let i in this.roots) {
            this.roots[i]._updateRay();
        }
    }

    reorderChilds = () => {
        for (let i in this.roots) {
            this.roots[i]._reorderChilds();
        }
    }




    resetChildsFor = (label: string) => {

        let found = this.roots.find(elm => elm.label === label)
        if (null != found) {
            if (found.expanded) {
                found._applyChildStartPos();
            }

        }

    }


    triggerDoubleClick = (label: string, deep: boolean) => {

        let found = this.roots.find(elm => elm.label === label)
        if (null != found) {

            found.expanded = !found.expanded;
            if (deep && found.children != undefined && found.children.length > 0) {
                for (let child of found.children) {
                    this.deepExpansionRecursive(child)
                }
            }


        }

    }

    deepExpansionRecursive = (elm: SitoTreeNode) => {

        elm.expanded = true;
        //elm._applyChildStartPos();

        if (elm.children != undefined && elm.children.length > 0) {
            for (let child of elm.children) {
                this.deepExpansionRecursive(child)
            }
        }

    }

    static createPalette = (_url) => {
        let slash_index = _url.lastIndexOf('/');
        let pallate_str = _url.slice(slash_index + 1);
        let arr = pallate_str.split('-');
        for (let i = 0; i < arr.length; i++) {
            arr[i] = '#' + arr[i];
        }
        return arr;
    }


    /***********************************                                                           ************************************
    ************************************                                                           ************************************
    ---------------------------------------------- P5js sketch definition and functions -----------------------------------------------
    ************************************                                                           ************************************
    ************************************                                                           ************************************/


    public sketchDefinitionFunction = (_p5sketch) => {


        //p5js setup function
        _p5sketch.setup = () => {
            console.log("setup for "+this.containerDivId);
            this.canvasWidth = _p5sketch.windowWidth - 180;
            this.canvasHeight = _p5sketch.windowHeight - 200;
            let canvas2 = _p5sketch.createCanvas(this.canvasWidth, this.canvasHeight);
            canvas2.parent(this.containerDivId,); //questo lo aggancia al template angular  
            this.lastClick = _p5sketch.millis();

            _p5sketch.textSize(10);
            _p5sketch.textAlign(_p5sketch.CENTER, _p5sketch.CENTER);
            this.nativeP5SketchRef = _p5sketch;
        };



        //p5js draw function
        _p5sketch.draw = ( ) => {
            
            if (this.isDoubleClicked) {

                this.customDoubleClick();
                this.isDoubleClicked = false;
              
            }
            _p5sketch.background("#fffffff");
            for (let i in this.roots) {
                this.roots[i]._draw();
            }

        };

        //p5js other native functions
        _p5sketch.mouseMoved = () => {
            _p5sketch.loop();
        }


        _p5sketch.mouseStopped = () => {
            _p5sketch.noLoop();
        }


        //allowed only in readOnly == false mode
        _p5sketch.mouseClicked = (e) => {
          
            if (this.readOnly) //no new node creation allowed
                return;

            if (!this.isMouseInSketch(_p5sketch.mouseX, _p5sketch.mouseY, this.nativeP5SketchRef)) {
                return;
            }
            if (this.isDoubleClicked)
                return;

            //console.log("CLICKED");
            let amInExisting = false;
            for (let i in this.roots) {
                let found = this.roots[i]._checkMouseIn(_p5sketch.mouseX, _p5sketch.mouseY);
                amInExisting = found;
                if (found)
                    break;
            }

            if (amInExisting)
                return;


            /*NEW NODE CREATION ****************************************************************************************************************************/
            //creation where the user clicks
            let newRootId = "" + (_p5sketch.frameCount % 1000);
            let newRoot = SitoTreeNode._builder(
                _p5sketch.createVector(_p5sketch.mouseX, _p5sketch.mouseY),
                50,
                newRootId,
                newRootId,
                this.nativeP5SketchRef
                , this.colorByClusterPalettes ? this.nativeP5SketchRef.random(this.colorByClusterPalettes) : undefined,
                this.colorByStateMap ? this.colorByStateMap : undefined,
                "COMPLETED_SUCCESS",
                this.sizeBasedOnNumChildren);
            //this.createElementt(s.createVector(s.mouseX, s.mouseY), 35, "", "");
            newRoot.isRoot = true;

            this.roots.push(newRoot);


            if (null != this.draggedNode) {
                this.draggedNode.isDragged = false;
                this.draggedNode = null;
            }
            this.restoreRoots();
            _p5sketch.loop(1);
        }

        _p5sketch.mouseDragged = () => {
            if (this.isDoubleClicked)
                return;

            if (null != this.draggedNode) {
                this.draggedNode.center = _p5sketch.createVector(_p5sketch.mouseX, _p5sketch.mouseY);
                this.draggedNode.goToCenter = this.draggedNode.center.copy();
            }
            _p5sketch.loop(1);
        }


        _p5sketch.mousePressed = () => {

            let millisT = _p5sketch.millis(); //Math.floor(Date.now() / 1000);
            if (millisT - this.lastClick < 200)
                this.isDoubleClicked = true;
            else this.isDoubleClicked = false;

            this.lastClick = _p5sketch.millis();//Math.floor(Date.now() / 1000);

            if (this.isDoubleClicked)
                return;

            for (let i in this.roots) {
                let found = this.roots[i]._checkMouseIn(_p5sketch.mouseX, _p5sketch.mouseY);

                if (null != found) {

                    this.draggedNode = found;
                    found.isDragged = true;


                }
            }
            _p5sketch.loop(1);
        }

        /*when releasing a node on top of another, we merge them only if we are
        in readonly == false */
        _p5sketch.mouseReleased = () => {
            if (this.isDoubleClicked )
            {
               
                return;
            }

            if (null != this.draggedNode) {

                for (let j in this.roots) {
                    let root = this.roots[j];
                    let found = root._checkMouseIn(_p5sketch.mouseX, _p5sketch.mouseY);
                    if (null == found || found.isDragged)
                        continue;
                    let target = found;
                    if(!this.readOnly)
                        this.appendNodeTo(this.draggedNode, target);
                    break;
                }

                this.draggedNode.isDragged = false;
                this.draggedNode = null;
                this.restoreRoots();
                this.updateRays();
                this.reorderChilds();
                //printAll();
                _p5sketch.loop(1);

            }

        }


    }

}








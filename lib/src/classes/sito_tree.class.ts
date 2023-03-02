
import * as p5 from "p5";
import { SitoForestLayout } from "./sito_forest_layout";
import { SitoTreeNode } from "./sito_treenode.class";
import { SitoTreeNodeRendering } from "./sito_treenoderendering";
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
    hidden: boolean = false;
    addedCallback = {}
    alreadyEncounteredNodes: any = {};
    

    /*If using colorByClusterPalettes , we want a single color, and this will be 
    passend to the childs of the cluster 
    /*Otherwise if we use colorByStateMap we want a map STATE:color 
    and the color of a node will change according to the internal node state, instead of via inheritance of father's color */
    /*the forests layout are used to define how to distribute different roots for different trees */
    //horizontal layout feels a grid horizontally  (first row first column, first row secondo clumn until the rows is completed
    //to the max specified column number, then it start on the second row etc, keeping the specified row reserved space) giving a space to each root for a different tree
    //vertical layout fills first column first row, first column second row..untin the row is completed to the specified max , then it starts
    //with the following column, keeping a reserved space for each column
    //NB: forest layout make sense only for tree created for data, otherwise the node will be placed where the user click on the canvas!!
    constructor(public containerDivId, public allowedOperations, public node_rendering : SitoTreeNodeRendering,  
        public multipleFathers?: boolean,
        public layout?: SitoForestLayout) {

        this.p5wrapper = new p5(this.sketchDefinitionFunction);
    }






    /***********************************                                                           ************************************
    ************************************                                                           ************************************
    ----------------------------------------------           Tree Api methods           -----------------------------------------------
    Tree loading via json data works taking a composite data structure.
    The data must be a list, where every element will be a root.
    Every different root create a different tree.
    Every root data element must contains a children list with the nested children data.
    This will be mapped as trees.
    The input data can have arbitrary properties.
    To map this properties to the internal node properties, the node schema is used.
    The node schema tells the library how to map the data elements to the node.
    This allows agnostic loading / tree creation via json data.
    The opposite operation, that allows to export the tree as json, export a json list
    where every element in the list is a root data element.
    This is done ,again, using the provided node schema to kwow which node properties to map to the output json data.
    


    

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
   
    ************************************                                                           ************************************
    ************************************                                                           ************************************/




    /*Use data input, */
    public loadData(data: any, nodeschema: SitoTreeNodeSchema, debug: boolean) {

        if (this.addedCallback["loadData_start"]) {
            this.addedCallback["loadData_start"](this, nodeschema, data);
        }
        //data is empty, so we call the generateTreeFromData
        if (!this.roots || this.roots.length == 0) {
            if (debug) {
                console.log("no nodes, generating anew");
            }
            this.createNewNodesStructureFromDataLoading(data, nodeschema, debug);

            if (this.addedCallback["loadData_end"]) {
                this.addedCallback["loadData_end"](this, nodeschema, data);
            }

            return;
        }

        let comparison = SitoTree.compareDataPathsAndTreePath(data, this, nodeschema);
        if (comparison == 0) {
            if (debug)
                console.log("tree and data represent the same tree structure and status, nothing to do")

            if (this.addedCallback["loadData_end"]) {
                this.addedCallback["loadData_end"](this, nodeschema, data);
            }
            return; //nothing, the three doesn't have to be updated
        }
        else if (comparison == -1) {
            if (debug)
                console.log("tree and data represent different node. Need to generate anew from data");

            this.createNewNodesStructureFromDataLoading(data, nodeschema, debug); //full re-generation for tree (the data represents a new tree)
        }
        else {
            if (debug)
                console.log("Tree and data only different in status. Updating status on every node from data");

            if (this.roots) {
                for (let i in this.roots) {
                    SitoTree.recursiveNodeUpdateFromData(data[i], this.roots[i], nodeschema);
                }
            }

            if (this.addedCallback["loadData_end"]) {
                this.addedCallback["loadData_end"](this, nodeschema, data);
            }
            return;
        }

    }


    /*the forests layout are used to define how to distribute different roots for different trees */
    private createNewNodesStructureFromDataLoading(data: any, nodeschema: SitoTreeNodeSchema, debug: boolean) {
        this.alreadyEncounteredNodes = {};
        let newroots = [];
        if (debug)
            console.log("generating from data for " + this.containerDivId);
        //for every outer object in the data list we will have roots
        for (let i in data) {
            //create the node
            let idfornode = data[i][nodeschema.idproperty];
            let labelfornode = data[i][nodeschema.textproperty];
            let nodestatus = data[i][nodeschema.statusproperty];
            let dataobject;
            if(data[i][nodeschema.dataobject])
            {
                dataobject = JSON.parse(data[i][nodeschema.dataobject]);
            }
            
            /*If horizontal layout is given it will try to dispose horizontally,
            otherwise it will use vertical layout if given
            otherwise it will just set them at start of window going down*/
            let xPos = 0;
            let yPos = 0;
            if (this.layout) {
                if (this.layout)
                    if (!this.layout.orientation || this.layout.orientation == "FILLFIXEDHORIZONTAL_EXPANDVERTICAL") {//fixed num of columns, fill every rows horizontally until the max num of columns, then expand vertically on a new row


                        let hIndex = (this.strip(i)) % this.strip(this.layout.maxNumOfColumns);
                        xPos = this.layout.paddingLeft + hIndex * this.layout.horizontalReservedSpaceForTree;
                        xPos = xPos + 0.5 * this.layout.horizontalReservedSpaceForTree; //we center it in the reserved space horizontally
                        let vIndex = parseInt("" + this.strip(i) / this.strip(this.layout.maxNumOfColumns));
                        yPos = this.layout.paddingTop + vIndex * this.layout.verticalReservedSpaceForTree;
                        yPos = yPos + 0.5 * this.layout.verticalReservedSpaceForTree;
                    }
                    else if (this.layout.orientation == "FILLFIXEDVERTICAL_EXPANDHORIZONTAL") {//fixed number of rows, fill every column until max num of rows, then expand on a new column


                        let vIndex = this.strip(i) % this.strip(this.layout.maxNumberOfRows);
                        yPos = this.layout.paddingTop + vIndex * this.layout.verticalReservedSpaceForTree;
                        yPos = yPos + 0.5 * this.layout.verticalReservedSpaceForTree; //we center it in the reserved space vertically
                        let hIndex = parseInt("" + this.strip(i) / this.strip(this.layout.maxNumberOfRows));
                        xPos = this.layout.paddingLeft + hIndex * this.layout.horizontalReservedSpaceForTree;
                        xPos = xPos + 0.5 * this.layout.horizontalReservedSpaceForTree;
                    }

            }
            else {
                xPos = 100;
                yPos = 100 + parseInt(i) * 200;
            }
            //roots are created on the left, and the vertical allign is based on the index
            let rootnode = this.createNewNode(xPos, yPos, labelfornode, idfornode, nodestatus,dataobject)
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

    //to avoid rounding error on index
    private strip(number: any): any {
        return (parseFloat(number).toPrecision(12));
    }



    //this can be called only if we are sure the structures of data and nodes are the same
    private static recursiveNodeUpdateFromData(data_element, node: SitoTreeNode, nodeschema: SitoTreeNodeSchema) {

        node.status = data_element[nodeschema.statusproperty];

        if (node.children && node.children.length > 0) //no children, I am leaf, path completed
        {
            for (let ichild in node.children) {
                let childrenTreeNode = node.children[ichild];
                let childrenDataNode = data_element[nodeschema.childrenproperty][ichild];
                this.recursiveNodeUpdateFromData(childrenDataNode, childrenTreeNode, nodeschema);

            }
        }



    }


    /*
    returns 0 if equals
    returns -1 if completely different in structure
    returns 1 if same structure but different status
    */

    private static compareDataPathsAndTreePath(datas, tree: SitoTree, treenodeschema: SitoTreeNodeSchema): number {
        let result = 0;
        let treepaths = tree.getAllTreePaths();
        let dataPaths = SitoTree.getAllDataPaths(datas, treenodeschema);
        //comparing
        if ((!treepaths && !dataPaths) || (treepaths.length == 0 && dataPaths.length == 0))
            result = 0;
        else if (treepaths.length != dataPaths.length) {
            result = -1;
        }
        else {
            let different = false;
            for (let i in treepaths) {
                if (treepaths[i] != dataPaths[i]) {
                    different = true;
                    break;
                }
            }
            if (!different)
                result = 0;
            else {
                different = false;
                for (let i in treepaths) {
                    if (treepaths[i].replaceAll(/\[(.*?)\]/g, "?") != dataPaths[i].replaceAll(/\[(.*?)\]/g, "?")) {
                        different = true;
                        break;
                    }
                }
                if (!different)
                    result = 1;
                else
                    result = -1;
            }
        }
        return result;
    }

    /*Method used to get a snapshot for the internal structure.
  So the tree knows when it only has to update the nodes status, or must recreate the structure because
  the input data requires new nodes 
  */


    private getAllTreePaths(): string[] {
        let paths = [];

        if (this.roots) {
            for (let ir in this.roots) {
                let rootsPaths = this.dfs_visitAllTreePaths(this.roots[ir], "");
                for (let ip in rootsPaths) {
                    paths.push(rootsPaths[ip]);
                }

            }
        }

        return paths;
    }

    /*depth first search visit 
    returns all the paths in the form
    [
        NODE_ID[STATUS]->NODE_ID[STATUS]->NODE_ID[STATUS],
        NODE_ID[STATUS]->NODE_ID[STATUS]->NODE_ID[STATUS],
        NODE_ID[STATUS]->NODE_ID[STATUS]->NODE_ID[STATUS],
    ]
    */
    private dfs_visitAllTreePaths(node: SitoTreeNode, pathToMyFather: string): string[] {
        let mySubPaths = [];

        let pathToMe = pathToMyFather + "->" + node.id + "[" + node.status + "]";
        if (!node.children || node.children.length == 0) //no children, I am leaf, path completed
        {
            mySubPaths.push(pathToMe);
        }
        else //otherwise i have children, so my subpath will only be my path + children continuation until leaves
        {
            for (let ichild in node.children) {
                let children = node.children[ichild];

                let childrenpaths = this.dfs_visitAllTreePaths(children, pathToMe);
                for (let kcp in childrenpaths) {
                    mySubPaths.push(childrenpaths[kcp]);
                }
            }
        }

        return mySubPaths;
    }


    /*Same methods of two previous, but for data */
    private static getAllDataPaths(data, treenodeschema: SitoTreeNodeSchema): string[] {
        let paths = [];

        if (data) {
            for (let ir in data) {
                let rootsPaths = SitoTree.dfs_visitAllDataPaths(treenodeschema, data[ir], "");
                for (let ip in rootsPaths) {
                    paths.push(rootsPaths[ip]);
                }

            }
        }

        return paths;
    }


    private static dfs_visitAllDataPaths(treenodeschema: SitoTreeNodeSchema, data_elm: SitoTreeNode, pathToMyFather: string): string[] {
        let mySubPaths = [];

        let pathToMe = pathToMyFather + "->" + data_elm[treenodeschema.idproperty] + "[" + data_elm[treenodeschema.statusproperty] + "]";
        if (!data_elm[treenodeschema.childrenproperty] || data_elm[treenodeschema.childrenproperty].length == 0) //no children, I am leaf, path completed
        {
            mySubPaths.push(pathToMe);
        }
        else //otherwise i have children, so my subpath will only be my path + children continuation until leaves
        {
            for (let ichild in data_elm[treenodeschema.childrenproperty]) {
                let children = data_elm[treenodeschema.childrenproperty][ichild];

                let childrenpaths = this.dfs_visitAllDataPaths(treenodeschema, children, pathToMe);
                for (let kcp in childrenpaths) {
                    mySubPaths.push(childrenpaths[kcp]);
                }
            }
        }

        return mySubPaths;
    }



    /*Export data : use the internal tree/nodes structures to map to a json, using the schema
    to export the node property */
    public exportData(nodeschema) {
        let data = [];

        if (!this.roots || this.roots.length == 0)
            return data;

        for (let i in this.roots) {

            /*root node to root data element */
            let rootDataElm = this.createDataElementFromNode(this.roots[i],nodeschema);
            data.push(rootDataElm);
        }

        return data;
    }

    private createDataElementFromNode(node : SitoTreeNode, nodeschema :SitoTreeNodeSchema )
    {   
        let dataelem = {};
        try
        {
            dataelem[nodeschema.textproperty] = node.label;
            dataelem[nodeschema.idproperty] = node.id;
            dataelem[nodeschema.statusproperty] = node.status;
            if(nodeschema.fathersproperty)
            {
                dataelem[nodeschema.fathersproperty] = node.fathers;
            }
            if(nodeschema.dataobject)
            {
                dataelem[nodeschema.dataobject] = JSON.stringify( node.dataobject );
            }
            

            if(node.children)
            {
                dataelem[nodeschema.childrenproperty] = [];
                for(let i in node.children)
                {
                    let childrendataelm = this.createDataElementFromNode(node.children[i],nodeschema);
                    dataelem[nodeschema.childrenproperty].push(childrendataelm);
                }
            }
 

        }
        catch(e){}
        return dataelem;
    }

    


    /*available callback are :
       loadData_start : function input (tree,nodeschema,data),
       loadData_end : function input (tree,nodeschema,data),
       createNode_start : function input (tree,xpos, ypos, label, id, status),
       createNode_end : function input (tree,newRoot),
       deleteNode_start : function input (tree,id)
       deleteNode_end : function input (tree, deleted[])
       appendNodeTo_start : function input (tree,source,target),
       appendNodeTo_end : function input (tree,source,target),
       expandAll_start : function input (tree ),
       expandAll_end : function input (tree ),
       collapseAll_start : function input (tree ),
       collapseAll_end : function input (tree ),
       doubleClick_start : function input (tree,node),
       doubleClick_end : function input (tree,node),
       setup_start : function input (tree,p5sketch),
       setup_end : function input (tree,p5sketch),
       draw_start : function input (tree,p5sketch),
       draw_start : function input (tree,p5sketch),
       mouseMoved_start : function input (evt,tree,p5sketch),
       mouseMoved_end : function input (evt,tree,p5sketch),
       mouseStopped_start : function input (evt,tree,p5sketch),
       mouseStopped_end : function input (evt,tree,p5sketch),
       mouseClicked_start : function input (evt,tree,p5sketch,node),
       mouseClicked_end : function input (evt,tree,p5sketch,node),
       mouseDragged_start : function input (evt,tree,p5sketch,node),
       mouseDragged_end : function input (evt,tree,p5sketch,node),
       mousePressed_start : function input (evt,tree,p5sketch,node),
       mousePressed_end : function input (evt,tree,p5sketch,node),
       mouseReleased_start : function input (evt,tree,p5sketch,node),
       mouseReleased_end : function input (evt,tree,p5sketch,node) 
       
   */
    public addCallback(type: string, callback: Function) {
        this.addedCallback[type] = callback;
    }
    public empty() {
        this.roots.length = 0;
    }



    public hide() {
        this.hidden = true;
        this.nativeP5SketchRef.loop(1);
    }
    public show() {
        this.hidden = false;
        this.nativeP5SketchRef.loop(1);
    }


    public highlightNode(nodeId, color) {
        if (this.roots) {
            for (let i in this.roots) {
                if (this.highlightNodRecursive(this.roots[i], nodeId, color))
                    break;
            }
        }

    }

    private highlightNodRecursive(node, nodeId, color): boolean {
        if (node.id == nodeId) {
            node.borderHightlightColor = color;
            return true;
        }
        if (node.children) {
            for (let i in node.children) {
                if (this.highlightNodRecursive(node.children[i], nodeId, color))
                    return true;
            }
        }


        return false;

    }

    public highlightOnlyRoots(color) {
        if (this.roots) {
            for (let i in this.roots) {
                this.roots[i].borderHightlightColor = color;
            }
        }

    }

    public removeAllhightlits() {
        if (this.roots) {
            for (let i in this.roots) {
                this.removeAllhightlitsRecurs(this.roots[i]);
            }
        }

    }

    public removeAllhightlitsRecurs(node) {
        node.borderHightlightColor = undefined;
        if (node.children) {
            for (let i in node.children) {
                this.removeAllhightlitsRecurs(node.children[i]);
            }
        }


    }

    public findRootForNode(id) {
        let foundRoot;
        if (this.roots) {
            for (let i in this.roots) {
                let t = this.findIdRecursive(this.roots[i], id);
                if (t)
                    return t;
            }
        }

        return null;

    }

    private findIdRecursive(node, nodeId) {
        if (node.id == nodeId)
            return node;
        if (node.children) {
            for (let i in node.children) {
                let t = this.findIdRecursive(node.children[i], nodeId);
                if (t)
                    return t;
            }
        }
        return null;
    }


    /*Delete node and its children and returns a list of all the deleted nodes , children included */
    public deleteNodeAndItsChildren(nodeId)
    {
        let deleted = [];
        if (this.addedCallback["deleteNode_start"]) {
            this.addedCallback["deleteNode_start"](this, nodeId);
        }

        if(this.roots)
        {
            for(let i in this.roots)
            {
                //searching all roots until we find the branch with the node
                let foundNode = this.findIdRecursive(this.roots[i],nodeId);
                if(foundNode)
                {
                    this.deleteNodeAndChildrenRecursive(foundNode,deleted);
                    if(foundNode.fathers)
                    {
                        for(let i in foundNode.fathers)
                        {
                            this.removeById(nodeId,  foundNode.fathers[i].children);
                            // for(let j in foundNode.fathers[i].children)
                            // {
                            //     if(foundNode.fathers[i].children[j])
                            // }
                            // foundNode.fathers[i]
                        }
                    }
                    
                    break;
                }
            }

            //effective removal from tree if they are roots
            for(let i in deleted)
            {
                for(let j in this.roots)
                {
                    if(this.roots[j].id == deleted[i].id)
                    {
                        this.roots.splice(parseInt(j),1);
                    }
                }
            }
         
            
        }

        
       
       
        if (this.addedCallback["deleteNode_end"]) {
            this.addedCallback["deleteNode_end"](this,  deleted);
        }

        return deleted;

    }

    private deleteNodeAndChildrenRecursive(node, deleted)
    {   
        deleted.push(node);
        
        delete this.alreadyEncounteredNodes[node.id];
        if(node.children)
        {
            for(let i in node.children)
            {
                this.deleteNodeAndChildrenRecursive(node.children[i],deleted);
            }
        }
    }

    //this simply create a new node and returns it,
    //the new node will be alone, so a single root, with no children and no father
    public createNewNode(xpos, ypos, label, id, status,dataobject) {

        if (this.addedCallback["createNode_start"]) {
            this.addedCallback["createNode_start"](this, xpos, ypos, label, id, status);
        }

        let newRoot = SitoTreeNode._builder(
            this.nativeP5SketchRef.createVector(xpos, ypos),
            this.node_rendering.startingRay ? this.node_rendering.startingRay : 50,
            label,
            id,
            this.nativeP5SketchRef,
            this.node_rendering.colorByClusterPalettes ? this.nativeP5SketchRef.random(this.node_rendering.colorByClusterPalettes) : undefined,
            this.node_rendering,
            status,
            dataobject );


        newRoot.isRoot = true;

        this.roots.push(newRoot);


        if (null != this.draggedNode) {
            this.draggedNode.isDragged = false;
            this.draggedNode = null;
        }
        this.restoreRoots();
        this.nativeP5SketchRef.loop(1);

        if (this.addedCallback["createNode_end"]) {
            this.addedCallback["createNode_end"](this, newRoot);
        }

        return newRoot;
    }

    //merges two nodes
    //source (the node to append)
    //target (where to append)

    public appendNodeTo(source: any, target: any) {

        if (this.addedCallback["appendNodeTo_start"]) {
            this.addedCallback["appendNodeTo_start"](this, source, target);
        }

        source.isRoot = false;
        if (!source.fathers) {
            source.fathers = [];
        }
        if (this.multipleFathers) {
            source.fathers.push(target);

        }
        else {
            let oldfatherDragged = source.fathers.length > 0 ? source.fathers[0] : undefined;
            source.fathers[0] = target;
            if (null != oldfatherDragged) {
                this.removeById(source.id, oldfatherDragged.children);
            }

        }

        source.myColor = target.myColor; //if color by cluster
        target.children.push(source);
        source.orderInfather = target.children.length - 1;
        // if (!this.multipleFathers) {

        if(target.children.length == 1) 
        {
            this.deepExpansionRecursive(target);
        }
        if (target.fathers && target.fathers.length > 0) {
            target.fathers[0]._applyChildStartPos();
        }
        else
            target._applyChildStartPos();
        // }

        if (this.addedCallback["appendNodeTo_end"]) {
            this.addedCallback["appendNodeTo_end"](this, source, target);
        }

        return target;



    }

    private recursiveNodeGeneration(father: any, childdata: any, nodeschema: SitoTreeNodeSchema) {
        let idfornode = childdata[nodeschema.idproperty];
        let labelfornode = childdata[nodeschema.textproperty];
        let nodestatus = childdata[nodeschema.statusproperty];
        let dataobject = childdata[nodeschema.dataobject];
        //use the same vertical align of the father , and move orizontally
        //to allow multiple fathers we have to reuse already encountered nodes
        let node;
        if (this.alreadyEncounteredNodes[idfornode]) {
            return this.alreadyEncounteredNodes[idfornode];
        }
        else {
            node = this.createNewNode(Math.random() * 500, father.goToCenter.y + 100, labelfornode, idfornode, nodestatus,dataobject)
            this.alreadyEncounteredNodes[idfornode] = node;
        }


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

    public expandAll = () => {

        if (this.addedCallback["expandAll_start"]) {
            this.addedCallback["expandAll_start"](this);
        }

        for (let elm of this.roots) {
            if (!elm.expanded)
                this.triggerDoubleClick(elm.id, true);
        }

        if (this.addedCallback["expandAll_end"]) {
            this.addedCallback["expandAll_end"](this);
        }

    }

    public collapseAll = () => {
        if (this.addedCallback["collapseAll_start"]) {
            this.addedCallback["collapseAll_start"](this);
        }

        for (let elm of this.roots) {
            if (elm.expanded)
                this.triggerDoubleClick(elm.id, true);
        }

        if (this.addedCallback["collapseAll_end"]) {
            this.addedCallback["collapseAll_end"](this);
        }
    }

    private isMouseInSketch(mouseX, mouseY, sketchRef): boolean {
        // console.log(mouseX,mouseY,sketchRef.width,sketchRef.height);
        return mouseX > 0 && mouseY> 0 && mouseX < sketchRef.width && mouseY < sketchRef.height;

    }


    private customDoubleClick = () => {

        if (this.addedCallback["doubleClick_start"]) {
            this.addedCallback["doubleClick_start"](this, null);
        }

        for (let i in this.roots) {
            let found = this.roots[i]._checkMouseIn(this.nativeP5SketchRef.mouseX, this.nativeP5SketchRef.mouseY);
            if (null != found) {

                found.expanded = !found.expanded;

                if (found.expanded/* && found.justInitialized*/) {
                    found._applyChildStartPos();
                    //found.justInitialized = false;
                }

                if (this.addedCallback["doubleClick_end"]) {
                    this.addedCallback["doubleClick_end"](this, found);
                }

                return;
            }
        }

        if (this.addedCallback["doubleClick_end"]) {
            this.addedCallback["doubleClick_end"](this, null);
        }

    }


    private removeById = (id, els) => {
        console.log("removing by id");
        for (let i in els) {
            if (id == els[i].id) {
                els.splice(i, 1);
            }
        }
        //this.treeNodesService.notifyTreeNodesUpdate(els);
    }


    private restoreRoots = () => {
        let newRoots = [];
        for (let i in this.roots) {
            if (this.roots[i].isRoot)
                newRoots.push(this.roots[i]);
            this.roots[i]._giveChildNewColor();
        }
        this.roots = newRoots;
        // this.treeNodesService.notifyTreeNodesUpdate(this.roots);
    }


    private updateRays = () => {
        for (let i in this.roots) {
            this.roots[i]._updateRay();
        }
    }

    private reorderChilds = () => {
        for (let i in this.roots) {
            this.roots[i]._reorderChilds();
        }
    }




    private triggerDoubleClick = (id: string, deep: boolean) => {

        let found = this.roots.find(elm => elm.id === id)
        if (null != found) {

            found.expanded = !found.expanded;
            if (found.expanded) {
                found._applyChildStartPos();
            }

            if (deep && found.children != undefined && found.children.length > 0) {
                for (let child of found.children) {
                    this.deepExpansionRecursive(child)
                }
            }


        }

    }

    private deepExpansionRecursive = (elm: SitoTreeNode) => {

        elm.expanded = true;


        if (elm.children != undefined && elm.children.length > 0) {
            for (let child of elm.children) {
                this.deepExpansionRecursive(child)
            }
        }

    }

    public static createPalette = (_url) => {
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

            if (this.addedCallback["setup_start"]) {
                this.addedCallback["setup_start"](this, _p5sketch);
            }

            console.log("setup for " + this.containerDivId);
            this.canvasWidth = _p5sketch.windowWidth - 180;
            this.canvasHeight = _p5sketch.windowHeight - 200;
            let canvas2 = _p5sketch.createCanvas(this.canvasWidth, this.canvasHeight);
            canvas2.parent(this.containerDivId,); //questo lo aggancia al template angular  
            this.lastClick = _p5sketch.millis();

            _p5sketch.textSize(10);
            _p5sketch.textAlign(_p5sketch.CENTER, _p5sketch.CENTER);
            this.nativeP5SketchRef = _p5sketch;

            if (this.addedCallback["setup_end"]) {
                this.addedCallback["setup_end"](this, _p5sketch);
            }
        };



        //p5js draw function
        _p5sketch.draw = () => {


            if (this.addedCallback["draw_start"]) {
                this.addedCallback["draw_start"](this, _p5sketch);
            }

            _p5sketch.background("#fffffff");
            if (this.hidden) {

            }
            if (this.isDoubleClicked) {

                this.customDoubleClick();
                this.isDoubleClicked = false;

            }

            for (let i in this.roots) {
                this.roots[i]._draw();
            }

            if (this.addedCallback["draw_end"]) {
                this.addedCallback["draw_end"](this, _p5sketch);
            }

        };

        //p5js other native functions
        _p5sketch.mouseMoved = (evt) => {
            if (this.addedCallback["mouseMoved_start"]) {
                this.addedCallback["mouseMoved_start"](evt, this, _p5sketch);
            }

            /* ... */

            if (this.addedCallback["mouseMoved_end"]) {
                this.addedCallback["mouseMoved_end"](evt, this, _p5sketch);
            }
        }


        _p5sketch.mouseStopped = (evt) => {
            _p5sketch.noLoop();

            if (this.addedCallback["mouseStopped_start"]) {
                this.addedCallback["mouseStopped_start"](evt, this, _p5sketch);
            }
            /*... */

            if (this.addedCallback["mouseStopped_end"]) {
                this.addedCallback["mouseStopped_end"](evt, this, _p5sketch);
            }
        }


        //allowed only in readOnly == false mode
        _p5sketch.mouseClicked = (evt) => {

            /*not in sketch, return anyway */
            if (!this.isMouseInSketch(_p5sketch.mouseX, _p5sketch.mouseY, this.nativeP5SketchRef)) {
               
                return;
            }

            if (this.addedCallback["mouseClicked_start"]) {
                this.addedCallback["mouseClicked_start"](evt, this, null);
            }

            //find the clicked node
            let found;
            for (let i in this.roots) {
                found = this.roots[i]._checkMouseIn(_p5sketch.mouseX, _p5sketch.mouseY); 
                if (found)
                    break;
            }
            

            //click on already existing node, we do nothing (return) in the tree, just call the external callback if present
            if (found)
            {
                if (this.addedCallback["mouseClicked_end"]) {
                    this.addedCallback["mouseClicked_end"](evt, this, _p5sketch, found);
                }
                return;
            }

            //if we are in readonly we can do nothing else
            if (this.allowedOperations.readOnly) {
               //no need to call the callback because we clicked outside a node , in the sketch,
               //so we consider it a click outside the tree
                // if (this.addedCallback["mouseClicked_end"] && found) {
                //     this.addedCallback["mouseClicked_end"](evt, this, _p5sketch, found);
                // } 
                return;
            }


            //if we are handling double clicking we do nothing (not even the callback that will be triggered
            //in the double click itself)
            if (this.isDoubleClicked) {
                return;
            }
            
             
            /*NEW NODE CREATION ****************************************************************************************************************************/
            //creation where the user clicks 
            if(!this.allowedOperations.nodeCreation) //no node creation allowed, we exit
            {
                if (this.addedCallback["mouseClicked_end"]) {
                    this.addedCallback["mouseClicked_end"](evt, this, _p5sketch, found);
                }
                return;
            }

            let newRootId = "" + (_p5sketch.frameCount % 1000);
            this.createNewNode(_p5sketch.mouseX, _p5sketch.mouseY, newRootId, newRootId, "COMPLETED_SUCCESS",null);


            if (this.addedCallback["mouseClicked_end"]) {
                this.addedCallback["mouseClicked_end"](evt, this, _p5sketch, found);
            }
        }

        _p5sketch.mouseDragged = (evt) => {

            if (this.addedCallback["mouseDragged_start"]) {
                this.addedCallback["mouseDragged_start"](evt, this, _p5sketch, null);
            }

            if (this.isDoubleClicked)
                return;

            if (null != this.draggedNode) {
                this.draggedNode.center = _p5sketch.createVector(_p5sketch.mouseX, _p5sketch.mouseY);
                this.draggedNode.goToCenter = this.draggedNode.center.copy();
            }

            if (this.addedCallback["mouseDragged_end"]) {
                this.addedCallback["mouseDragged_end"](evt, this, _p5sketch, this.draggedNode);
            }

            _p5sketch.loop(1);
        }


        _p5sketch.mousePressed = (evt) => {

            if (this.addedCallback["mousePressed_start"]) {
                this.addedCallback["mousePressed_start"](evt, this, _p5sketch, null);
            }

            let millisT = _p5sketch.millis(); //Math.floor(Date.now() / 1000);
            if (millisT - this.lastClick < 200)
                this.isDoubleClicked = true;
            else this.isDoubleClicked = false;

            this.lastClick = _p5sketch.millis();//Math.floor(Date.now() / 1000);

            if (this.isDoubleClicked)
                return;

            let found;
            for (let i in this.roots) {
                let found = this.roots[i]._checkMouseIn(_p5sketch.mouseX, _p5sketch.mouseY);

                if (null != found) {

                    this.draggedNode = found;
                    found.isDragged = true;


                }
            }

            if (this.addedCallback["mousePressed_end"]) {
                this.addedCallback["mousePressed_end"](evt, this, _p5sketch, found);
            }

            _p5sketch.loop(1);
        }

        /*when releasing a node on top of another, we merge them only if we are
        in readonly == false */
        _p5sketch.mouseReleased = (evt) => {
            if (this.isDoubleClicked) {

                return;
            }

            if (this.addedCallback["mouseReleased_start"]) {
                this.addedCallback["mouseReleased_start"](evt, this, _p5sketch, null);
            }


            if (null != this.draggedNode) {

                for (let j in this.roots) {
                    let root = this.roots[j];
                    let found = root._checkMouseIn(_p5sketch.mouseX, _p5sketch.mouseY);
                    if (null == found || found.isDragged)
                        continue;
                    let target = found;
                    if (!this.allowedOperations.readOnly && this.allowedOperations.nodeAppend)
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

            if (this.addedCallback["mouseReleased_end"]) {
                this.addedCallback["mouseReleased_end"](evt, this, _p5sketch, this.draggedNode);
            }

        }


    }

}








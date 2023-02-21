 
import * as p5 from "p5";
import { SitoForestLayout_Horizontal, SitoForestLayout_Vertical } from "./sito_forest_layout";
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
    hidden : boolean = false;
    addedCallback   = {}

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
    constructor(public containerDivId, public readOnly: boolean,
        public colorByClusterPalettes, public colorByStateMap, public sizeBasedOnNumChildren :boolean, 
        public horizontal_layout? : SitoForestLayout_Horizontal,
        public vertical_layout ? : SitoForestLayout_Vertical) {

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
      
   
    public addCallback( type : string, callback : Function)
    {
        this.addedCallback[type] = callback;
    }
    public empty()
    {
        this.roots.length = 0;
    }

    public loadData(data: any, nodeschema: SitoTreeNodeSchema, debug :boolean) {

        //data is empty, so we call the generateTreeFromData
        if(!this.roots || this.roots.length == 0)
        {   
            if(debug)
            {
                console.log("no nodes, generating anew");
            }
            this.createNewNodesStructureFromDataLoading( data,nodeschema,debug);
            return;
        }

        let comparison = SitoTree.compareDataPathsAndTreePath(data,this,nodeschema);
        if(comparison == 0)
        {   
            if(debug)
                console.log("tree and data represent the same tree structure and status, nothing to do")
            return ; //nothing, the three doesn't have to be updated
        }
        else if(comparison == -1)
        {
            if(debug)
             console.log("tree and data represent different node. Need to generate anew from data");

            this.createNewNodesStructureFromDataLoading(data,nodeschema,debug); //full re-generation for tree (the data represents a new tree)
        }
        else
        {   
            if(debug)
                console.log("Tree and data only different in status. Updating status on every node from data");

            if(this.roots)
            {
                for(let i in this.roots)
                {
                    SitoTree.recursiveNodeUpdateFromData(data[i],this.roots[i],nodeschema);
                }
            }

            return;
        }
         
    }


    /*the forests layout are used to define how to distribute different roots for different trees */
    private createNewNodesStructureFromDataLoading( data: any, nodeschema: SitoTreeNodeSchema, debug : boolean) {
        
        let newroots = [];
        if(debug)
            console.log("generating from data for "+this.containerDivId);
        //for every outer object in the data list we will have roots
        for (let i in data) {
            //create the node
            let idfornode = data[i][nodeschema.idproperty];
            let labelfornode = data[i][nodeschema.textproperty];
            let nodestatus = data[i][nodeschema.statusproperty];
            /*If horizontal layout is given it will try to dispose horizontally,
            otherwise it will use vertical layout if given
            otherwise it will just set them at start of window going down*/
            let xPos = 0;
            let yPos = 0;
            if(this.horizontal_layout)
            {
                let columnReservedSpace = (this.nativeP5SketchRef.windowWidth - this.horizontal_layout.paddingLeft - this.horizontal_layout.paddingRight) 
                 / this.horizontal_layout.numOfColumns;

                let hIndex = (this.strip( i ))%this.strip(this.horizontal_layout.numOfColumns);
                xPos = this.horizontal_layout.paddingLeft + hIndex * columnReservedSpace;
                xPos = xPos + 0.5 * columnReservedSpace; //we center it in the reserved space horizontally
                let vIndex = parseInt(""+this.strip( i )/this.strip(this.horizontal_layout.numOfColumns));
                yPos = this.horizontal_layout.paddingTop + vIndex * this.horizontal_layout.verticalReservedSpaceForTree;
                yPos = yPos + 0.5 * this.horizontal_layout.verticalReservedSpaceForTree;
            }
            else if(this.vertical_layout)
            {
                let rowsReservedSpace = (this.nativeP5SketchRef.windowHeight - this.vertical_layout.paddingTop - this.vertical_layout.paddingBottom) 
                    / this.vertical_layout.numOfRows;

                let vIndex = this.strip( i )%this.strip(this.vertical_layout.numOfRows);
                yPos = this.vertical_layout.paddingTop + vIndex * rowsReservedSpace;
                yPos = yPos + 0.5 * rowsReservedSpace; //we center it in the reserved space vertically
                let hIndex = parseInt(""+this.strip( i )/this.strip(this.vertical_layout.numOfRows));
                xPos = this.vertical_layout.paddingLeft + hIndex * this.vertical_layout.horizontalReservedSpaceForTree;
                xPos = xPos + 0.5 * this.vertical_layout.horizontalReservedSpaceForTree;
            }
            else
            {
                xPos = 100;
                yPos = 100 + parseInt(i) * 200;
            }
            //roots are created on the left, and the vertical allign is based on the index
            let rootnode = this.createNewNode( xPos, yPos, labelfornode, idfornode, nodestatus)
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
    private strip(number:any) : any{
        return (parseFloat(number).toPrecision(12));
    }

 

    //this can be called only if we are sure the structures of data and nodes are the same
    private static recursiveNodeUpdateFromData(data_element, node : SitoTreeNode, nodeschema : SitoTreeNodeSchema)
    { 
         
        node.status = data_element[nodeschema.statusproperty];
        
        if( node.children && node.children.length > 0) //no children, I am leaf, path completed
        {
            for(let ichild in node.children)
            {
                let childrenTreeNode = node.children[ichild];
                let childrenDataNode = data_element[nodeschema.childrenproperty][ichild];
                this.recursiveNodeUpdateFromData(childrenDataNode,childrenTreeNode, nodeschema);
                
            }
        }
        

        
    }

    
    /*
    returns 0 if equals
    returns -1 if completely different in structure
    returns 1 if same structure but different status
    */
    
    private static compareDataPathsAndTreePath(datas, tree : SitoTree, treenodeschema : SitoTreeNodeSchema) : number
    {
        let result = 0;
        let treepaths = tree.getAllTreePaths();
        let dataPaths = SitoTree.getAllDataPaths(datas,treenodeschema);
        //comparing
        if((!treepaths && !dataPaths) || (treepaths.length == 0 && dataPaths.length == 0))
            result = 0;
        else if(treepaths.length != dataPaths.length) 
        {
             result = -1;
        }   
        else
        {   
            let different = false;
            for(let i in treepaths)
            {
                if(treepaths[i] != dataPaths[i])
                {
                    different = true;
                    break;
                }
            }
            if(!different) 
                result = 0;
            else
            {
                different = false;
                for(let i in treepaths)
                {
                    if(treepaths[i].replaceAll(/\[(.*?)\]/g,"?") != dataPaths[i].replaceAll(/\[(.*?)\]/g,"?"))
                    {
                        different = true;
                        break;
                    }
                }
                if(!different)
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


    private getAllTreePaths( ) : string[]
    {
        let paths = [];

        if(this.roots)
        {
            for(let ir in  this.roots)
            {
                let rootsPaths  = this.dfs_visitAllTreePaths( this.roots[ir],"");
                for(let ip in rootsPaths)
                {
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
    private dfs_visitAllTreePaths(node: SitoTreeNode, pathToMyFather : string ) : string[]
    {
        let mySubPaths = [];
       
        let pathToMe = pathToMyFather + "->"+node.id+"["+node.status+"]";
        if(!node.children || node.children.length == 0) //no children, I am leaf, path completed
        {
            mySubPaths.push(pathToMe);
        }
        else //otherwise i have children, so my subpath will only be my path + children continuation until leaves
        {
            for(let ichild in node.children)
            {
                let children = node.children[ichild];
                
                let childrenpaths = this.dfs_visitAllTreePaths(children,pathToMe);
                for(let kcp in childrenpaths)
                {
                    mySubPaths.push(childrenpaths[kcp]);
                }
            }
        }

        return mySubPaths;
    }


     /*Same methods of two previous, but for data */
     private static getAllDataPaths(data, treenodeschema : SitoTreeNodeSchema ) : string[]
    {
        let paths = [];

        if(data)
        {
            for(let ir in data)
            {
                let rootsPaths  = SitoTree.dfs_visitAllDataPaths(treenodeschema, data[ir],"");
                for(let ip in rootsPaths)
                {
                    paths.push(rootsPaths[ip]);
                }
               
            }
        }

        return paths;
    }

  
    private static dfs_visitAllDataPaths(treenodeschema : SitoTreeNodeSchema,data_elm: SitoTreeNode, pathToMyFather : string ) : string[]
    {
        let mySubPaths = [];
       
        let pathToMe = pathToMyFather + "->"+data_elm[treenodeschema.idproperty]+"["+data_elm[treenodeschema.statusproperty]+"]";
        if(!data_elm[treenodeschema.childrenproperty] || data_elm[treenodeschema.childrenproperty].length == 0) //no children, I am leaf, path completed
        {
            mySubPaths.push(pathToMe);
        }
        else //otherwise i have children, so my subpath will only be my path + children continuation until leaves
        {
            for(let ichild in data_elm[treenodeschema.childrenproperty])
            {
                let children = data_elm[treenodeschema.childrenproperty][ichild];
                
                let childrenpaths = this.dfs_visitAllDataPaths(treenodeschema,children,pathToMe);
                for(let kcp in childrenpaths)
                {
                    mySubPaths.push(childrenpaths[kcp]);
                }
            }
        }

        return mySubPaths;
    }

   
    public hide()
    {
        this.hidden = true;
        this.nativeP5SketchRef.loop(1);
    }
    public show()
    {
        this.hidden = false;
        this.nativeP5SketchRef.loop(1);
    }


    public highlightNode(nodeId,color)
    {
        if(this.roots)
        {   
            for(let i in this.roots)
            {
                if(this.highlightNodRecursive(this.roots[i],nodeId,color))
                    break;
            }
        }
        
    }

    private highlightNodRecursive(node, nodeId,color) : boolean
    {
        if(node.id == nodeId)
        {
            node.borderHightlightColor = color;
            return true;
        }
        if(node.children)
        {
            for(let i in node.children)
            {
                if(this.highlightNodRecursive(node.children[i],nodeId,color))
                    return true;
            }
        }
     

        return false;
      
    }

    public highlightOnlyRoots(color)
    {
        if(this.roots)
        {
            for(let i in this.roots)
            {
                this.roots[i].borderHightlightColor = color;
            }
        }
        
    }

    public removeAllhightlits()
    {
        if(this.roots)
        {
            for(let i in this.roots)
            {
                this.removeAllhightlitsRecurs(this.roots[i]   );
            }
        }
        
    }

    public removeAllhightlitsRecurs(node)
    {
        node.borderHightlightColor = undefined;
        if(node.children)
        {
            for(let i in node.children)
            {
                this.removeAllhightlitsRecurs(node.children[i]);
            }
        }
     
        
    }

    public findRootForNode( id)
    {
        let foundRoot;
        if(this.roots)
        {
            for(let i in this.roots)
            {
                let t = this.findIdRecursive(this.roots[i],id);
                if(t)
                    return t;
            }
        }

        return null; 

    }

    private findIdRecursive(node, nodeId)
    {
        if(node.id == nodeId)
            return node;
        if(node.children)
        {
            for(let i in node.children)
            {
                let t = this.findIdRecursive(node.children[i],nodeId);
                if(t)
                    return t;
            }
        }
        return null;
    }
    
    //this simply create a new node and returns it,
    //the new node will be alone, so a single root, with no children and no father
    public createNewNode(xpos, ypos, label, id, status) {
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
   
    public appendNodeTo(source: any, target: any ) {
 
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
        let node = this.createNewNode(Math.random() * 500, father.goToCenter.y + 100, labelfornode, idfornode, nodestatus)

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
        for (let elm of this.roots) {
            if (!elm.expanded)
                this.triggerDoubleClick(elm.id, true);
        }
    }

    public collapseAll = () => {
        for (let elm of this.roots) {
            if (elm.expanded)
                this.triggerDoubleClick(elm.id, true);
        }
    }

    private isMouseInSketch(mouseX, mouseY, sketchRef): boolean {
        // console.log(mouseX,mouseY,sketchRef.width,sketchRef.height);
        return mouseX < sketchRef.width && mouseY < sketchRef.height;

    }
 

    private customDoubleClick = ( ) => {

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

    private  reorderChilds = () => {
        for (let i in this.roots) {
            this.roots[i]._reorderChilds();
        }
    }


 

    private triggerDoubleClick = (id: string, deep: boolean) => {

        let found = this.roots.find(elm => elm.id === id)
        if (null != found) {

            found.expanded = !found.expanded;
            if(found.expanded)
            {
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

            _p5sketch.background("#fffffff");
            if(this.hidden)
            {

            }
            if (this.isDoubleClicked) {

                this.customDoubleClick();
                this.isDoubleClicked = false;
              
            }
            
            for (let i in this.roots) {
                this.roots[i]._draw();
            }

        };

        //p5js other native functions
        _p5sketch.mouseMoved = () => {
            //_p5sketch.loop();
        }


        _p5sketch.mouseStopped = () => {
            _p5sketch.noLoop();
        }


        //allowed only in readOnly == false mode
        _p5sketch.mouseClicked = (e) => {
            
            if(this.addedCallback["mouseClicked"])
            {
                this.addedCallback["mouseClicked"](e,this,this.draggedNode);
            }

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

            if(this.addedCallback["mouseDragged"])
            {
                this.addedCallback["mouseDragged"](this,this.draggedNode);
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








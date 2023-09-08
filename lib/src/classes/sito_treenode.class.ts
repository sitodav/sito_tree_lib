import { DebugTimer } from "./debug-timer";

/*
author: sitodav@gmail.com
*/
export class SitoTreeNode {

   
    public expanded = false;
    public fathers = null;
    public isRoot = false;
    public isDragged = false;
    public internalAngleRotation = 0;
    public children = [];
    public goToCenter = null;
    public orderInfather = 0;
    public borderHightlightColor = undefined;

    
    
    
    //public justInitialized = true;


    /*node data */


    constructor(public center, public ray,  public label, public id,
        public p5NativeSketchRef, public myColor,  public node_renderingprops, public status ,
        public dataobject
        ) {
         
        
        this.goToCenter = center.copy();

    }

    public _draw = () => {

        if(!this.status)
            return;
            
        //movement
        if (!this.isDragged)
            this.center = this.p5NativeSketchRef.createVector(this.center.x + (this.goToCenter.x - this.center.x) * 0.1, this.center.y + (this.goToCenter.y - this.center.y) * 0.1);

        let atLeastOneFatherExpanded = false;
        if(this.fathers && this.fathers.length > 0) //if i have one or more fathers and they are all collapsed, i don't draw 
        {
            for(let i in this.fathers)
            {
                if(this.fathers[i].expanded)
                {
                    atLeastOneFatherExpanded = true;
                    break;
                }
            }
            if (!atLeastOneFatherExpanded)
                return;
        }
        
       
         

        //drawing the line connecting the node with the father
        //only for expanded fathers
        DebugTimer.start("_draw: drawing line connecting node with fathers");
        if (null != this.fathers) {

            for(let i in this.fathers)
            {
                if(this.fathers[i].expanded)
                {

                    let colorForEdges = this.node_renderingprops.vertexColor ? this.node_renderingprops.vertexColor : "#000000";
                    let WeightForEdges = this.node_renderingprops.vertexStrokeWeight ? this.node_renderingprops.vertexStrokeWeight : 1.0;
                    this.p5NativeSketchRef.strokeWeight(WeightForEdges);
                    this.p5NativeSketchRef.stroke(colorForEdges); 
                    this.p5NativeSketchRef.line(this.fathers[i].center.x, this.fathers[i].center.y, this.center.x, this.center.y);
                    
                    this.p5NativeSketchRef.push();
                    this.p5NativeSketchRef.strokeWeight(WeightForEdges * 2);
                    let angle = this.p5NativeSketchRef.atan2((this.center.y - this.fathers[i].center.y), (this.center.x - this.fathers[i].center.x));
                    this.p5NativeSketchRef.translate(this.center.x - this.p5NativeSketchRef.cos(angle) * this.ray * 0.5, this.center.y - this.p5NativeSketchRef.sin(angle) * this.ray * 0.5);
                    this.p5NativeSketchRef.rotate(angle);
                    this.p5NativeSketchRef.line(0, 0, -5, -5);
                    this.p5NativeSketchRef.line(0, 0, -5, 5);
                    this.p5NativeSketchRef.pop();
                }
            }
            
        }
        DebugTimer.start2(5,"_draw: drawing line connecting node with father"); 


        DebugTimer.start("_draw: recursive _draw on children of "+this.id);

        if (this.children.length > 0 && this.expanded) {
            for (let i in this.children) {
                this.children[i]._draw();
            }
        }
        DebugTimer.start2(5,"_draw: recursive _draw on children of "+this.id);


        DebugTimer.start("_draw: node rendering "+this.id);

        this.p5NativeSketchRef.ellipseMode(this.p5NativeSketchRef.CENTER);
        this.p5NativeSketchRef.push();
        this.p5NativeSketchRef.translate(this.center.x, this.center.y);
        this.p5NativeSketchRef.stroke(0, 0, 0, 120);

        if (this.node_renderingprops.colorByClusterPalettes)
        {
            this.p5NativeSketchRef.fill(this.myColor);
        }
        else
        {
            try{
                this.p5NativeSketchRef.fill(this.node_renderingprops.colorByStateMap[this.status]);
            }
            catch( ex)
            {
                this.p5NativeSketchRef.fill(this.node_renderingprops.colorByStateMap["DEFAULT"]);
            }
            
        }

        let weightForNodeBorder = this.node_renderingprops.nodeBorderWeight ? this.node_renderingprops.nodeBorderWeight : 1;
        //node border based on having children or not
        if(this.children && this.children.length > 0)
        {
            
            this.p5NativeSketchRef.stroke(0, 0, 0, 255);
            this.p5NativeSketchRef.strokeWeight(weightForNodeBorder*3);
        }
        else
        {
            this.p5NativeSketchRef.strokeWeight(weightForNodeBorder);
        }
        //node drawing
        this.p5NativeSketchRef.ellipse(0, 0, this.ray, this.ray);

        if(this.borderHightlightColor)
        {
            this.p5NativeSketchRef.strokeWeight(weightForNodeBorder*3);
            this.p5NativeSketchRef.noFill();
            this.p5NativeSketchRef.stroke(this.borderHightlightColor);
            this.p5NativeSketchRef.ellipse(0, 0, this.ray+10, this.ray+10);
            this.p5NativeSketchRef.ellipse(0, 0, this.ray+20, this.ray+20);
        }
        //label drawing
        let labelStrokeWeight = this.node_renderingprops.textWeight ? this.node_renderingprops.textWeight : 0.5;
        this.p5NativeSketchRef.strokeWeight(labelStrokeWeight);
        let textColor = this.node_renderingprops.textColor ? this.node_renderingprops.textColor : "#000000";
        this.p5NativeSketchRef.fill(textColor);
        this.p5NativeSketchRef.stroke(textColor);
        let textSize = this.node_renderingprops.textSize ? this.node_renderingprops.textSize : 14;
        this.p5NativeSketchRef.textSize(textSize);
        let labelMaxLength = this.node_renderingprops.labelMaxLength ? this.node_renderingprops.labelMaxLength : 3;
        let labelTrailing = this.node_renderingprops.labelTrailing ? this.node_renderingprops.labelTrailing : "...";
        let labelToShow = this.label.substring(0,Math.min(labelMaxLength,this.label.length))+labelTrailing;
        this.p5NativeSketchRef.text( labelToShow, 0, 0);
        //if the node has children we will write the num of children 
        // if(this.children && this.children.length > 0)
        // {   
        //     this.p5NativeSketchRef.textSize(textSize-5);
        //     this.p5NativeSketchRef.text( "("+this.children.length+")", 0, +this.ray * 0.25);
        // }
        this.p5NativeSketchRef.pop();

        DebugTimer.start2(5,"_draw: node rendering "+this.id);
    }

    
    public _checkMouseIn = (x, y) => {
        DebugTimer.start("_checkMouseIn"+this.id);
        if (this.expanded && this.children.length > 0) {
            for (let i in this.children) {
                let found = this.children[i]._checkMouseIn(x, y);
                if (null != found) {
                    return found;
                }
            }
        }

        if (this.p5NativeSketchRef.createVector(this.center.x - x, this.center.y - y).mag() < 0.5 * this.ray) {

            DebugTimer.start2(5,"_checkMouseIn"+this.id);
            return this;

        }
        DebugTimer.start2(5,"_checkMouseIn"+this.id);
        return null;
    }

    //partial means not all the way, used for multiple fathers
    public _applyChildStartPos = (partial?:number) => {
        DebugTimer.start("_applyChildStartPos"+this.id);
        
        partial = !partial ? 1.0 : partial;

        for (let i in this.children) {

            let childRay = this.p5NativeSketchRef.max(this.ray, this.children[i].children.length * 30);
            childRay = childRay * partial;
            let anglePorz = (this.children[i].orderInfather) * this.p5NativeSketchRef.TWO_PI / this.p5NativeSketchRef.max(6, this.children.length);

            this.children[i].goToCenter = this.p5NativeSketchRef.createVector(this.goToCenter.x + 2*childRay * this.p5NativeSketchRef.cos(anglePorz),
                this.goToCenter.y + 2*childRay * this.p5NativeSketchRef.sin(anglePorz));
            this.children[i]._applyChildStartPos();
        }

        DebugTimer.start2(5,"_applyChildStartPos"+this.id);
    }

    public _updateRay = () => {
        DebugTimer.start("_updateRay"+this.id);
        if(!this.node_renderingprops.sizeBasedOnNumChildren)
            return;
        this.ray = this.p5NativeSketchRef.max(50, 30 * this.children.length);
        for (let i in this.children) {
            this.children[i]._updateRay();
        }
        DebugTimer.start2(5,"_updateRay"+this.id);
    }

    //used only if colorByCluster
    public _giveChildNewColor = () => {
        if (!this.node_renderingprops.colorByClusterPalettes)
            return;

        for (let ifig in this.children) {
            this.children[ifig]._updateElementClusterColor(this.myColor);
        }
    }

    //used only if colorByCluster
    public _updateElementClusterColor = (_newColor) => {
        if (!this.node_renderingprops.colorByClusterPalettes)
            return;

        this.myColor = _newColor;
        for (let ifig in this.children) {
            this.children[ifig]._updateElementClusterColor(this.myColor);
        }
    }

    public _reorderChilds = () => {
        DebugTimer.start("_reorderChilds"+this.id);
        this.children.sort((a, b) => {
            if (a.orderInfather > b.orderInfather)
                return 1;
            else return -1;
        });
        DebugTimer.start2(5,"_reorderChilds"+this.id);
    }






    public static _builder =  (center, ray,  label,id,
        sketchRef, startingColor, node_renderingprops , status ,dataobject): SitoTreeNode => {
            
        DebugTimer.start("_builder"+id);
        if (sketchRef) {

            let newTreeNode = new SitoTreeNode(center, ray,  label, id,sketchRef, startingColor,node_renderingprops, status,dataobject );
            DebugTimer.start("_reorderChilds"+id);
            return newTreeNode;
        }
        DebugTimer.start2(5,"_builder"+id);
        return undefined;

    }
}





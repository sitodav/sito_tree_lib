
/*
author: sitodav@gmail.com
*/
export class SitoTreeNode {

   
    public expanded = false;
    public father = null;
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
        public p5NativeSketchRef, public colorByCluster, public colorByStateMap, public status,
        public sizeBasedOnNumChildren) {

        this.goToCenter = center.copy();

    }

    public _draw = () => {

        //movement
        if (!this.isDragged)
            this.center = this.p5NativeSketchRef.createVector(this.center.x + (this.goToCenter.x - this.center.x) * 0.1, this.center.y + (this.goToCenter.y - this.center.y) * 0.1);

        if (null != this.father && !this.father.expanded)
            return;
         

        //drawing the line connecting the node with the father
        if (null != this.father) {

            /*if (this.colorByCluster)
                this.p5NativeSketchRef.stroke(this.father.colorByCluster);
            else
                this.p5NativeSketchRef.stroke(this.father.colorByStateMap[this.father.status]);*/
            this.p5NativeSketchRef.stroke(0,0,0,255);

            this.p5NativeSketchRef.line(this.father.center.x, this.father.center.y, this.center.x, this.center.y);
            this.p5NativeSketchRef.push();
            this.p5NativeSketchRef.strokeWeight(2);
            let angle = this.p5NativeSketchRef.atan2((this.center.y - this.father.center.y), (this.center.x - this.father.center.x));
            this.p5NativeSketchRef.translate(this.center.x - this.p5NativeSketchRef.cos(angle) * this.ray * 0.5, this.center.y - this.p5NativeSketchRef.sin(angle) * this.ray * 0.5);
            this.p5NativeSketchRef.rotate(angle);
            this.p5NativeSketchRef.line(0, 0, -5, -5);
            this.p5NativeSketchRef.line(0, 0, -5, 5);
            this.p5NativeSketchRef.pop();
        }
         

        if (this.children.length > 0 && this.expanded) {
            for (let i in this.children) {
                this.children[i]._draw();
            }
        }

        this.p5NativeSketchRef.push();
        this.p5NativeSketchRef.translate(this.center.x, this.center.y);
        this.p5NativeSketchRef.noFill();
        this.p5NativeSketchRef.stroke(0, 255);
        this.p5NativeSketchRef.ellipseMode(this.p5NativeSketchRef.CENTER);
        this.p5NativeSketchRef.stroke(0, 0, 0, 120);

        if (this.colorByCluster)
        {
            this.p5NativeSketchRef.fill(this.colorByCluster);
        }
        else
        {
            try{
                this.p5NativeSketchRef.fill(this.colorByStateMap[this.status]);
            }
            catch( ex)
            {
                this.p5NativeSketchRef.fill(this.colorByStateMap["DEFAULT"]);
            }
            
        }
        //node border based on having children or not
        if(this.children && this.children.length > 0)
        {
            
        this.p5NativeSketchRef.stroke(0, 0, 0, 255);
            this.p5NativeSketchRef.strokeWeight(3);
        }
        else
        {
            this.p5NativeSketchRef.strokeWeight(1);
        }
        this.p5NativeSketchRef.ellipse(0, 0, this.ray, this.ray);
        if(this.borderHightlightColor)
        {
            this.p5NativeSketchRef.strokeWeight(3);
            this.p5NativeSketchRef.noFill();
            this.p5NativeSketchRef.stroke(this.borderHightlightColor);
            this.p5NativeSketchRef.ellipse(0, 0, this.ray+10, this.ray+10);
        }
        this.p5NativeSketchRef.strokeWeight(0.5);
        this.p5NativeSketchRef.fill(0, 255);
        this.p5NativeSketchRef.textSize(14);
        this.p5NativeSketchRef.stroke(0, 255);
        let labelToShow = this.label.substring(0,Math.min(3,this.label.length))+"...";
        this.p5NativeSketchRef.text( labelToShow, 0, 0);
        //if the node has children we will write the num of children 
        if(this.children && this.children.length > 0)
        {   
            this.p5NativeSketchRef.textSize(9);
            this.p5NativeSketchRef.text( "("+this.children.length+")", 0, +this.ray * 0.25);
        }
        this.p5NativeSketchRef.pop();
    }

    public _checkMouseIn = (x, y) => {

        if (this.expanded && this.children.length > 0) {
            for (let i in this.children) {
                let found = this.children[i]._checkMouseIn(x, y);
                if (null != found) {
                    return found;
                }
            }
        }

        if (this.p5NativeSketchRef.createVector(this.center.x - x, this.center.y - y).mag() < 0.5 * this.ray) {

            return this;

        }
        return null;
    }

    public _applyChildStartPos = () => {
        for (let i in this.children) {

            let childRay = this.p5NativeSketchRef.max(this.ray, this.children[i].children.length * 30);
            let anglePorz = (this.children[i].orderInfather) * this.p5NativeSketchRef.TWO_PI / this.p5NativeSketchRef.max(6, this.children.length);

            this.children[i].goToCenter = this.p5NativeSketchRef.createVector(this.goToCenter.x + 2*childRay * this.p5NativeSketchRef.cos(anglePorz),
                this.goToCenter.y + 2*childRay * this.p5NativeSketchRef.sin(anglePorz));
            this.children[i]._applyChildStartPos();
        }
    }

    public _updateRay = () => {
        if(!this.sizeBasedOnNumChildren)
            return;
        this.ray = this.p5NativeSketchRef.max(50, 30 * this.children.length);
        for (let i in this.children) {
            this.children[i]._updateRay();
        }
    }

    //used only if colorByCluster
    public _giveChildNewColor = () => {
        if (!this.colorByCluster)
            return;

        for (let ifig in this.children) {
            this.children[ifig]._updateElementClusterColor(this.colorByCluster);
        }
    }

    //used only if colorByCluster
    public _updateElementClusterColor = (_newColor) => {
        if (!this.colorByCluster)
            return;

        this.colorByCluster = _newColor;
        for (let ifig in this.children) {
            this.children[ifig]._updateElementClusterColor(this.colorByCluster);
        }
    }

    public _reorderChilds = () => {
        this.children.sort((a, b) => {
            if (a.orderInfather > b.orderInfather)
                return 1;
            else return -1;
        });
    }






    public static _builder = (center, ray,  label,id,
        sketchRef, colorByClusterPalettes, colorByStateMap, status,sizeBasedOnNumChildren): SitoTreeNode => {

        if (sketchRef) {

            let newTreeNode = new SitoTreeNode(center, ray,  label, id,sketchRef, colorByClusterPalettes, colorByStateMap, status,sizeBasedOnNumChildren);

            return newTreeNode;
        }
        return undefined;

    }
}





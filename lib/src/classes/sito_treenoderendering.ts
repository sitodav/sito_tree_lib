 

/*
author: sitodav@gmail.com
*/

/*
 Node Highlighting color is not a rendering property.
 It's something you manually trigger (toggle On, OFF) on a given node.
 Usually it's something you do in the callback registered on a node click
 While hightlighEdgeWithThisColor is a fixed property for the over (ON / OFF    )
*/
export interface SitoTreeNodeRendering {

     colorByStateMap? : any;
     colorByClusterPalettes? : any;
     labelMaxLength ?: number;
     labelTrailing ?: string;
     sizeBasedOnNumChildren ?: boolean; 
     startingRay ?: number;  
     nodeBorderWeight ?: number;
     vertexStrokeWeight ?: number;
     vertexColor ?:string;
     textWeight ?: number;
     textColor ?:string;
     textSize ?:number;
     hightlightEdgesOnMouseOverColor ?:string; //while node highlight color is defined on the set, externally, the fixed highlighting color for edge is defined here


}




 




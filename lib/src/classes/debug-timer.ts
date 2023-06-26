export class DebugTimer {

   public constructor() { }
   static _enabled = false;
   static _times = {};
   public static enable() {
      DebugTimer._enabled = true;
   }
   
   public static disable() {
      DebugTimer._enabled = false;
   }

   public static start(key: string) {
      if (!DebugTimer._enabled)
         return;
      this._times[key] = Date.now();
   }

   public static start2(threshold, key: string) {

      if (!DebugTimer._enabled)
         return;
      let _now = Date.now();
      let _passedtime = (_now - DebugTimer._times[key]);
      if (_passedtime >= threshold)
         console.log("debug timer>> " + key + " : " + _passedtime);
      this.start(key);
   }

     

}
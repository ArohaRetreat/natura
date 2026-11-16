#target photoshop
/* Build a native layered source document from the ORIGINAL pixels.
   No new face, generated replacement, source overwrite or claimed rigging.
   Run through Photoshop File > Scripts > Browse after opening Photoshop. */
(function(){
 var base=File($.fileName).parent,root=base.parent;
 var spec={"chapter":"explorer","season":"warm","source":"public/assets/hrudhi/references/explorer-warm.png","identity":"hrudhi-original-v1","coordinateSystem":[320,480],"head":[[0,0],[320,0],[320,139],[207,139],[190,151],[143,151],[123,139],[0,139]],"arms":[[[134,149],[105,156],[82,205],[29,238],[28,268],[74,268],[107,221],[134,194]],[[199,149],[228,156],[252,207],[297,242],[298,272],[252,272],[227,223],[199,194]]],"legs":[[[0,350],[163,350],[163,480],[0,480]],[[163,350],[320,350],[320,480],[163,480]]],"elbows":[208,210],"wrists":[244,248],"hip":350,"knee":392,"ankle":432};
 var source=File(root+'/'+spec.source),out=Folder(base+'/output');if(!out.exists)out.create();
 var destination=File(out+'/Hrudhi-explorer-warm-source-v1.psd');if(destination.exists)throw Error('Refusing to overwrite an existing Hrudhi source PSD.');
 var stage='initial';
 var previousUnits=app.preferences.rulerUnits,previousDialogs=app.displayDialogs;app.preferences.rulerUnits=Units.PIXELS;app.displayDialogs=DialogModes.NO;
 try{
  var original=app.open(source),doc=original.duplicate('Hrudhi Explorer Warm - original-art source');original.close(SaveOptions.DONOTSAVECHANGES);app.activeDocument=doc;
  var master=doc.activeLayer,width=doc.width.as('px'),height=doc.height.as('px'),scaleX=width/320,scaleY=height/480;
  var puppet=doc.layerSets.add();puppet.name='+Hrudhi';var body=puppet.layerSets.add();body.name='Body';var head=puppet.layerSets.add();head.name='Head';
  function scaled(points){var a=[];for(var i=0;i<points.length;i++)a.push([points[i][0]*scaleX,points[i][1]*scaleY]);return a;}
  function rect(x0,y0,x1,y1){return [[x0,y0],[x1,y0],[x1,y1],[x0,y1]];}
  function select(points,mode){doc.selection.select(scaled(points),mode||SelectionType.REPLACE,0,true);}
  function part(name,group,keep,intersect,remove){stage='part '+name;var layer=master.duplicate();layer.name=name;doc.activeLayer=layer;layer.visible=true;
   if(!(keep.length===4&&keep[0][0]===0&&keep[0][1]===0&&keep[2][0]===320&&keep[2][1]===480&&!intersect)){select(keep);if(intersect)select(intersect,SelectionType.INTERSECT);doc.selection.invert();doc.selection.clear();}doc.selection.deselect();
   if(remove)for(var i=0;i<remove.length;i++){select(remove[i]);doc.selection.clear();doc.selection.deselect();}
   layer.move(group,ElementPlacement.INSIDE);return layer;}
  var cuts=[spec.head,spec.arms[0],spec.arms[1],spec.legs[0],spec.legs[1]];
  part('Torso',body,rect(0,0,320,480),null,cuts);
  for(var side=0;side<2;side++){
   // Anatomical names: viewer-left is Hrudhi's right.
   var label=side===0?'Right':'Left',arm=body.layerSets.add();arm.name=label+' Arm';
   part(label+' Upper Arm',arm,spec.arms[side],rect(0,0,320,spec.elbows[side]+4));
   part(label+' Forearm',arm,spec.arms[side],rect(0,spec.elbows[side]-4,320,spec.wrists[side]+5));
   part(label+' Hand',arm,spec.arms[side],rect(0,spec.wrists[side]-5,320,480));
   var leg=body.layerSets.add();leg.name=label+' Leg';
   part(label+' Thigh',leg,spec.legs[side],rect(0,0,320,spec.knee+4));
   part(label+' Shin',leg,spec.legs[side],rect(0,spec.knee-4,320,spec.ankle+4));
   part(label+' Foot',leg,spec.legs[side],rect(0,spec.ankle-4,320,480));
  }
  part('Original Face and Hair - unchanged pixels',head,spec.head);master.remove();doc.selection.deselect();
  var psd=new PhotoshopSaveOptions();psd.layers=true;psd.alphaChannels=true;psd.embedColorProfile=true;doc.saveAs(destination,psd,false,Extension.LOWERCASE);
  var png=new PNGSaveOptions();doc.saveAs(File(out+'/Hrudhi-explorer-warm-source-v1-composite.png'),png,true,Extension.LOWERCASE);
  var log=File(out+'/source-build-result.json');log.open('w');log.write('{"identity":"hrudhi-original-v1","chapter":"explorer","season":"warm","sourceUnchanged":true,"nativePSD":"Hrudhi-explorer-warm-source-v1.psd","layeredSourceOnly":true,"characterAnimatorRigVerified":false}');log.close();
 }catch(error){var failure=File(out+'/source-build-error.txt');failure.open('w');failure.write(stage+'\n'+error.toString());failure.close();throw error;}finally{app.preferences.rulerUnits=previousUnits;app.displayDialogs=previousDialogs;}
})();

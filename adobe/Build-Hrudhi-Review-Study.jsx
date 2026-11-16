#target photoshop
(function(){
 var folder=File($.fileName).parent,out=Folder(folder+'/output'),source=File(out+'/Hrudhi-explorer-warm-source-v1.psd'),target=File(out+'/Hrudhi-explorer-warm-expression-study-v4.psd');
 if(target.exists)throw Error('Refusing to overwrite an expression study.');
 var savedDialogs=app.displayDialogs,units=app.preferences.rulerUnits;app.displayDialogs=DialogModes.NO;app.preferences.rulerUnits=Units.PIXELS;
 try{
 var original=app.open(source),doc=original.duplicate('Hrudhi - original-feature expression study'),head=doc.layerSets.getByName('+Hrudhi').layerSets.getByName('Head'),master=head.artLayers[0];
 master.name='Original identity - untouched';master.visible=false;
 var root=doc.layerSets.getByName('+Hrudhi');
 var raw=app.open(File(folder.parent+'/public/assets/hrudhi/references/explorer-warm.png'));var temp=raw.activeLayer.duplicate(doc,ElementPlacement.PLACEATBEGINNING);raw.close(SaveOptions.DONOTSAVECHANGES);app.activeDocument=doc;doc.activeLayer=temp;
 var subject=new ActionDescriptor();subject.putBoolean(stringIDToTypeID('sampleAllLayers'),false);executeAction(stringIDToTypeID('autoCutout'),subject,DialogModes.NO);temp.remove();doc.activeLayer=root;
 var mask=new ActionDescriptor();mask.putClass(charIDToTypeID('Nw  '),charIDToTypeID('Chnl'));var maskAt=new ActionReference();maskAt.putEnumerated(charIDToTypeID('Chnl'),charIDToTypeID('Chnl'),charIDToTypeID('Msk '));mask.putReference(charIDToTypeID('At  '),maskAt);mask.putEnumerated(charIDToTypeID('Usng'),charIDToTypeID('UsrM'),charIDToTypeID('RvlS'));executeAction(charIDToTypeID('Mk  '),mask,DialogModes.NO);doc.selection.deselect();
 var states=head.layerSets.add();states.name='Expression studies - review required';
 function activate(layer){var r=new ActionReference();r.putIdentifier(charIDToTypeID('Lyr '),layer.id);var d=new ActionDescriptor();d.putReference(charIDToTypeID('null'),r);d.putBoolean(charIDToTypeID('MkVs'),false);executeAction(charIDToTypeID('slct'),d,DialogModes.NO);}
 function select(poly,feather){doc.selection.select(poly,SelectionType.REPLACE);if(feather)doc.selection.feather(feather);}
 function keep(layer,poly){activate(layer);select(poly,3);doc.selection.invert();doc.selection.clear();doc.selection.deselect();}
 function feature(group,base,label,poly,sx,sy,dx,dy,angle){
  var piece=master.duplicate(group,ElementPlacement.INSIDE);piece.visible=true;piece.name=label+' - original pixels';keep(piece,poly);
  piece.visible=false;base.visible=true;group.visible=true;activate(base);select(poly,3);
  doc.selection.deselect();var samplePoint=label.indexOf('eyebrow')>=0?(label.indexOf('right')>=0?[580,196]:[483,235]):[560,343];var sampler=doc.colorSamplers.add(samplePoint);var skin=new SolidColor();skin.rgb.red=sampler.color.rgb.red;skin.rgb.green=sampler.color.rgb.green;skin.rgb.blue=sampler.color.rgb.blue;sampler.remove();select(poly,0);doc.selection.expand(label.indexOf('eyebrow')>=0?7:3);doc.selection.feather(label.indexOf('eyebrow')>=0?3:2);doc.selection.fill(skin,ColorBlendMode.NORMAL,100,false);doc.selection.deselect();
  piece.visible=true;activate(piece);if(sx!==100||sy!==100)piece.resize(sx,sy,AnchorPosition.MIDDLECENTER);if(angle)piece.rotate(angle,AnchorPosition.MIDDLECENTER);piece.translate(dx,dy);
 }
 var mouth=[[519,316],[545,308],[576,297],[597,284],[607,299],[585,323],[550,334],[519,331]];
 var browL=[[440,225],[473,202],[506,199],[511,216],[476,222],[449,244]];
 var browR=[[551,174],[579,164],[607,174],[608,190],[578,182],[554,191]];
 var plans=[{name:'Neutral',mods:[]},{name:'Happy',mods:[['Smile',mouth,112,114,-1,-1,0]]},{name:'Curious',mods:[['Raised right eyebrow',browR,100,100,0,-10,-4]]},{name:'Thoughtful',mods:[['Quiet smile',mouth,86,78,1,2,0],['Questioning left eyebrow',browL,100,100,0,-5,4]]}];
 for(var i=0;i<plans.length;i++){
  for(var j=0;j<states.layerSets.length;j++)states.layerSets[j].visible=false;
  var g=states.layerSets.add();g.name=plans[i].name;g.visible=true;states.visible=true;head.visible=true;var base=master.duplicate(g,ElementPlacement.INSIDE);base.name='Original face with local feature cleanup';base.visible=true;
  for(var k=0;k<plans[i].mods.length;k++){var a=plans[i].mods[k];feature(g,base,a[0],a[1],a[2],a[3],a[4],a[5],a[6]);}
  doc.saveAs(File(out+'/Hrudhi-expression-'+plans[i].name.toLowerCase()+'-v4.png'),new PNGSaveOptions(),true,Extension.LOWERCASE);var crop=doc.duplicate('Face review');crop.crop([355,125,650,390]);crop.saveAs(File(out+'/Hrudhi-face-'+plans[i].name.toLowerCase()+'-v4.png'),new PNGSaveOptions(),true,Extension.LOWERCASE);crop.close(SaveOptions.DONOTSAVECHANGES);app.activeDocument=doc;
 }
 for(var n=0;n<states.layerSets.length;n++)states.layerSets[n].visible=states.layerSets[n].name==='Neutral';
 var opts=new PhotoshopSaveOptions();opts.layers=true;opts.embedColorProfile=true;doc.saveAs(target,opts,false,Extension.LOWERCASE);
 var result=File(out+'/expression-study-v4-result.txt');result.open('w');result.write('Saved native Photoshop expression study: Neutral, Happy, Curious, Thoughtful. Local original-feature transformations; artistic review required.');result.close();
 }finally{app.preferences.rulerUnits=units;app.displayDialogs=savedDialogs;}
})();

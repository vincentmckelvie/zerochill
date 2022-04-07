import {
  Object3D,
  MeshStandardMaterial,
  Mesh,
  Scene,
  Color
} from 'three';
import { Skin } from './Skin.js';
import { Swatches } from './Swatches.js';

class SkinsHandler {
  //{shootCooldown:shootCooldown, bullet:bullet};
  constructor(OBJ) {
    const self = this;
    this.swatches = new Swatches({});
    this.skin = new Skin({});
    this.doms = [];
    this.meshes = [];
    this.parentDom = document.getElementById("player-skins");
    let c = "skins-non-interactive";
    if(window.logged.in){
      c = "skins-interactive";
    }
    
    this.parentDom.className = c;

    for(let i = 0; i<this.swatches.arr.length; i++){
        this.doms.push(new SkinsDom({
          index:i, 
          character:this.swatches.arr[i].name, 
          arr:this.swatches.arr[i].swatches, 
          logged:window.logged.in, 
          parent:this.parentDom
        }))     
    }

  }

  changeSwatch(OBJ){
    //if(OBJ.character == )
    //get
    this.changeSwatchOnMesh( this.getSendObj(OBJ), OBJ.swatch );
    //console.log("heyyyyyyyyyy")
    //console.log(OBJ)
  }

  addMeshes(OBJ){
    this.meshes.push(OBJ);
  }

  getSendObj(OBJ){
    console.log(OBJ.character)
    for(let i = 0;i<this.meshes.length; i++){
      if(this.meshes[i].name == OBJ.character)
        return this.meshes[i];
    }
  }

  playerSelectSwitchCharacter(OBJ){
    console.log(OBJ)
    const dom = this.getDomFromName(OBJ.class);
    console.log(dom)
    if(dom!=null){
      this.hideAllParentDoms();
      dom.toggleVis(true);
    }

  }

  hideAllParentDoms(){
    for(let i =0;i<this.doms.length;i++){
      this.doms[i].toggleVis(false);
    }
  }
  getDomFromName(className){
    for(let i = 0; i < this.doms.length; i++){
      if(className == this.doms[i].character){
        return this.doms[i];
      }
    }
    return null;
  }

  changeSwatchOnMesh(OBJ, swatch){
    //this.swatchObj = OBJ.swatches.getSwatchByName(OBJ.character, OBJ.name);
    const self = this;

    const swatchObj = this.swatches.getSwatchByName(OBJ.name, swatch);

    for(let i = 0; i<OBJ.meshes.length; i++){
      OBJ.meshes[i].traverse( function ( obj ) {
        if(obj.isMesh || obj.isSkinnedMesh){
       
          if(obj.material !=null ){
            const newColor = self.swatches.checkIfMaterialMatchesSwatch(obj.material.name, swatchObj.array);
            
            if( newColor != null ){
              obj.material.color.set("#"+newColor.color);
              obj.material.emissive.set("#"+newColor.emissive);
            }

          }
        }

      });
    }
  }

}

export { SkinsHandler };


class SkinsDom{

  constructor(OBJ){
    const self = this;
    this.buttons = [];
    this.parent = document.createElement("div");
    if(OBJ.index != 0){
      this.parent.style.display = "none";
    }

    OBJ.parent.append(this.parent);
    
    this.character = OBJ.character;

    for(let i = 0;i<OBJ.arr.length; i++){
      const btn = document.createElement("div");
      btn.className = "swatch-btn";
      btn.style.backgroundColor = OBJ.arr[i].icon;
      this.parent.append(btn);
      const swatch = OBJ.arr[i].name;
      const index = i;
      if(index == 0 && OBJ.index == 0){
        btn.className = "swatch-btn-active"
      }
      //if(OBJ.logged){
        
        btn.addEventListener("click", function(){
          appGlobal.skinsHandler.changeSwatch({ swatch:swatch, character:self.character });
          self.makeAllButtonsNonActive();
          btn.className = "swatch-btn-active";
        });
        this.buttons.push(btn);
      //}
    }
    
  }
  toggleVis(show){
    if(!show){
      this.parent.style.display = "none";
    }else{
      this.parent.style.display = "block";
    }
  }
  makeAllButtonsNonActive(){
    for(let i = 0; i<this.buttons.length; i++){
      this.buttons[i].className="swatch-btn";
    }
  }

}
import {
  Vector2
} from './build/three.module.js';

class Mobile {
  //{shootCooldown:shootCooldown, bullet:bullet};
  constructor(OBJ) {
    const self = this;
    this.canBeMobile = true;
    this.initedSettings = false;
    this.isMobile = ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) || (/Macintosh/.test(navigator.userAgent) && 'ontouchend' in document);
    // this.isMobile 
    // //const isMobile = ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) );
    this.pointerPositions = [];
    this.pointers = [];
    // this.isTouch = self.isTouchEnabled();
    this.dom = appGlobal.scene.renderer.domElement;
    this.initedDom = false;
    this.runBtn;
    this.mobileAbilityEBtn;
    this.mobileAbilityQBtn;
    this.rotateBtn;
    this.shootBtn;
    this.reloadBtn;
    this.jumpBtn;
    this.adsBtn;
    this.btns = [];
    this.axis = new Vector2();
    this.dom.addEventListener( 'pointermove', function(event){
      for(let i = 0; i<self.btns.length; i++){
        if(self.btns[i].currPointerId == event.pointerId){
          self.mobileButtonMove({ 
            id:self.btns[i].id, 
            x:event.clientX, 
            y:event.clientY,
            dp: new Vector2().set(self.btns[i].x+self.btns[i].width/2, self.btns[i].y+self.btns[i].height/2), 
          })
        }
      } 
    });
    this.dom.addEventListener( 'pointerup', function(event){
 
      for(let i = 0; i<self.btns.length; i++){
        if(self.btns[i].currPointerId == event.pointerId){         
          self.mobileButtonUp({ id:self.btns[i].id })
          self.btns[i].handleUp();
        }
      } 
    });
    this.dom.addEventListener( 'pointerdown', function(event){

      if(appGlobal.playing){
        for(let i = 0; i<self.btns.length; i++){
          if(self.btns[i].checkHit({x:event.clientX, y:event.clientY})){
            self.mobileButtonDown({ 
              id:self.btns[i].id,
              dp: new Vector2().set(self.btns[i].x+self.btns[i].width/2, self.btns[i].y+self.btns[i].height/2),
              x:event.clientX, 
              y:event.clientY 
            })
            self.btns[i].handleDown({pointerId: event.pointerId});
            //self.mobileButtonUp({ id:self.btns[i].id })
          }
        } 
      }
    });

    this.moving = new PressDrag({})
    this.rotating = new PressDrag({})
    this.shooting = new PressDrag({})
    this.adsing = false;
    this.ability1 = false;
    this.ability2 = false;
    this.reload = false;
    this.boost = false;
    this.jump = false;
    //this.running = true; 
    
    this.mobileInit = false;

  }

  initDom(){

    const self = this;
    if(!this.initedDom){

      this.initedDom = true;
      this.runBtn            = new MobileButton({parent:self, id:"mobile-run-bottom"  });
      this.mobileAbilityEBtn = new MobileButton({parent:self, id:"mobile-ability-e"   })
      this.mobileAbilityQBtn = new MobileButton({parent:self, id:"mobile-ability-q"   })
      this.rotateBtn         = new MobileButton({parent:self, id:"mobile-rotate"      })
      this.shootBtn          = new MobileButton({parent:self, id:"mobile-shoot"       })
      this.reloadBtn         = new MobileButton({parent:self, id:"mobile-reload"      })
      this.adsBtn            = new MobileButton({parent:self, id:"mobile-ads"         })
      this.jumpBtn           = new MobileButton({parent:self, id:"mobile-jump"        })
      
      this.btns.push(
        this.runBtn, 
        this.mobileAbilityEBtn, 
        this.mobileAbilityQBtn, 
        this.rotateBtn,
        this.jumpBtn,
        this.adsBtn,
        this.shootBtn,
        this.reloadBtn
      );
    }
  }

  mobileButtonDown(OBJ){
    switch(OBJ.id){
      case "mobile-run-bottom":
        this.moving.down = true;
        this.moving.downPos.x = OBJ.x;
        this.moving.downPos.y = OBJ.y;
      break;
      // case "mobile-boost"     :
      // break;
      case "mobile-ability-e" :
        this.ability1 = true;
      break;
      case "mobile-ability-q" :
        this.ability2 = true;
      break;
      case "mobile-reload" :
        this.reload = true;
      break;
      case "mobile-jump" :
        this.jump = true;
      break;
      case "mobile-ads" :
        this.adsing = !this.adsing;
        console.log("mobile-ads");
      break;
      case "mobile-rotate"    :
        this.rotating.down = true;
        this.rotating.downPos.x = OBJ.dp.x;
        this.rotating.downPos.y = OBJ.dp.y;
        this.rotating.prevPos.x = OBJ.x;
        this.rotating.prevPos.y = OBJ.y;
      break;
      case "mobile-shoot"     :
        this.shooting.down = true;
        this.shooting.downPos.x = OBJ.dp.x;
        this.shooting.downPos.y = OBJ.dp.y;
        this.shooting.prevPos.x = OBJ.x;
        this.shooting.prevPos.y = OBJ.y;
      break;
    }
  }

  mobileButtonUp(OBJ){
    switch(OBJ.id){
      case "mobile-run-bottom":

        this.moving.down = false;
        this.moving.axisX = 0;
        this.moving.axisY = 0;
        this.boost = false;
      break;
      // case "mobile-boost"     :
      // break;
      case "mobile-ability-e" :
        this.ability1 = false;
      break;
      case "mobile-ability-q" :
        this.ability2 = false;
      break;
      case "mobile-reload" :
        this.reload = false;
      break;
      case "mobile-ads" :
        //this.jump = false;
      break;
      case "mobile-jump" :
        this.jump = false;
      break;
      case "mobile-rotate"    :
        this.rotating.down = false;
        this.rotating.axisX = 0;
        this.rotating.axisY = 0;
      break;
      case "mobile-shoot"     :
        this.shooting.down = false;
        this.shooting.axisX = 0;
        this.shooting.axisY = 0;
      break;
    }
  }

  mobileButtonMove(OBJ){
    let dx  = 0;
    let dy = 0;
    let angle = 0;
    const sens = .8;
    switch(OBJ.id){
      case "mobile-run-bottom":
        dx = (OBJ.x - OBJ.dp.x)*.014;
        dy = (OBJ.y - OBJ.dp.y)*.014;
        
        if(dy < -1){
          this.boost = true;
        }else{
          this.boost = false;
        }

        if(dx>1)dx = 1;
        if(dx<-1)dx = -1;
        if(dy>1)dy = 1;
        if(dy<-1)dy = -1;
        this.moving.axisX = dx;
        this.moving.axisY = dy;
        
      break;
    
      case "mobile-ability-e" :
      break;
      case "mobile-ability-q" :
      break;
      case "mobile-rotate"    :
        
        dx = OBJ.x;
        dy = OBJ.y;

        this.rotating.targPos.x = (dx-this.rotating.prevPos.x)*sens;//Math.sin(angle)*-1;
        this.rotating.targPos.y = (dy-this.rotating.prevPos.y)*sens;//Math.cos(angle); 
        
        this.rotating.prevPos.x = dx;
        this.rotating.prevPos.y = dy;
        
      break;
      case "mobile-shoot"     :
        dx = OBJ.x;
        dy = OBJ.y;
        this.shooting.axisX = (dx-this.shooting.prevPos.x)*sens;
        this.shooting.axisY = (dy-this.shooting.prevPos.y)*sens;
        this.shooting.prevPos.x = dx;
        this.shooting.prevPos.y = dy;
      break;
    }
  }

  update(){
    if(this.isMobile){
      
      if(window.innerWidth<window.innerHeight){
        document.getElementById("mobile-rotate-msg").style.display = "block";
      }else{
        document.getElementById("mobile-rotate-msg").style.display = "none";
      }

      this.updateMobile();
      const ez = 120;
      this.rotating.axisX += (this.rotating.targPos.x-this.rotating.axisX)*(appGlobal.deltaTime)*ez;
      this.rotating.axisY += (this.rotating.targPos.y-this.rotating.axisY)*(appGlobal.deltaTime)*ez;
      this.shooting.axisX  +=      (this.shooting.targPos.x-this.shooting.axisX)*(appGlobal.deltaTime)*ez;
      this.shooting.axisY  +=      (this.shooting.targPos.y-this.shooting.axisY)*(appGlobal.deltaTime)*ez;
      this.rotating.targPos.x = 0;
      this.rotating.targPos.y = 0;
      this.shooting.targPos.x = 0;        
      this.shooting.targPos.y = 0;
      
    }
  }

  updateMobile(){

    // const gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    // if (!gamepads)
    //   return;
    
    // const gp = gamepads[0];
    // if(gp!=null){
    //    if(!this.initedSettings){
    //     appGlobal.settings.updateGamePad(true);
    //     this.initedSettings = true;
    //   }
      if(appGlobal.localPlayer != null){
        const rot = new Vector2().set(this.rotating.axisX, this.rotating.axisY);
        if(this.shooting.down){
          rot.set(this.shooting.axisX, this.shooting.axisY)
        }
        //console.log(this.adsing)
        appGlobal.localPlayer.handleGamePad({

          xaxis:this.parseAxes(this.moving.axisX*1), 
          yaxis:this.parseAxes(this.moving.axisY*1), 
          jump:this.jump,
          boost:this.boost,
          reload:this.reload,
          mx:rot.x,
          my:rot.y,
          ads:this.adsing,
          shoot:this.shooting.down,
          ability1:this.ability1,
          ability2:this.ability2,
          w:this.axesToKeyPress(this.moving.axisY, false),
          s:this.axesToKeyPress(this.moving.axisY, true),
          a:this.axesToKeyPress(this.moving.axisX, false),
          d:this.axesToKeyPress(this.moving.axisX, true),

        })
      }
    //   }else{
    //     if(this.buttonPressed(gp.buttons[0])){
    //       appGlobal.globalHelperFunctions.handleInitPlaying();  
    //     }
    //   }
    //   //console.log(this.b)
    // }

  }

  parseAxes(val){
    if(Math.abs(val) <.2)
      return 0;
    else
      return val;
  }

  axesToKeyPress(val, pos){
    if(pos){
      if(val>.6)
        return true;
      else
        return false;  
    }else{
      if(val<-.6)
        return true;
      else
        return false;
    }
  }

  buttonPressed(b){

    // if (typeof(b) == "object") {
    //   return b.pressed;
    // }
    // return false;
    return false;

  }

  getButtonById(id){
    for(let i = 0; i < this.btns.length; i++){
      if(this.btns[i].id == id){
        return this.btns[i];
      }
    }
  }

  // gamepadHandler(event, connecting) {
  //   //const gamepad = event.gamepad;
  //   //this.gpIndex = gamepad.index;
  //   //if (connecting) {
  //   //  this.gamepads[this.gpIndex] = gamepad;
  //   //} else {
  //   //  delete gamepads[gamepad.index];
  //   //}
  //   //this.gamePad = navigator.getGamepads()[0];
  // }

}

export { Mobile };

class MobileButton{
  constructor(OBJ){
    const self = this;
    this.parent = OBJ.parent;
    this.id = OBJ.id;
    this.down = false;
    this.currPointerId = -1;
    this.dom = document.getElementById(this.id);
    this.x = this.dom.getBoundingClientRect().x;
    this.y = this.dom.getBoundingClientRect().y;
    this.width = this.dom.getBoundingClientRect().width;
    this.height = this.dom.getBoundingClientRect().height;
  
    //console.log( this.dom.getBoundingClientRect().height ) 
    //this.x = this.dom.
    // document.getElementById(this.id).addEventListener("pointerdown", function(event){
    //   self.currPointerId = event.pointerId;
    //   console.log(self.currPointerId)
    //   self.down = true;
    //   self.parent.mobileButtonPress({id:self.id});
    // });


    // document.getElementById(this.id).addEventListener( 'pointerup', function(event){
    //   console.log(self.id);
    //   self.up = false;
    //   self.parent.mobileButtonUp(self.id);
    // } );

    // document.getElementById(this.id).addEventListener( 'pointercancel', function(event){
    //   console.log(self.id);
    //   self.up = false;
    //   self.parent.mobileButtonUp(self.id);
    // } );
    
  }
  
  handleDown(OBJ){
    this.down = true;
    this.currPointerId = OBJ.pointerId;
  }

  handleUp(){
    this.down = false;
    this.currPointerId = -1;//OBJ.pointerId;
  }
  checkHit(OBJ){
    if(OBJ.x > this.x && OBJ.x < this.x+this.width && 
       OBJ.y > this.y && OBJ.y < this.y+this.height
    ){
      return true;
    }
    return false;
  }
}

class PressDrag{
  constructor(OBJ){
    this.down = false;
    this.downPos = new Vector2();
    this.axisX = 0;
    this.axisY = 0;
    this.prevPos = new Vector2();
    this.targPos = new Vector2();

  }
}
import {
	Object3D,
	SphereGeometry,
	MeshStandardMaterial,
	Mesh,
	Vector3,
	Quaternion,
	Sphere,
	AnimationObjectGroup,
	AnimationMixer,
	LoopOnce
} from './build/three.module.js';
import { clone } from "./scripts/jsm/utils/SkeletonUtils.js";
import { WeaponEmissiveHandler } from "./WeaponEmissiveHandler.js";

class FPSAni {
	//{aliveTime:aliveTime, bullet:bullet};
	constructor(OBJ) {
		this.contains = [ 
			"forarm-l",
			"hand-l", 
			"middle-l-0", 
			"middle-l-1", 
			"middle-l-2",
			"index-l-0", 
			"index-l-1", 
			"index-l-2",
			"thumb-l-0", 
			"thumb-l-1", 
			"thumb-l-2",
		];
		const self = this;
		const model = self.getModelByName("fps-"+OBJ.model);
	
		this.weaponName = OBJ.name;
		this.mesh = clone( model.scene );

		// const ar=[];
		// this.mesh.traverse( function ( obj ) {

	 //        if(obj.isMesh || obj.isSkinnedMesh){
	 //          if(obj.material !=null ){
	 //          	if(!self.checkIsInArr(ar, obj.material.name)){
	 //          		ar.push(obj.material.name);
		// 			console.log("{");
		// 			console.log("name:'"+obj.material.name+"',");
		// 			console.log("color:'"+obj.material.color.getHexString()+"',");
		// 			console.log("emissive:'"+obj.material.emissive.getHexString ()+"'");
		// 			console.log("}");
	 //            }
	 //          }
	 //        }

  //     	});
		
		appGlobal.controller.playerCamera.add(this.mesh);

		this.mesh.position.z -= 0;
		this.animations = model.animations;
		
		
		this.flock = new AnimationObjectGroup;
		this.flock.add(this.mesh);
		this.mixer = new AnimationMixer(this.flock);
		
		const throwAni = self.getModelByName("fps-throw").animations[0];
		
		const idleAniL = self.getAniByName(this.animations, "idle").clone();
		const adsAniL =  self.getAniByName(this.animations, "ads" ).clone();
		const runAniL =  self.getAniByName(this.animations, "run" ).clone();
		
		const idleAniR = self.getAniByName(this.animations, "idle").clone();
		const adsAniR =  self.getAniByName(this.animations, "ads" ).clone();
		const runAniR =  self.getAniByName(this.animations, "run" ).clone();
		
		this.parseAnimation(throwAni, false);
		this.parseAnimation(idleAniL, false);
		this.parseAnimation(adsAniL, false);
		this.parseAnimation(runAniL, false);
		
		this.parseAnimation(idleAniR, true);
		this.parseAnimation(adsAniR, true);
		this.parseAnimation(runAniR, true);

		this.throwL =this.mixer.clipAction( throwAni );
		this.idleR = this.mixer.clipAction(idleAniR);
		this.adsR =  this.mixer.clipAction(adsAniR);
		this.runR =  this.mixer.clipAction(runAniR);
		this.idleL = this.mixer.clipAction(idleAniL);
		this.adsL =  this.mixer.clipAction(adsAniL);
		this.runL =  this.mixer.clipAction(runAniL);
		
		this.idleL.play();
		this.adsL.play();
		this.runL.play();
		this.idleR.play();
		this.adsR.play();
		this.runR.play();
		this.throwL.loop = LoopOnce;
		
		this.mixer.addEventListener( 'finished', function( e ) { 
			self.throwing = false;
			self.throwL.stop();
		} );

		this.inc = 0;
		
		this.mesh.rotation.y += Math.PI;
		this.idleL.weight = this.idleR.weight = 1;
		this.adsL.weight = this.adsR.weight = 0;
		this.runL.weight = this.runR.weight = 0;
		
		this.deltaMult = 4;
		this.idleTarg = 1;
		this.adsTarg = 0;
		this.rotTarg = new Vector3();
		const skin =  appGlobal.skinsHandler.getCurrentSkinOnCharacter(OBJ.model);
		appGlobal.skinsHandler.changeSwatchOnMesh({meshes:[this.mesh], name:OBJ.model}, skin);

		const emissive = self.getMaterialByName("emissive", this.mesh);
		const blast = self.getMaterialByName("blast", this.mesh);
		//let name = "tip";
		//if(OBJ.model == "sniper" || OBJ.model == "sixgun" || OBJ.model == "launcher" || OBJ.model == "submachine")
		let name = "tip-"+OBJ.model;
		this.tipObject = this.mesh.getObjectByName(name);
		this.handL = this.mesh.getObjectByName("hand-l");
		this.tipPosition = new Vector3(); 
		this.boosting = false;
		this.boostTarg = 0;
		
		this.emissiveHelper = new WeaponEmissiveHandler({name:OBJ.model, emissive:emissive, blast:blast, blastModel:this.tipObject, skin:skin});
		
		this.reloading = false;
		this.adsing = false;
		this.player = OBJ.player;
		this.throwing = false;
		this.leftHandPos = new Vector3();
	}

	checkIsInArr(arr,s){
		for(let i = 0; i<arr.length; i++){
			if(arr[i]==s){
				return true;
			}
		}
		return false;
	}

	hide(){
		this.mesh.visible = false;
	}
	show(){
		this.mesh.visible = true;
	}
	throw(){
		const self = this;
		this.throwing = true;
		this.throwL.play();
		// setTimeout(function(){
		// 	self.throwing = false;
		// 	self.throwL.stop();
		// },600)
	}
	update(){
		
		this.handL.getWorldPosition(this.leftHandPos);
		this.tipObject.getWorldPosition(this.tipPosition);
		
		this.emissiveHelper.update();
		
		this.mixer.update(appGlobal.deltaTime*this.deltaMult);
		const ez = 90;
		const ezShoot = 40;
		if(!this.throwing){
			this.idleL.weight +=  (this.idleTarg - this.idleL.weight)   * (ez*appGlobal.deltaTime);	
			this.adsL.weight  +=  (this.adsTarg - this.adsL.weight )   * (ez*appGlobal.deltaTime);
			this.runL.weight  +=  (this.boostTarg - this.runL.weight )   * (ez*appGlobal.deltaTime);	
		}else{
			this.idleL.weight +=  (0 - this.idleL.weight)   * (ez*appGlobal.deltaTime);	
			this.adsL.weight  +=  (0 - this.adsL.weight )   * (ez*appGlobal.deltaTime);
			this.runL.weight  +=  (0 - this.runL.weight )   * (ez*appGlobal.deltaTime);
			this.throwL.weight  +=  (1 - this.runL.weight ) * (ez*appGlobal.deltaTime);
		}
		this.idleR.weight +=  (this.idleTarg - this.idleR.weight)   * (ez*appGlobal.deltaTime);	
		this.adsR.weight  +=  (this.adsTarg - this.adsR.weight )   * (ez*appGlobal.deltaTime);
		this.runR.weight  +=  (this.boostTarg - this.runR.weight )   * (ez*appGlobal.deltaTime);	
		
		if(!this.reloading){
			this.mesh.rotation.x += (0 - this.mesh.rotation.x)       * (ezShoot*appGlobal.deltaTime)
			this.mesh.rotation.y += (Math.PI  - this.mesh.rotation.y)* (ezShoot*appGlobal.deltaTime)
		}
		if(this.boosting && !this.reloading && appGlobal.localPlayer.animationOnFloor){
			let onGround = true;
			this.inc+=(appGlobal.deltaTime*80);
			this.mesh.position.y = Math.sin(this.inc)*.06;
		}else{
			this.mesh.position.y+=(0-this.mesh.position.y)*appGlobal.deltaTime*40
		}
	}

	reloadAnimation(TIME){
		this.emissiveHelper.reload();
		this.reloading = true;
		const self = this;
		gsap.to(this.mesh.rotation,   {duration:TIME/2, /*y:Math.PI,*/ x:-Math.PI*.4, /*z:0 */});
		gsap.to(this.mesh.rotation,   {duration:TIME/2, /*y:Math.PI, */x:0, /*z:0,*/ delay:TIME/2, onComplete:function(){self.reloading = false;}}); 
	}

	shoot(OBJ){
		this.emissiveHelper.shoot(OBJ)
		if(this.adsTarg>0){
			const xRnd = .01+Math.random()*.01;
			this.mesh.rotation.x = xRnd;
			const yRnd = -.01+Math.random()*.02;
			this.mesh.rotation.y = Math.PI+yRnd;
		}else{
			const xRnd = .1+Math.random()*.1;
			this.mesh.rotation.x = xRnd;
			const yRnd = -.1+Math.random()*.1;
			this.mesh.rotation.y = Math.PI+yRnd;
		}
	}

	toggleADS(ADSING){
		this.adsing = ADSING;
		if(!this.boosting){
			if(ADSING){
				this.adsTarg = 1;
				this.idleTarg = 0;
				this.boostTarg = 0;
				if(this.weaponName=="sniper" && !this.player.emoting)
					this.mesh.visible = false;
			}else{
				this.adsTarg = 0;
				this.idleTarg = 1;
				this.boostTarg = 0;
				if(this.weaponName=="sniper" && !this.player.emoting)
					this.mesh.visible = true;
			}
		}
	}
	toggleBoost(BOOST){
		this.boosting = BOOST;
		if(BOOST){
			this.adsTarg = 0;
			this.idleTarg = 0;
			this.boostTarg = 1;
		}else{
			if(this.adsing){
				this.adsTarg = 1;
				this.idleTarg = 0;
				if(this.weaponName=="sniper" && !this.player.emoting)
					this.mesh.visible = false;
			}else{ 
				this.adsTarg = 0;
				this.idleTarg = 1;
				if(this.weaponName=="sniper" && !this.player.emoting)
					this.mesh.visible = true;
			}
			this.boostTarg = 0;
		}
	}
	getMaterialByName(NAME, MESH){
		let mat;
		MESH.traverse( function( object ) {
			if(object.isMesh){
				object.frustumCulled = false;
			}
    		if ( object.material ) {
    			if(object.material.name == NAME){
    				mat = object.material;
    			}
    		}

		} );

		return mat;
	}
	getModelByName(NAME){
		for(let i = 0; i<appGlobal.loadObjs.length;i++){
			if(appGlobal.loadObjs[i].name==NAME)
				return appGlobal.loadObjs[i].model;	
		}
		
	}
	getAniByName(anis, name){
		for(let i = 0; i<anis.length; i++){
			let text = anis[i].name;
			let result = text.includes(name);
			if(result)
				return anis[i];
		}
	}

	parseAnimation( animation, left ) {

	  const hierarchyTracks = animation.tracks;
	  for ( let h = 0; h < hierarchyTracks.length; h ++ ) {
	    const split = hierarchyTracks[h].name.split('.');
	    const check = this.checkContainsAniName(this.contains, split[0]);
	    if(left){
	      if(check){
	        hierarchyTracks.splice(h, 1);
	        h--; 
	      }
	    }else{
	      if(!check){
	        hierarchyTracks.splice(h, 1);
	        h--; 
	      }     
	    }
	  }

	}


	removeAnimationFromBone( animation, name ) {

	  const hierarchyTracks = animation.tracks;
	  for ( let h = 0; h < hierarchyTracks.length; h ++ ) {
	    const split = hierarchyTracks[h].name.split('.');
	    const check = this.checkContainsAniName([name],split[0]);
	    if(check){
	      hierarchyTracks.splice(h, 1);
	      h--; 
	    }
	  }

	}

	checkContainsAniName(array, aniName){
  
	  for(var i = 0; i<array.length;i++){
	    if(aniName.includes(array[i])){
	      return true;
	    }
	  }
	  return false;
	}


	kill(){
		appGlobal.globalHelperFunctions.tearDownObject(this.mesh);
		appGlobal.controller.playerCamera.remove(this.mesh);
		this.emissiveHelper.kill();
	}

}

export { FPSAni };

import {
	Object3D,
	CylinderGeometry,
	MeshStandardMaterial,
	Mesh,
	Vector3,
	Quaternion,
	Sphere,
	Vector2
} from './build/three.module.js';
import { Abilities } from './Abilities.js';
import { AbilityBullet } from './AbilityBullet.js';
import { JumpPad } from './JumpPad.js';

class AbilityJumpPad extends Abilities {
	// {
	// 	type:"hold",//"press"
	//	hasCooldown:false
	//	cooldown:8000,
	//  key:"ShiftLeft"//"KeyE"
	// }
	constructor(OBJ) {
		super(OBJ);
		this.arr = [];
		this.throw;
		this.jumpPad;
		this.worldPos = new Vector3();
		this.id;

	}
	
	init(){
		super.init(this);
	}
	update(){
		super.update();
	}
	
	updateLooped(){
		super.updateLooped();
		if(this.throw){
			if(!this.throw.killed){
				this.throw.update();
			}else{
				
				const pos = new Vector3().copy(this.throw.collider.center);
				const dist = appGlobal.globalHelperFunctions.getDistanceForSound(pos);
    			appGlobal.soundHandler.playSoundByName({name:"jump-pad-land", dist:dist});
    			const jumpPadObj = {worldPosition:this.throw.world.collider.center, position:this.throw.collider.center};
				this.jumpPad = new JumpPad(jumpPadObj) 
				if(window.socket!=null){
					socket.emit('abilityVisual', {
						id: socket.id,
						abilityName:"jumppad land",
						position:this.throw.collider.center,
						sound:"jump-pad-land",
						extras:jumpPadObj
					});
				}

			}
		}

		if(this.jumpPad){
			if(!this.jumpPad.killed){
				this.jumpPad.update();	
				this.throw = null;	
			}
		}
			 	
	}
	
	doAbility(){
		if(appGlobal.localPlayer!=null){
			const self = this;
			if(!appGlobal.localPlayer.emoting){
				appGlobal.localPlayer.fps.throw();
			}else{
				appGlobal.localPlayer.throw();
			}
			//appGlobal.soundHandler.playSoundByName({name:"nade", dist:1});
			setTimeout(function(){
				if(this.throw == null)
					self.throwHelper();
			},200);
			
		}
		super.confirmAbility();
	}

	throwHelper(){
		if(appGlobal.localPlayer!=null){

			this.id = appGlobal.localPlayer.id;
			this.worldPos.copy(appGlobal.world.worldPosition);
			const dir = new Vector3();
			appGlobal.localPlayer.camera.getWorldDirection( dir );
					
			//if(this.player.adsing){
			const rndMult = .01;
			//}
			const r = .3;
			const rx = ((-r*.5)+Math.random()*r)*rndMult;
			const ry = ((-r*.5)+Math.random()*r)*rndMult;
			const rz = ((-r*.5)+Math.random()*r)*rndMult;
			const rnd = new Vector3().set( rx,ry,rz );
			dir.add(rnd);
			dir.multiplyScalar(.5);
			
			const pos = appGlobal.localPlayer.fps.leftHandPos;
			if(appGlobal.localPlayer.emoting){
				pos.copy(appGlobal.localPlayer.tipPositionFinal);
			}

			const kp = {
				pos:new Vector3(), 
				distance:10, 
				strength:40, 
				gravMult:4
			}

			const obj = {
				pos:pos,
				impulse:60,
				dir:dir,
				knockParams:kp,
				damage:60,
				id:this.id,
				worldPosition:this.worldPos,
			}

			//appGlobal.soundHandler.playSoundByName({name:"nade", dist:1});
			
			if(window.socket !=null ){
				socket.emit('abilityExtras', {
					id: socket.id,
					obj: obj,
					name: "throw"  
				});
			}

			this.throw = new AbilityBullet(obj, true); 
		}
	}

	deactivateAbility(){
		
	}

	kill(){
		super.kill();

	}
	
  	
}

export { AbilityJumpPad };

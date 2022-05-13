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
import { StickyAOE } from './StickyAOE.js';

class AbilitySticky extends Abilities {
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
		this.sticky;
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
				const dist = appGlobal.globalHelperFunctions.getDistanceForSound(this.throw.collider.center);
    			appGlobal.soundHandler.playSoundByName({name:"bliz", dist:dist});

    			const stickyObj = {worldPosition:this.throw.world.collider.center, position:this.throw.collider.center};
				this.sticky = new StickyAOE(stickyObj);
				
				socket.emit('abilityVisual', {
					  id: socket.id,
					  abilityName:"slow land",
					  position:this.throw.collider.center,
					  sound:"bliz",
					  extras:stickyObj
				});
				 
			}
		}

		if(this.sticky){
			if(!this.sticky.killed){
				this.sticky.update();	
				this.throw = null;	
			}
		}
			 	
	}
	
	doAbility(){
		if(appGlobal.localPlayer!=null){
			const self = this;
			appGlobal.localPlayer.fps.throw();
			//appGlobal.soundHandler.playSoundByName({name:"throw", dist:1});
			setTimeout(function(){
				if(self.throw==null)
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
			
			//const cross = new Vector3().crossVectors(appGlobal.localPlayer.grav, dir);
			const pos = new Vector3().copy( appGlobal.localPlayer.playerCollider.end ).addScaledVector( dir, appGlobal.localPlayer.playerCollider.radius * 1.5 );//.add(cross);
			//pos = appGlobal.localPlayer.fps.tipPosition;
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

			
			
			// if(window.socket !=null ){
			// 	socket.emit('shoot', {
			// 		obj: obj,
			// 		id: socket.id,
			// 		name: "jumpPad"
			// 	});
			// }
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
		if(this.throw!=null){
			this.throw.kill();
		}

	}
	
  	
}

export { AbilitySticky };

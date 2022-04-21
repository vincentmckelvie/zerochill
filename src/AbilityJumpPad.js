import {
	Object3D,
	CylinderGeometry,
	MeshStandardMaterial,
	Mesh,
	Vector3,
	Quaternion,
	Sphere,
	Vector2
} from 'three';
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
				super.confirmAbility();
				this.jumpPad = new JumpPad({worldPosition:this.throw.world.collider.center, position:this.throw.collider.center}) 
				this.throw = null;	
			}
		}

		if(this.jumpPad){
			if(!this.jumpPad.killed){
				this.jumpPad.update();	
			}
		}
			 	
	}
	
	doAbility(){
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

			appGlobal.soundHandler.playSoundByName({name:"rocket2", dist:1});
			
			if(window.socket !=null ){
				// socket.emit('shoot', {
				// 	obj: obj,
				// 	id: socket.id,
				// 	name: "jumpPad"
				// });
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

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
import { StickyBullet } from './StickyBullet.js';

class AbilityNade extends Abilities {
	// {
	// 	type:"hold",//"press"
	//	hasCooldown:false
	//	cooldown:8000,
	//  key:"ShiftLeft"//"KeyE"
	// }
	constructor(OBJ) {
		super(OBJ);
		this.arr = [];
		this.firstThrow;
		this.id;
		this.worldPos = new Vector3();
		

	}
	
	init(){

		super.init(this);
	}
	update(){
		super.update();
		if(!this.canDoAbility){ // doing ability

			if(this.firstThrow != null && this.firstThrow.killed){

				for(let i = 0; i<5; i++){
					const dir = new Vector3().copy(this.firstThrow.grav).multiplyScalar(.3);
					
					const rndMult = .5;
					const r = 1;
					const rx = ((-r*.5)+Math.random()*r)*rndMult;
					const ry = ((-r*.5)+Math.random()*r)*rndMult;
					const rz = ((-r*.5)+Math.random()*r)*rndMult;
					const rnd = new Vector3().set( rx,ry,rz );
					dir.add(rnd);
					
					//const cross = new Vector3().crossVectors(appGlobal.localPlayer.grav, dir);
					const pos = new Vector3().copy( this.firstThrow.collider.center );
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
						// 	name: "sticky"
						// });
					}
					const nade = new StickyBullet(obj, true); 
					this.arr.push(nade);

				}

				this.firstThrow = null;

			}

		}
	}
	updateLooped(){
		super.updateLooped();
		

		for(let i = 0; i<this.arr.length; i++){
			this.arr[i].update();
		}
		// if(Math.random()>.96)
		// console.log("cscw "+this.canSetClosestWorld)
			 	
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
				socket.emit('shoot', {
					obj: obj,
					id: socket.id,
					name: "sticky"
				});
			}
			this.firstThrow = new StickyBullet(obj, true); 
			this.arr.push(this.firstThrow);
		}

		
		super.confirmAbility();
	}

	deactivateAbility(){
		
	}

	kill(){
		super.kill();

	}
	
  	
}

export { AbilityNade };

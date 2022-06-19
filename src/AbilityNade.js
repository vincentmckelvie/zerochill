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
				const dist = appGlobal.globalHelperFunctions.getDistanceForSound(this.firstThrow.collider.center);
    			appGlobal.soundHandler.playSoundByName({name:"nade-hit-2", dist:dist});
				for(let i = 0; i<5; i++){
					const dir = new Vector3().copy(this.firstThrow.grav).multiplyScalar(.3);
					
					const rndMult = .5;
					//const rndMult = .01;
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

					//appGlobal.soundHandler.playSoundByName({name:"rocket2", dist:1});
					
					if(window.socket !=null ){
						
						socket.emit('abilityExtras', {
							id: socket.id,
							obj: obj,
							name: "nade-throw"  
						});
				
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
			if(!appGlobal.localPlayer.emoting){
				appGlobal.localPlayer.fps.throw();
			}else{
				appGlobal.localPlayer.throw();
			}
			
			const self = this;
			//appGlobal.soundHandler.playSoundByName({name:"nade", dist:1});
			setTimeout(function(){
				self.throwNadeHelper();
			},200);
		}
		
		super.confirmAbility();
	}

	throwNadeHelper(){
		
		if(appGlobal.localPlayer!=null){
			
			this.id = appGlobal.localPlayer.id;
			this.worldPos.copy(appGlobal.world.worldPosition);
			
			const dir = new Vector3();
			
			//if(!appGlobal.localPlayer.emoting){
			
			appGlobal.localPlayer.camera.getWorldDirection( dir );		
			const rndMult = .01;
			const r = .3;
			const rx = ((-r*.5)+Math.random()*r)*rndMult;
			const ry = ((-r*.5)+Math.random()*r)*rndMult;
			const rz = ((-r*.5)+Math.random()*r)*rndMult;
			const rnd = new Vector3().set( rx,ry,rz );
			
			dir.add(rnd);
			dir.multiplyScalar(.5);

			const pos = new Vector3().copy(appGlobal.localPlayer.fps.leftHandPos);
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

			if(window.socket != null){
				socket.emit('abilityExtras', {
					id: socket.id,
					obj: obj,
					name: "nade-throw"  
				});
			}

			this.firstThrow = new StickyBullet(obj, true); 
			this.arr.push(this.firstThrow);
		}
	}

	// getEmotingDir(){

	// 	const rndMult = 0.01;
				
	// 	const rx = ((-this.adsRandom*.5)+Math.random()*this.adsRandom)*rndMult;
	// 	const ry = ((-this.adsRandom*.5)+Math.random()*this.adsRandom)*rndMult;
	// 	const rz = ((-this.adsRandom*.5)+Math.random()*this.adsRandom)*rndMult;
	// 	const dir = new Vector3().set(rx,ry,rz);

	// 	const pos = new Vector3().copy(this.player.tipPositionFinal);

	// 	let hitPoint = new Vector3();
	// 	let hit = true;
	// 	let distance = 100;
	// 	const newDir = new Vector2( dir.x, dir.y );
	// 	const hsl = this.hitScanHelper({dir:newDir});
		
	// 	hitPoint.copy(hsl.hitPoint);
			
	// 	return new Vector3().copy( hitPoint.sub(pos).normalize() );
				
	// }

	// hitScanHelper(OBJ){
		
	// 	let hitPoint = new Vector3();
	// 	let hitId = null;
	// 	let isHead = false;
	// 	appGlobal.raycaster.setFromCamera( new Vector2(OBJ.dir.x,OBJ.dir.y), appGlobal.controller.playerCamera );
	// 	const intersection = appGlobal.raycaster.intersectObjects( appGlobal.hitScanArray, false );

	// 	if ( intersection.length > 0 ) {
	// 		hitPoint.copy(intersection[ 0 ].point);
	// 		if(intersection[0].object.playerId != null){
	// 			hitId = intersection[0].object.playerId;
	// 		}
	// 		if(intersection[0].object.isHead != null){
	// 			isHead = intersection[0].object.isHead;
	// 		}
	// 		return {hit:true, hitPoint:hitPoint, distance:intersection[ 0 ].distance, hitId:hitId, isHead:isHead};
	// 	}
	// 	return null;
		
	// }

	deactivateAbility(){
		
	}

	kill(){
		super.kill();
	}
	
  	
}

export { AbilityNade };

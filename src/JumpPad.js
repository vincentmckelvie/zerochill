import {
	Object3D,
	BoxGeometry,
	MeshStandardMaterial,
	Mesh,
	Vector3,
	Quaternion,
	Scene,
	TextureLoader,
	Color,
	RepeatWrapping,
	ClampToEdgeWrapping,
	LinearFilter,
	CylinderGeometry,
	Sphere
} from './build/three.module.js';

//import { clone } from "./scripts/jsm/utils/SkeletonUtils.js";

class JumpPad {
	//{scene:scene, worldScale:worldScale};
	constructor(OBJ) {
		const self = this;
		this.killed = false;
		this.collider = new Sphere( new Vector3( 0, 0, 0 ), 1.5 );
		
		this.holder = new Object3D();
		// const geometry = new CylinderGeometry( 3, 3, 2, 12 );
		// const material = new MeshStandardMaterial( {color: 0x00ff00} );
		// this.mesh = new Mesh( geometry, material );
		
		this.mesh = self.getModelByName("jump-pad").scene.clone();///.clone();
		const s = 0;
		this.mesh.scale.set(s,s,s);
		gsap.to(this.mesh.scale,{duration:.3, x:3, y:3, z:3, ease: "back.out(5)", delay:0, onComplete:function(){
			//self.kill(false);
		}});
		this.look = new Object3D();
		//this.mesh.rotation.x += Math.PI/2;
		this.mesh.rotation.x -= Math.PI/2;
		this.look.add(/*this.mesh,*/ this.mesh);
		this.holder.add(this.look);
		
		this.collider.center.set(OBJ.position.x, OBJ.position.y, OBJ.position.z);

		this.holder.position.copy(this.collider.center);
		const wp = new Vector3().set(OBJ.worldPosition.x, OBJ.worldPosition.y, OBJ.worldPosition.z);
		
		this.look.lookAt(wp);
		appGlobal.scene.add(this.holder);
		this.grav = new Vector3().copy(this.collider.center).sub(wp).normalize();
		
		this.killTimeout = setTimeout(function(){
			self.kill();
		}, 5000);
		this.isJumping = false;
	}

	getModelByName(NAME){
		for(let i = 0; i<appGlobal.loadObjs.length;i++){
			if(appGlobal.loadObjs[i].name==NAME)
				return appGlobal.loadObjs[i].model;	
		}
	}

	update(){
		if(!this.killed){
			this.playerSphereCollision();
			if(window.socket == null ){
				this.botsCollision();
			}
		}
	}

	botsCollision(){

		for (let i = 0;i<appGlobal.remotePlayers.length; i++){
			const start = new Vector3();
			const end = new Vector3();
			appGlobal.remotePlayers[i].remotePlayer.start.getWorldPosition(start);
			appGlobal.remotePlayers[i].remotePlayer.end.getWorldPosition(end);
			const vector = new Vector3();
			const center = vector.addVectors(start, end).multiplyScalar( 0.5 );

			const playerRadius = appGlobal.remotePlayers[i].remotePlayer.radius*4;
			const r = playerRadius + this.collider.radius;
			const r2 = r * r;
			
			for ( const point of [ start ] ) {

				const d2 = point.distanceToSquared( this.collider.center );

				if ( d2 < r2 ) {
					appGlobal.remotePlayers[i].remotePlayer.doJumpPad(this.grav);
				}
		
			}
		}
	}

	playerSphereCollision() {
	
		if(appGlobal.localPlayer != null){

			const start = new Vector3().copy(appGlobal.localPlayer.playerCollider.start);
			const end = new Vector3().copy(appGlobal.localPlayer.playerCollider.end);
			
			const vector = new Vector3();
			const center = vector.addVectors(start, end).multiplyScalar( 0.5 );

			const playerRadius = appGlobal.localPlayer.playerCollider.radius*2;
			const r = playerRadius + this.collider.radius;
			const r2 = r * r;
			
			for ( const point of [ start ] ) {
				const d2 = point.distanceToSquared( this.collider.center );
				if ( d2 < r2 ) {
					this.initPlayerJump();
				}
			}
		}

	}

	initPlayerJump(){
		const self = this;
		appGlobal.localPlayer.doJumpPad(this.grav);
		// if(!this.isJumping){
		// 	this.isJumping = true;
		// 	const aniHolder = {maxSpeed:120}
		// 	appGlobal.localPlayer.maxSpeed=aniHolder.maxSpeed;
			
		// 	const toNewWorld = new Vector3().copy(self.grav).multiplyScalar(300);
			
		// 	appGlobal.localPlayer.playerVelocity.add( toNewWorld );
			
		// 	gsap.to(aniHolder,{duration:.7, maxSpeed:40, ease: "none", delay:0, oncomplete:function(){ self.isJumping = false; }, onUpdate:function(){   
		// 		if(appGlobal.localPlayer != null && !self.killed){
		// 			appGlobal.localPlayer.maxSpeed = aniHolder.maxSpeed;
		// 		}
		// 	}});
		// }


	}



  	kill(){
  		// if(appGlobal.localPlayer!=null){
  		// 	appGlobal.localPlayer.maxSpeed=40;
  		// }
  		this.killed = true;
  		appGlobal.globalHelperFunctions.tearDownObject(this.holder);
  		appGlobal.scene.remove(this.holder);
  	}
}

export { JumpPad };

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

import { clone } from "./scripts/jsm/utils/SkeletonUtils.js";

class JumpPad {
	//{scene:scene, worldScale:worldScale};
	constructor(OBJ) {
		const self = this;
		this.killed = false;
		this.collider = new Sphere( new Vector3( 0, 0, 0 ), 1.5 );
		
		this.holder = new Object3D();
		const geometry = new CylinderGeometry( 3, 3, 2, 12 );
		const material = new MeshStandardMaterial( {color: 0x00ff00} );
		this.mesh = new Mesh( geometry, material );
		
		this.look = new Object3D();
		this.mesh.rotation.x+=Math.PI/2
		this.look.add(this.mesh);
		this.holder.add(this.look);
		this.collider.center.copy(OBJ.position);
		this.holder.position.copy(this.collider.center);
		
		this.look.lookAt(OBJ.worldPosition);
		appGlobal.scene.add(this.holder); 
		this.grav = new Vector3().copy(this.collider.center).sub(OBJ.worldPosition).normalize();
		
		this.killTimeout = setTimeout(function(){
			self.kill();
		}, 5000);
		this.isJumping = false;
	}

	update(){
		this.playerSphereCollision();
		if(window.socket == null ){
			this.botsCollision();
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
  		if(appGlobal.localPlayer!=null){
  			appGlobal.localPlayer.maxSpeed=40;
  		}
  		this.killed = true;
  		this.mesh.geometry.dispose();
  		this.mesh.material.dispose();
  		this.holder.remove(this.mesh);
  		appGlobal.scene.remove(this.holder);
  	}
}

export { JumpPad };

import {
	Object3D,
	IcosahedronGeometry,
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
	Sphere,
	DoubleSide
} from 'three';

//import { clone } from "./scripts/jsm/utils/SkeletonUtils.js";

class StickyAOE {
	//{scene:scene, worldScale:worldScale};
	constructor(OBJ) {
		const self = this;
		this.killed = false;
		this.id = 0; 
		if(OBJ.id !=null)
			this.id = OBJ.id;
		
		this.collider = new Sphere( new Vector3( 0, 0, 0 ), 5 );
		
		this.holder = new Object3D();
		const geometry = new IcosahedronGeometry(6, 1);
		
		const material = new MeshStandardMaterial( {color: 0x5fc8ff, transparent:true, opacity:.5, side:DoubleSide } );
		this.mesh = new Mesh( geometry, material );
		
		this.look = new Object3D();
		this.look.add(this.mesh);
		this.holder.add(this.look);
		this.collider.center.copy(OBJ.position);
		this.holder.position.copy(this.collider.center);
		
		this.look.lookAt(OBJ.worldPosition);
		appGlobal.scene.add(this.holder); 
		
		this.killTimeout = setTimeout(function(){
			self.kill();
		}, 7000);

	}

	update(){
		this.playerSphereCollision();
		if(window.socket == null ){
			this.botsCollision();
		}
		this.mesh.rotation.z += appGlobal.deltaTime*2;
		// }else{
		// 	playerSphereCollision();
		// }
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
					//appGlobal.remotePlayers[i].remotePlayer.doJumpPad(this.grav);
					appGlobal.remotePlayers[i].remotePlayer.maxSpeed = 3;
				}else{
					appGlobal.remotePlayers[i].remotePlayer.maxSpeed = 40;
				}
			
		
			}
		
		}
	}

	playerSphereCollision() {
		//this.id != window.socket.id
		if(appGlobal.localPlayer != null ){

			const start = new Vector3().copy(appGlobal.localPlayer.playerCollider.start);
			const end = new Vector3().copy(appGlobal.localPlayer.playerCollider.end);
			
			const vector = new Vector3();
			const center = vector.addVectors(start, end).multiplyScalar( 0.5 );

			const playerRadius = appGlobal.localPlayer.playerCollider.radius*.5;
			const r = playerRadius + this.collider.radius;
			const r2 = r * r;
			
			for ( const point of [ start, end, center ] ) {
				const d2 = point.distanceToSquared( this.collider.center );
				if(!appGlobal.localPlayer.isDoingJumpPad){
					if ( d2 < r2 ) {
						appGlobal.localPlayer.maxSpeed = 3;	
					}else{
						appGlobal.localPlayer.maxSpeed = 40;
					}
				}
			}
		}

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

export { StickyAOE };

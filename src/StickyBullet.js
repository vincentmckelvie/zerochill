import {
	Object3D,
	SphereGeometry,
	MeshStandardMaterial,
	Mesh,
	Vector3,
	Quaternion,
	Sphere
} from './build/three.module.js';

class StickyBullet {
	//{aliveTime:aliveTime, bullet:bullet};
	constructor(OBJ, ISLOCAL) {
		this.weaponName = OBJ.name;
		this.isLocal = ISLOCAL;
		this.damage = OBJ.damage;
		this.id = OBJ.id;
		this.worldPosition = new Vector3().copy(OBJ.worldPosition);
		
		this.vector1 = new Vector3();
		this.vector2 = new Vector3();
		this.vector3 = new Vector3();
		
		this.knockParams = OBJ.knockParams;
		//this.worldPosition = OBJ.worldPosition; 

		this.alivetime = 2000;
			
		const rad = .2;
		const sphereGeometry = new SphereGeometry( rad, 6, 6 );
		const sphereMaterial = new MeshStandardMaterial( { color: 0xffffff, roughness: 0.8, metalness: 0.5 } );
		this.mesh = new Mesh( sphereGeometry, sphereMaterial );
		// this.mesh.castShadow = true;
		// this.receiveShadow = true;
		
		this.holder = new Object3D();
		this.holder.add(this.mesh);
		appGlobal.scene.add( this.holder );

		//spheres.push( { mesh: sphere, collider: new THREE.Sphere( new THREE.Vector3( 0, 0, 0 ), SPHERE_RADIUS ), velocity: new THREE.Vector3() } );
		this.collider = new Sphere( new Vector3( 0, 0, 0 ), rad );
		const impulse = OBJ.impulse ;
		this.velocity = new Vector3().copy(OBJ.dir).multiplyScalar( impulse );
		
		this.velocityMult = 1;
		this.startPos = new Vector3().copy(OBJ.pos)

		if(OBJ.tipPos != null){
			const sub = new Vector3().copy(OBJ.tipPos).sub(this.startPos);
			this.mesh.position.copy(sub);
			gsap.to(this.mesh.position,{duration:.3, x:0, y:0, z:0, delay:0});
		}
		this.collider.center.copy( this.startPos );
		//this.velocity.addScaledVector( this.player.playerVelocity, 2 );
		this.stuck = false;
		this.killed = false;
		this.contactParticle = appGlobal.particles.explosion;
		const self = this;
		this.grav = new Vector3();
		this.killTimeout = setTimeout(function(){
			self.kill();
		}, 2000)
		//sphereIdx = ( sphereIdx + 1 ) % spheres.length;
	}
	
	update(){
		if(!this.killed && !this.stuck){
			this.handlePhysics();
			this.playerSphereCollision();
		}
	}

	handlePhysics(){

		this.collider.center.addScaledVector( this.velocity, appGlobal.deltaTime );

		this.grav.copy(this.collider.center).sub(this.worldPosition).normalize();
		this.velocity.x -= this.grav.x*(appGlobal.gravity*appGlobal.deltaTime);
		this.velocity.y -= this.grav.y*(appGlobal.gravity*appGlobal.deltaTime);
		this.velocity.z -= this.grav.z*(appGlobal.gravity*appGlobal.deltaTime);
		
		const damping = Math.exp( - 1.5 * appGlobal.deltaTime ) - 1;
		this.velocity.addScaledVector( this.velocity, damping );
		this.velocity.multiplyScalar(this.velocityMult);
		for(let i = 0; i<appGlobal.worlds.length; i++){
			const s1 = this;
			const s2 = appGlobal.worlds[i];

			const d2 = s1.collider.center.distanceToSquared( s2.collider.center );
			const r = s1.collider.radius + s2.collider.radius;
			const r2 = r * r;

			if ( d2 < r2 ) {
				this.velocityMult = 0;
				this.handleStick();
			}
		}
		
		this.holder.position.copy( this.collider.center );
		
	}

	handleStick(){

		clearTimeout(this.killTimeout);
		
		const self = this;
		gsap.to(this.mesh.scale,{duration:.3, x:0, y:0, z:0, ease: "back.in(5)", delay:0, onComplete:function(){
			self.kill(false);
		}});
		
		this.stuck = true;
		
	}
	
	kill(hitPlayer){

		if(!this.killed){
			
			if(this.isLocal){
				this.knockParams.pos = this.holder.position;
				if(!hitPlayer){
					appGlobal.globalHelperFunctions.knockPlayer(this.knockParams);
				}

				const arr = appGlobal.globalHelperFunctions.splashDamage(this.knockParams);
				if(arr.length>0){
					for(let i = 0; i<arr.length; i++){
						const self = this;
						if(window.socket != null){
							const obj = {
								name:this.weaponName,
						  		id: arr[i].id,
						  		position:appGlobal.localPlayer.playerCollider.start,
						  		headShot:false,
						  		fromDamageId:socket.id
							}
							socket.emit('doDamage', obj);
							appGlobal.globalHelperFunctions.playerDoDamage(obj);
						}else{
							appGlobal.remotePlayers[arr[i].id].receiveDamage({headShot:false, position:this.holder.position, health:this.damage})
						}

					}			
				}
			}
			
			this.contactParticle.pos = this.holder.position;
			appGlobal.particleHandler.createEmitter(this.contactParticle);
			
    		const dist = appGlobal.globalHelperFunctions.getDistanceForSound(this.collider.center);
	    	appGlobal.soundHandler.playSoundByName({name:this.contactParticle.sound, dist:dist});

			this.killed = true;
			this.mesh.geometry.dispose();
			this.mesh.material.dispose();
			this.holder.remove(this.mesh);
			appGlobal.scene.remove(this.holder);
		}
	}
	playerSphereCollision() {
		const id = appGlobal.globalHelperFunctions.playerSphereCollision(this.collider, this.id)
		if(id != null){
			this.kill(true);
		}
	}

	// spheresWorldCollision() {

	// 	for ( let i = 0, length = spheres.length; i < length; i ++ ) {

	// 		const s1 = spheres[ i ];

			

	// 		//}

	// 	}

	// }

	// spheresCollisions() {

	// 	for ( let i = 0, length = spheres.length; i < length; i ++ ) {

	// 		const s1 = spheres[ i ];

	// 		for ( let j = i + 1; j < length; j ++ ) {

	// 			const s2 = spheres[ j ];

	// 			const d2 = s1.collider.center.distanceToSquared( s2.collider.center );
	// 			const r = s1.collider.radius + s2.collider.radius;
	// 			const r2 = r * r;

	// 			if ( d2 < r2 ) {

	// 				const normal = vector1.subVectors( s1.collider.center, s2.collider.center ).normalize();
	// 				const v1 = vector2.copy( normal ).multiplyScalar( normal.dot( s1.velocity ) );
	// 				const v2 = vector3.copy( normal ).multiplyScalar( normal.dot( s2.velocity ) );

	// 				s1.velocity.add( v2 ).sub( v1 );
	// 				s2.velocity.add( v1 ).sub( v2 );

	// 				const d = ( r - Math.sqrt( d2 ) ) / 2;

	// 				s1.collider.center.addScaledVector( normal, d );
	// 				s2.collider.center.addScaledVector( normal, - d );

	// 			}
	// 		}
	// 	}
	// }

}

export { StickyBullet };

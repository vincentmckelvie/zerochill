import {
	Object3D,
	SphereGeometry,
	MeshStandardMaterial,
	Mesh,
	Vector3,
	Quaternion,
	Sphere
} from './build/three.module.js';

class AbilityBullet {
	//{aliveTime:aliveTime, bullet:bullet};
	constructor(OBJ, ISLOCAL) {
		
		this.isLocal = ISLOCAL;
		this.id = OBJ.id;
		this.worldPosition = new Vector3().copy(OBJ.worldPosition);
		
		this.vector1 = new Vector3();
		this.vector2 = new Vector3();
		this.vector3 = new Vector3();
		
		this.alivetime = 2000;
		
		const rad = .2;
		const sphereGeometry = new SphereGeometry( rad, 6, 6 );
		const sphereMaterial = new MeshStandardMaterial( { color: 0xffffff, roughness: 0.8, metalness: 0.5 } );
		this.mesh = new Mesh( sphereGeometry, sphereMaterial );
		this.mesh.castShadow = true;
		this.receiveShadow = true;
		appGlobal.scene.add( this.mesh );

		//spheres.push( { mesh: sphere, collider: new THREE.Sphere( new THREE.Vector3( 0, 0, 0 ), SPHERE_RADIUS ), velocity: new THREE.Vector3() } );
		this.collider = new Sphere( new Vector3( 0, 0, 0 ), rad );
		const impulse = OBJ.impulse;
		this.velocity = new Vector3().copy(OBJ.dir).multiplyScalar( impulse );
		this.collider.center.copy( OBJ.pos );
		this.velocityMult = 1;
		this.startPos = new Vector3().copy(OBJ.pos);
		this.killed = false;
		this.contactParticle = appGlobal.particles.explosion;
		const self = this;
		this.grav = new Vector3();
		this.killTimeout = setTimeout(function(){
			self.kill();
		}, 5000);

		this.world = null;
		//sphereIdx = ( sphereIdx + 1 ) % spheres.length;
	}
	
	update(){
		if(!this.killed){
			this.handlePhysics();
			//this.playerSphereCollision();
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
				this.world = appGlobal.worlds[i];
				this.velocityMult = 0;
				this.kill();
			}
		}

		this.mesh.position.copy( this.collider.center );
		
	}

	
	kill(){

		if(!this.killed){
			
			if(this.isLocal){
			
				
				// this.contactParticle.pos = this.mesh.position;
				// appGlobal.particleHandler.createEmitter(this.contactParticle);
				
	    		// const dist = appGlobal.globalHelperFunctions.getDistanceForSound(this.collider.center);
		    	// appGlobal.soundHandler.playSoundByName({name:this.contactParticle.sound, dist:dist});

				this.killed = true;
				this.mesh.geometry.dispose();
				this.mesh.material.dispose();
				appGlobal.scene.remove(this.mesh);

			}
		}
	}

}

export { AbilityBullet };

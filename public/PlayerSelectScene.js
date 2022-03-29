import {
	BoxGeometry,
	MeshNormalMaterial,
	Mesh,
	Vector3,
	Clock,
	Scene,
	Color,
	AmbientLight,
	DirectionalLight,
	WebGLRenderer,
	VSMShadowMap,
	SphereGeometry,
	ShaderMaterial,
	BackSide,
	Vector2,
	FogExp2,
	PerspectiveCamera,
	Object3D,
	PMREMGenerator,
	TextureLoader,
	RepeatWrapping,
	NearestFilter,
	LinearFilter,
	ClampToEdgeWrapping
} from 'three';
import { OrbitControls } from './scripts/jsm/controls/OrbitControls.js';
import { clone } from "./scripts/jsm/utils/SkeletonUtils.js"
import { CharacterAnimationHandler } from './CharacterAnimationHandler.js';
//import { RoomEnvironment } from './scripts/jsm/environments/RoomEnvironment.js';


class PlayerSelectScene {

	constructor() {

		const self = this;
		this.scene = new Scene();
		//this.scene.background = new Color( 0x88ccff );
		this.w = 350;
		this.h = 250;
		this.renderer = new WebGLRenderer( { antialias: false, alpha:true } );
		//this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( this.w, this.h );
		// this.renderer.shadowMap.enabled = true;
		// this.renderer.shadowMap.type = VSMShadowMap;

		this.camera = new PerspectiveCamera( 26, this.w / this.h, 0.1, 1000 );
		this.camera.position.z = 2.8;
		
		const container = document.getElementById( 'player-select-character' );
		container.appendChild( this.renderer.domElement );
		this.controls = new OrbitControls( this.camera,  container);
		//this.controls.listenToKeyEvents( window ); // optional

		//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

		this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
		this.controls.dampingFactor = 0.05;
		this.controls.enablePan = false;
		this.controls.enableZoom = false;
		this.controls.screenSpacePanning = true;
		this.controls.autoRotate = false;		
		this.controls.minPolarAngle = Math.PI/2; // radians
		this.controls.maxPolarAngle = Math.PI/2; // radians
		//this.controls.minDistance = 0;
		//this.controls.maxDistance = 700;

		const assault = clone( self.getModelByName("body-assault").scene );
		const assaultBoost = clone( self.getModelByName("assault-boost").scene );
		const assaultTeleport = clone( self.getModelByName("assault-teleport").scene );
		const assaultDirectional = clone( self.getModelByName("assault-directional").scene );
		
		const submachine = clone( self.getModelByName("body-submachine").scene );
		const submachineBoost = clone( self.getModelByName("submachine-boost").scene );
		const submachineTeleport = clone( self.getModelByName("submachine-teleport").scene );
		const submachineDirectional = clone( self.getModelByName("submachine-directional").scene );
		

		const sticky = clone( self.getModelByName("body-sticky").scene );
		const stickyBoost = clone( self.getModelByName("sticky-boost").scene );
		const stickyTeleport = clone( self.getModelByName("sticky-teleport").scene );
		const stickyDirectional = clone( self.getModelByName("sticky-directional").scene );
		
		const launcher = clone(  self.getModelByName("body-launcher").scene );
		const launcherBoost = clone(  self.getModelByName("launcher-boost").scene );
		const launcherTeleport = clone(  self.getModelByName("launcher-teleport").scene );
		const launcherDirectional = clone(  self.getModelByName("launcher-directional").scene );
		
		const sixgun = clone( self.getModelByName("body-sixgun").scene );
		const sixgunBoost = clone( self.getModelByName("sixgun-boost").scene );
		const sixgunTeleport = clone( self.getModelByName("sixgun-teleport").scene );
		const sixgunDirectional = clone( self.getModelByName("sixgun-directional").scene );
		
		const sniper = clone(  self.getModelByName("body-sniper").scene );
		const sniperBoost = clone(  self.getModelByName("sniper-boost").scene );
		const sniperTeleport = clone(  self.getModelByName("sniper-teleport").scene );
		const sniperDirectional = clone(  self.getModelByName("sniper-directional").scene );
		
		// this.auto = clone(         self.getModelByName("weapon").scene );
		// this.sub =  clone(         self.getModelByName("weapon").scene );
		// this.sniper = clone(       self.getModelByName("weapon").scene );
		// this.sixgun = clone(       self.getModelByName("weapon").scene );
		// this.launcher = clone(     self.getModelByName("weapon").scene );
		// this.sticky   = clone(     self.getModelByName("weapon").scene );

		this.holder = new Object3D();
		//this.character.quaternion.set(new Quaternion().identity());
		//automatic.position.y = projectile.position.y = hitscan.position.y = -.5;
		
		//this.weapon.position.y = -.5;
		this.holder.position.y = -.55;
		this.characters = [];
		
		const cahAssault =    new CharacterAnimationHandler({meshes:[assault, assaultBoost, assaultDirectional, assaultTeleport],               animations:appGlobal.loadObjs[0].model.animations, name:"assault"})
		const cahSubmachine = new CharacterAnimationHandler({meshes:[submachine, submachineBoost, submachineDirectional, submachineTeleport], 	animations:appGlobal.loadObjs[0].model.animations, name:"submachine"})
		
		const cahSticky =    new CharacterAnimationHandler({meshes:[sticky, stickyBoost, stickyDirectional, stickyTeleport],      			   	animations:appGlobal.loadObjs[0].model.animations, name:"sticky"})
		const cahLauncher =  new CharacterAnimationHandler({meshes:[launcher, launcherBoost, launcherDirectional, launcherTeleport],    		animations:appGlobal.loadObjs[0].model.animations, name:"launcher"})
		
		const cahSixGun =    new CharacterAnimationHandler({meshes:[sixgun, sixgunBoost, sixgunDirectional, sixgunTeleport],      			 	animations:appGlobal.loadObjs[0].model.animations, name:"sixgun"})
		const cahSniper =    new CharacterAnimationHandler({meshes:[sniper, sniperBoost, sniperDirectional, sniperTeleport],      				animations:appGlobal.loadObjs[0].model.animations, name:"sniper"})
		
		cahAssault.initAnimation();
		cahSubmachine.initAnimation();
		
		cahSticky.initAnimation();
		cahLauncher.initAnimation();
		
		cahSixGun.initAnimation();
		cahSniper.initAnimation();

		this.characters.push({object:assault,    cah:cahAssault,     name:"assault",    attach:[{obj: assaultBoost,    name:"boost"},{obj: assaultDirectional,    name:"directional"}, {obj: assaultTeleport,    name:"teleport"}] });//order set in main js character loader object
		this.characters.push({object:submachine, cah:cahSubmachine,  name:"submachine", attach:[{obj: submachineBoost, name:"boost"},{obj: submachineDirectional, name:"directional"}, {obj: submachineTeleport, name:"teleport"}]  });//order set in main js character loader object
		
		this.characters.push({object:sticky,   cah:cahSticky,        name:"sticky",     attach:[{obj: stickyBoost,   name:"boost"},{obj: stickyDirectional,   name:"directional"}, {obj: stickyTeleport,   name:"teleport"}]    });//order set in main js character loader object
		this.characters.push({object:launcher, cah:cahLauncher,      name:"launcher",   attach:[{obj: launcherBoost, name:"boost"},{obj: launcherDirectional, name:"directional"}, {obj: launcherTeleport, name:"teleport"}]    });//order set in main js character loader object
		 
		this.characters.push({object:sixgun,    cah:cahSixGun,       name:"sixgun",    attach:[{obj: sixgunBoost, name:"boost"},{obj: sixgunDirectional, name:"directional"}, {obj: sixgunTeleport, name:"teleport"}]     });//order set in main js character loader object
		this.characters.push({object:sniper,    cah:cahSniper,       name:"sniper",    attach:[{obj: sniperBoost, name:"boost"},{obj: sniperDirectional, name:"directional"}, {obj: sniperTeleport, name:"teleport"}]     });//order set in main js character loader object
		
		this.scene.add(this.holder);
		this.holder.add(
			assault, assaultBoost, assaultTeleport, assaultDirectional, 
			submachine, submachineBoost, submachineTeleport, submachineDirectional,
			sticky, stickyBoost, stickyTeleport, stickyDirectional,
			launcher, launcherBoost, launcherTeleport, launcherDirectional,
			sniper, sniperBoost, sniperTeleport, sniperDirectional,
			sixgun, sixgunBoost, sixgunTeleport, sixgunDirectional
		);

		// const pmremGenerator = new PMREMGenerator( this.renderer );
		// this.scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.01 ).texture;

		// this.holder.traverse( function ( obj ) {
		// 	if(obj.isMesh){
		// 		obj.material.environmentMap = self.scene.environment;
		// 	}
		// });
		
		const ambientlight = new AmbientLight( 0x6688cc );
		this.scene.add( ambientlight );
		
		const fillLight1 = new DirectionalLight( 0xf0f0f0, 0.5 );
		fillLight1.position.set( -1, 1, 2 );
		this.scene.add( fillLight1 );

		const fillLight2 = new DirectionalLight( 0x8888ff, 0.2 );
		fillLight2.position.set( 0, -1, 0 );
		this.scene.add( fillLight2 );

		const directionalLight = new DirectionalLight( 0xffffc7, 1.2 );
		directionalLight.position.set( - 5, 25, - 1 );
		// directionalLight.castShadow = true;
		// directionalLight.shadow.camera.near = 0.01;
		// directionalLight.shadow.camera.far = 500;
		// directionalLight.shadow.camera.right = 30;
		// directionalLight.shadow.camera.left = - 30;
		// directionalLight.shadow.camera.top	= 30;
		// directionalLight.shadow.camera.bottom = - 30;
		// directionalLight.shadow.mapSize.width = 1024;
		// directionalLight.shadow.mapSize.height = 1024;
		// directionalLight.shadow.radius = 4;
		// directionalLight.shadow.bias = - 0.00006;
		this.scene.add( directionalLight );
		this.boostTexture = new TextureLoader().load( './assets/textures/boost.png' );
		this.boostTexture.wrapS = RepeatWrapping;
		this.boostTexture.wrapT =  ClampToEdgeWrapping;
		this.boostTexture.magFilter = LinearFilter; 
	
		this.rotMod = 0;
		for(let i = 0; i<this.characters.length; i++){
			let name = "tip-"+this.characters[i].name;
			const tipObject = this.characters[i].object.getObjectByName(name);
			tipObject.visible = false;
			
			self.initCAH(this.characters[i]);
			for(let k = 0; k<this.characters[i].attach.length; k++){
				this.characters[i].attach[k].obj.visible = false;
				
				this.characters[i].attach[k].obj.traverse( function ( obj ) {
					if(obj.name.includes("boost-part")){
						obj.material.transparent = true;
						obj.material.map = self.boostTexture;
						obj.material.emissiveMap = self.boostTexture;
						obj.material.color = new Color(0x000000);
						obj.material.emissive = new Color(0xffbf80);
						//self.boostObjs.push(obj);
					}
				});
				
				//sentence.includes(word)	
			}
			
			this.characters[i].object.visible = false;	
			
		}
		
		this.characters[0].object.visible = true;
		this.characters[0].attach[0].obj.visible = true;


		
	}

	handleCharacterSwitch(OBJ){
		let obj;
		let mov;
		for(let i = 0; i < this.characters.length; i++){
			for(let k = 0; k<this.characters[i].attach.length; k++){
				this.characters[i].attach[k].obj.visible = false;
				this.characters[i].object.visible = false;
				if(this.characters[i].attach[k].name == OBJ.movement && this.characters[i].name == OBJ.class){
					mov = this.characters[i].attach[k].obj;
					obj = this.characters[i].object;
				}	
			}
		}
		mov.visible = true;
		obj.visible = true;
	}

	handleMovementSwitch(OBJ){
		let obj;
		for(let i = 0; i < this.characters.length; i++){
			for(let k = 0; k < this.characters[i].attach.length; k++){
				this.characters[i].attach[k].obj.visible = false;
				if(this.characters[i].attach[k].name == OBJ.movement && this.characters[i].name == OBJ.class){
					obj = this.characters[i].attach[k].obj;
				}
			}
		}
		obj.visible = true;
	}

	initCAH(OBJ){
		OBJ.cah.idle.weight = 1;
		OBJ.cah.forward.weight = 0;
		OBJ.cah.right.weight = 0;
		OBJ.cah.left.weight = 0;
		OBJ.cah.jump.weight = 0;
		OBJ.cah.idle.stop();
		OBJ.cah.idle.play();
		OBJ.cah.forward.stop();
		OBJ.cah.right.stop();
		OBJ.cah.left.stop();
		OBJ.cah.back.stop();
		OBJ.cah.jump.stop();
	}

	getModelByName(NAME){
		for(let i = 0; i<appGlobal.loadObjs.length;i++){
			if(appGlobal.loadObjs[i].name==NAME)
				return appGlobal.loadObjs[i].model;	
		}
		
	}


	update(){
		this.renderer.render( this.scene, this.camera );
		this.controls.update();
		this.rotMod += (appGlobal.deltaTime*400);
		
		// for(let k = 0; k<this.boostObjs.length; k++){
		// 	if(Math.floor(this.rotMod%10) == 0){
		// 		//this.boostObjs[k].rotation.z+=Math.random()*Math.PI
		// 	}
		// }
		if(Math.floor(this.rotMod%10) == 0){
			this.boostTexture.offset.x += .2+Math.random()*.5;
		}
				

		for(let i = 0; i<this.characters.length; i++){
			this.characters[i].cah.update();
		}		
	}

	kill(){
		
	}
	
}


export { PlayerSelectScene };



// import {
// 	Object3D,
// 	CylinderGeometry,
// 	MeshStandardMaterial,
// 	Mesh,
// 	Vector3,
// 	Quaternion,
// 	Sphere,
// 	Vector2
// } from './build/three.module.js';
import { Abilities } from './Abilities.js';

class AbilityDirectionalBoost extends Abilities {
	// {
	// 	type:"hold",//"press"
	//	hasCooldown:false
	//	cooldown:8000,
	//  key:"ShiftLeft"//"KeyE"
	// }
	constructor(OBJ) {
		super(OBJ);
	}
	
	init(){
		super.init(this);
		appGlobal.localPlayer.directionalBoostMult = 1;
		appGlobal.localPlayer.abilityMult = 1.8;
	}
  	
}

export { AbilityDirectionalBoost };

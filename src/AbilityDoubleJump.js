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

class AbilityDoubleJump extends Abilities {
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
		appGlobal.localPlayer.canDoubleJump = true;
	}
  	
}

export { AbilityDoubleJump };

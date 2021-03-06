import {
	Object3D,
	SphereGeometry,
	MeshStandardMaterial,
	Mesh,
	Vector3,
	Quaternion,
	Sphere,
	Euler
} from './build/three.module.js';

import { Item } from './Item.js';

class ItemHandler {
	//{aliveTime:aliveTime, bullet:bullet};
	constructor() {
		this.arr=[];
		
	}
	
	update(){
		for ( let i = 0; i < appGlobal.STEPS_PER_FRAME; i ++ ) {
			for(let i = 0; i < this.arr.length; i++){
				this.arr[i].update();	
			}
		}
	}

	reset(){
		const amt = appGlobal.serverItemArr.length;
		for(let i = 0; i<amt; i++){
			const w = appGlobal.worlds[Math.floor(appGlobal.random()*appGlobal.worlds.length)];
			const pos = new Vector3().copy(w.worldPosition);
			
			const rot = new Vector3().set(appGlobal.random()*(Math.PI*2),appGlobal.random()*(Math.PI*2),appGlobal.random()*(Math.PI*2));
			const scl = w.scale;
			const szeMult = appGlobal.random();
			const item = new Item({ 
				position : pos, 
				index:i, 
				lookPosition:w.worldPosition, 
				killed:appGlobal.serverItemArr[i].killed, 
				rotation:rot, 
				scale:scl,
				sizeMult:szeMult
			})
			this.arr.push(item);

		}
	}

	resetBots(){
		const arr = [];
		for(let i = 0; i < this.arr.length; i++){
			arr.push(this.arr[i]);
			this.arr[i].kill();	
		}
		this.arr = [];
		for(let i = 0; i<arr.length; i++){

			const item = new Item(arr[i].obj)
			this.arr.push(item);
		}
	}

	kill(){
		for(let i = 0; i < this.arr.length; i++){
			this.arr[i].kill();	
		}
		this.arr = [];
	}
	killItem(index){
		this.arr[index].kill();
	}
}

export { ItemHandler };

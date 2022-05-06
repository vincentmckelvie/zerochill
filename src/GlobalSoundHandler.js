// import {
// 	PositionalAudio
// } from './build/three.module.js';

class GlobalSoundHandler {
	//{aliveTime:aliveTime, bullet:bullet};
	constructor(OBJ) {

		this.context;
		this.audioFiles = [
			"rocket",
			"snipe",
			"rocket2",
			"automatic-2",
			"sniper2",
			"sniper-six2",
			"explosion",
			"sub",
			"boost",
			"health",
			"blink",
			"double-jump",
			"wall-hack",
			"teleport",
			"planet-switch",
			"dink",
			"dink-body-3",
			"dmg",
			"step-0",
			"step-1",
			"kill-2",
			"slime",
			"splat",
			"slime-thud",
			"nade-hit-2",
			"nade",
			"bliz",
			"jump-pad-bounce",
			"jump-pad-land",
			"unloved"
		]
		this.repeatHandlerDeath = new SoundRepeatHandler({name:"kill-2",timeout:200});
		this.repeatHandlerDink = new SoundRepeatHandler({name:"dink",timeout:200});
		this.repeatHandlerDinkBody = new SoundRepeatHandler({name:"dink-body-2",timeout:100});
		this.repeatHandlerDmg = new SoundRepeatHandler({name:"dmg",timeout:200});
		this.repeatArray = [];
		this.repeatArray.push(this.repeatHandlerDeath);
		this.repeatArray.push(this.repeatHandlerDink);
		this.repeatArray.push(this.repeatHandlerDinkBody);
		this.repeatArray.push(this.repeatHandlerDmg);
		
		this.samples = [];
		
		const self = this;
		if(!appGlobal.mobile.isMobile )
			self.init();

		this.mainAudioSource;
		this.mainAudioGainNode;

		//console.log(PositionalAudio)
	}
	
	update(){
	}

	init(){

		const AudioContext = window.AudioContext || window.webkitAudioContext;
		this.context = new AudioContext();

		if (this.context.decodeAudioData.length !== 1) {
		  const originalDecodeAudioData = this.context.decodeAudioData.bind(this.context);
		  this.decodeAudioData = buffer =>
		    new Promise((resolve, reject) =>
		      originalDecodeAudioData(buffer, resolve, reject)
		    );
		}
		for(let i = 0; i<this.audioFiles.length; i++){
			this.load({url:"assets/sounds/"+this.audioFiles[i]+".mp3", index:i, name:this.audioFiles[i]});
		}
		
	}

	load(OBJ){

		const name = OBJ.name;
		const index = OBJ.index;
		const self = this;
		fetch(OBJ.url).then(function(response) {
		    if (!response.ok) {
		      throw new Error("HTTP error, status = " + response.status);
		    }
	    	return response.arrayBuffer();
	 	}).then(function(buffer) {
			self.context.decodeAudioData(buffer, function(decodedData) {
				const obj = {sample:decodedData, name:name, index:index};
				self.samples.push(obj);
				if(name=="unloved")
					self.playSong({name:name});

			});
	  	});

	}

	playSoundByName(OBJ){
		const rep = this.checkIfRepeatSound(OBJ); 
		if(rep != null){
			if(rep.canPlaySoundTimeout()){
				this.playSoundByNameHelper(OBJ);
			}
		}else{
			this.playSoundByNameHelper(OBJ);
		}
		
	}
	


	playSoundByNameHelper(OBJ){
		const sample = this.getSampleByName(OBJ.name);
		const obj = {sample:sample, dist:OBJ.dist, note:this.getKey(true)}
		this.playAudio(obj);
	}

	checkIfRepeatSound(OBJ){
	
		for(let i =0; i< this.repeatArray.length; i++){
			if(OBJ.name == this.repeatArray[i].name){
				return this.repeatArray[i];
			}
		}
		return null;
	}

	getSampleByName(name){
		for(let i = 0; i<this.samples.length; i++){
			const s = this.samples[i];
			if(s.name == name)
				return this.samples[i];  
		}
		return false;
	}



	playAudio(OBJ){
		
		const source = this.context.createBufferSource();
		source.buffer = OBJ.sample.sample;
		const gainNode = this.context.createGain()
		gainNode.gain.value = OBJ.dist *  (.1 * window.settingsParams["volume"]); // 10 %
		//source.playbackRate.value = note;

		source.playbackRate.value = 2 ** ((OBJ.note - 60) / 12);
		source.connect(gainNode);
		gainNode.connect(this.context.destination);
		source.start(0);
	}

	updateGainNode(){
		if(this.mainAudioGainNode!=null)
			this.mainAudioGainNode.gain.value = 1 *  (.1 * window.settingsParams["musicVolume"]); // 10 %
	}

	playSong(OBJ){
		const sample = this.getSampleByName(OBJ.name);
		const obj = {sample:sample, dist:1, note:this.getKey(false)}
		this.playSongHelper(obj);
	}
	
	playSongHelper(OBJ){
		this.mainAudioSource = this.context.createBufferSource();
		this.mainAudioSource.buffer = OBJ.sample.sample;
		this.mainAudioGainNode = this.context.createGain();
		this.mainAudioGainNode.gain.value = 0;
		
		this.mainAudioSource.loop = true;
		this.mainAudioSource.connect(this.mainAudioGainNode);
		this.mainAudioGainNode.connect(this.context.destination);
		this.mainAudioSource.start(0);
		
		const toVal = 1 *  (.1 * window.settingsParams["musicVolume"]); // 10 %
		gsap.to(this.mainAudioGainNode.gain,{duration:2.5, value:toVal, ease: "none", delay:1, oncomplete:function(){}, onUpdate:function(){}});
		
	}

	getKey(shouldDoRandom){
		let start = 60;
		let fnl = start+(-2+Math.random()*4);
		//console.log("SHOULD DO RANDOM"+shouldDoRandom)
		if(shouldDoRandom){
			return fnl;
		}else{
			return start;
		}
	}
}

export { GlobalSoundHandler };

class SoundRepeatHandler{
	constructor(OBJ){
		this.name=OBJ.name;
		this.timeout;
		this.canPlaySound = true;
		this.time = OBJ.timeout;
	}

	canPlaySoundTimeout(){
		let shouldPlaySound = false;
		if(this.canPlaySound){
			shouldPlaySound = true;
			const self = this;
			this.canPlaySound=false;
			this.timeout = setTimeout(function(){
				self.canPlaySound = true;
			},this.time);
		}
		return shouldPlaySound;
	}
}
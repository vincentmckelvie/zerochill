
class ParallaxGUI {

	constructor() {

		const self = this;
		this.targX = 0;
		this.targY = 0;
		
	}
	updateMouseMove(event){
		this.targX = ((window.innerWidth/2-event.pageX)  *.0002 )*-1;
		this.targY = ((window.innerHeight/2-event.pageY) *.0002)*-1;
	}

	update(){
		this.parallaxIt("title", 60);
		this.parallaxIt("instructions", 120);
		this.parallaxIt("all-classes", 60);
		this.parallaxIt("player-select-character", 60);
		this.parallaxIt("movement-select-holder", 60);
		this.parallaxIt("play-holder", 60);
	}

	kill(){
		
	}


	parallaxIt(target, movement) {
		
		
	}
	
};

	
	


export { ParallaxGUI };



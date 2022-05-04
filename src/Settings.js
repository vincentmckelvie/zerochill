class Settings {
  //{shootCooldown:shootCooldown, bullet:bullet};
  constructor(OBJ) {
    const self = this;
    //self.killCookies();
    this.localCookies = document.cookie;
    this.localParams = window.settingsParams;
    
    if(this.localCookies == null || this.localCookies == ""){
      self.updateCookies();
    }
    self.parseCookies();


    if(this.localParams["showInstructions"] == "true"){
      document.getElementById("instructions-modal").style.display = "block";
    }

    document.getElementById("settings-btn").addEventListener("click", function (){
      document.getElementById("settings").style.display = "block";
      //document.getElementById("settings-btn").style.display = "none";
    });
    
    document.getElementById("close-settings-btn").addEventListener("click", function (){
      //document.getElementById("settings-btn").style.display = "block";
      document.getElementById("settings").style.display = "none";
    });
    
    document.getElementById('mouse-sens').addEventListener('change', function(e){
      let fnl = parseFloat(e.target.value); 
      if(fnl>3)
        fnl = 3
      if(fnl<0.01)
        fnl = 0.01;
      window.settingsParams["mouseSens"] = fnl;
      self.localParams["mouseSens"]  = fnl;
      self.updateCookies();
    });
    
    document.getElementById('settings-vol').addEventListener('change', function(e){
      let fnl = parseFloat(e.target.value); 
      if(fnl>1.5)
        fnl = 1.5
      if(fnl<0)
        fnl = 0;

      window.settingsParams["volume"] = fnl;
      self.localParams["volume"] = fnl;
      self.updateCookies();
    });
    
    document.getElementById('settings-music-vol').addEventListener('change', function(e){
      let fnl = parseFloat(e.target.value); 
      if(fnl>1.5)
        fnl = 1.5;
      if(fnl<0)
        fnl = 0;

      window.settingsParams["musicVolume"] = fnl;
      self.localParams["musicVolume"] = fnl;

      if(appGlobal.soundHandler)
        appGlobal.soundHandler.updateGainNode();
    
      self.updateCookies();
    });

    document.getElementById('cross-hair-col').addEventListener('change', function(e){
      window.settingsParams["crossHairColor"] = ""+e.target.value+"";
      document.getElementById('recticle').style.background = "#"+window.settingsParams["crossHairColor"]+""; 
      self.updateCookies();
    });
    
    document.getElementById('settings-ads-sense-mult').addEventListener('change', function(e){
      let fnl = parseFloat(e.target.value); 
      if(fnl>3)
        fnl = 3
      if(fnl<0.01)
        fnl = 0.01;
      window.settingsParams["adsMouseSenseMult"] = fnl;
      self.localParams["adsMouseSenseMult"] = fnl;
      self.updateCookies();
    });
    document.getElementById('gamepad-checkbox').addEventListener('change', function(e){
      let str = "false";
      if(e.target.checked){
        str = "true";
      }
      
      window.settingsParams["gamePad"] = str;      
      self.localParams["gamePad"] = str;
      
      appGlobal.gamePad.canDiscoverGamePad = e.target.checked;
      
      self.updateCookies();

    });
    
    self.setInputFilter(document.getElementById("settings-ads-sense-mult"), function(value) {
      return /^-?\d*[.]?\d*$/.test(value); 
    });
    self.setInputFilter(document.getElementById("mouse-sens"), function(value) {
      return /^-?\d*[.]?\d*$/.test(value); 
    });
    self.setInputFilter(document.getElementById("settings-vol"), function(value) {
      return /^-?\d*[.]?\d*$/.test(value); 
    });
    self.setInputFilter(document.getElementById("cross-hair-col"), function(value) {
      return /^[0-9a-f]*$/i.test(value) && (value.length <= 6); 
    });
    
  }
  updateGamePad(enable){
    let str = "false";
    if(enable){
      str = "true";
    }
    window.settingsParams["gamePad"] = str;
    this.localParams["gamePad"] = str;
    this.updateCookies();
    this.updateDom("gamePad");
  }

  handleInstructionsClose(){
      window.settingsParams["showInstructions"] = "false";      
      this.localParams["showInstructions"] = "false";
      this.updateCookies();
  }

  updateCookies(){
    
    for (const key in window.settingsParams) {
      let str = `${key}=${window.settingsParams[key]}`;
      str += ";";
      str += "path=/";
      document.cookie = str;
    }
    
    this.localCookies = document.cookie;
    
  }
  parseCookies(){
    //console.log(document.cookie);
    const params = document.cookie.split(';');
    //console.log(params.length)
    for(let i = 0; i<params.length; i++){
      const spl = params[i].split("=");
      const left = spl[0].replace(/\s/g, '');
      const right = spl[1].replace(/\s/g, '');
      this.localParams[left] = right;
      this.updateDom(left);
    }
  }
  updateDom(key){
    switch(key){
      case "mouseSens":
        document.getElementById('mouse-sens').placeholder = this.localParams["mouseSens"]; 
        window.settingsParams["mouseSens"] = this.localParams["mouseSens"];
      break;
      case "musicVolume":
        document.getElementById('settings-music-vol').placeholder = this.localParams["musicVolume"]; 
        window.settingsParams["musicVolume"] = this.localParams["musicVolume"];
      break;
      case "volume":
        document.getElementById('settings-vol').placeholder = this.localParams["volume"]; 
        window.settingsParams["volume"] = this.localParams["volume"];
      break;
      case "crossHairColor":
        document.getElementById('recticle').style.background = "#"+this.localParams["crossHairColor"]+""; 
        document.getElementById('cross-hair-col').placeholder = this.localParams["crossHairColor"]; 
        window.settingsParams["crossHairColor"] = this.localParams["crossHairColor"];
      break;
      case "adsMouseSenseMult":
        document.getElementById('settings-ads-sense-mult').placeholder = this.localParams["adsMouseSenseMult"]; 
        window.settingsParams["adsMouseSenseMult"] = this.localParams["adsMouseSenseMult"];
      break;
      case "gamePad":
        document.getElementById('gamepad-checkbox').checked = this.localParams["gamePad"]==="true"; 
        window.settingsParams["gamePad"] = this.localParams["gamePad"];
      break;
      case "showInstructions":
        //document.getElementById('gamepad-checkbox').checked = this.localParams["gamePad"]==="true"; 
        window.settingsParams["showInstructions"] = this.localParams["showInstructions"];
      break;
    }
  }
        

  killCookies(){
    document.cookie = "mouseSens=1; path=/";
    document.cookie = "musicVolume=1; path=/";
    document.cookie = "volume=1; path=/";
    document.cookie = "crossHairColor=fff; path=/";
    document.cookie = "adsMouseSenseMult=1; path=/";
    document.cookie = "gamePad=false; path=/";
    document.cookie = "showInstructions=true; path=/";
  }

  // Restricts input for the given textbox to the given inputFilter.
  setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
      textbox.addEventListener(event, function() {
        if (inputFilter(this.value)) {
          this.oldValue = this.value;
          this.oldSelectionStart = this.selectionStart;
          this.oldSelectionEnd = this.selectionEnd;
        } else if (this.hasOwnProperty("oldValue")) {
          this.value = this.oldValue;
          this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
        } else {
          this.value = "";
        }
      });
    });
  }
}

export { Settings };
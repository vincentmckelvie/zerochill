
class Swatches {
  //{shootCooldown:shootCooldown, bullet:bullet};
  constructor(OBJ) {
    
     this.shootManDefault = [
      {
        ogName:"assault-main-color",
        newColor:"1b1b1b",
        newEmissive:"000000"
      },{
        ogName:"Material.015", // assault clips
        newColor: "4d4d4d",
        newEmissive:"000000",
        
      },{
        ogName:"Material.013",
        newColor: "00cc02",
        newEmissive:"000000",
        
      },{
        ogName:"Red",
        newColor: "ff160b",
        newEmissive:"000000",
        
      },{
        ogName:"Blue",
        newColor: "0a34cb",
        newEmissive:"000000",
        
      },{
        ogName:"assault-sight",
        newColor: "363636",
        newEmissive:"000000",
        
      },{
        ogName:"Green",
        newColor: "c7ff00",
        newEmissive:"000000",
        
      },{
        ogName:"Grey.005",
        newColor: "010101",
        newEmissive:"",
        
      },{
        ogName:"WhiteEmissive", // bright green
        newColor: "010101",
        newEmissive:"ffd7e5",
        
      },{
        ogName:"whiteNonEmissive",
        newColor: "9c9c9c",
        newEmissive:"000000",
      },
      
    ];

    this.shootManDark = [
      {
        ogName:"assault-main-color",
        newColor:"170052", // bright purple
        newEmissive:"000000",
      },{
        ogName:"Material.015", // assault clips
        newColor:"1c1c1c",
        newEmissive:"000000",
      },{
        ogName:"Material.013",
        newColor:"00ff15",
        newEmissive:"005c01",
      },{
        ogName:"Red",
        newColor:"170052", //dark purple main color
        newEmissive:"000000",
      },{
        ogName:"Blue",
        newColor:"170052", // dark purple body
        newEmissive:"000000",
      },{
        ogName:"assault-sight",
        newColor:"00ff15",
        newEmissive:"000000",
      },{
        ogName:"Green",
        newColor:"1c1c1c", //dark grey
        newEmissive:"000000",
      },{
        ogName:"Grey.005",
        newColor:"141414",
        newEmissive:"000000",
      },{
        ogName:"WhiteEmissive", // bright green
        newColor: "00ff15",
        newEmissive:"005c01",
      },{
        ogName:"whiteNonEmissive",
        newColor: "141414",
        newEmissive:"000000",
      },
      
    ];


    this.shootManKawaii = [
      {
        ogName:"assault-main-color",
        newColor:"8557fa", // bright purple
        newEmissive:"000000",
      },{
        ogName:"Material.015", // assault clips
        newColor:"ed3bbd",
        newEmissive:"000000",
      },{
        ogName:"Material.013",
        newColor:"020082",
        newEmissive:"0000000",
      },{
        ogName:"Red",
        newColor:"ed3bbd", //light yellow
        newEmissive:"000000",
      },{
        ogName:"Blue",
        newColor:"e1eb34", // dark purple body
        newEmissive:"000000",
      },{
        ogName:"assault-sight",
        newColor:"00ff15",
        newEmissive:"000000",
      },{
        ogName:"Green",
        newColor:"8557fa", //dark grey
        newEmissive:"000000",
      },{
        ogName:"Grey.005",
        newColor:"8557fa",
        newEmissive:"000000",
      },{
        ogName:"WhiteEmissive", // bright green eyes
        newColor: "34c6eb",
        newEmissive:"002733",
      },{
        ogName:"whiteNonEmissive",
        newColor: "2eccf0", // light blue 
        newEmissive:"000000",
      },
      
    ];
    
    this.shootManSwatches = [
      {
        name:"Shoot Man Default", 
        array:this.shootManDefault
      },
      {
        name:"Shoot Man Dark", 
        array:this.shootManDark
      },{
        name:"Shoot Man Kawaii", 
        array:this.shootManKawaii
      }
    ];

    
  }

  checkIfMaterialMatchesSwatch(matName, swatches){
    for(let i = 0; i<swatches.length; i++){
      if(matName == swatches[i].ogName){
        return swatches[i].newColor;
      }  
    }
    return null;
     
  }
  getSwatchByName(character, name){
    console.log(character)
    switch(character){
      case "assault":
        return this.getSwatch(this.shootManSwatches, name);
      break;
    }
  }

  getSwatch(array, name){
    for(let i = 0; i<array.length; i++){
      if(array[i].name == name){
        return array[i];
      }
    }
  }

}

export { Swatches };
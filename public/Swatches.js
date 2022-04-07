
class Swatches {
  //{shootCooldown:shootCooldown, bullet:bullet};
  constructor(OBJ) {
      /// shoot man
     this.shootManDefault = [
      {
        name:"assault-main-color",
        color:"1b1b1b",
        emissive:"000000"
      },{
        name:"Material.015", // assault clips
        color: "4d4d4d",
        emissive:"000000",
        
      },{
        name:"Material.013",
        color: "00cc02",
        emissive:"000000",
        
      },{
        name:"Red",
        color: "ff160b",
        emissive:"000000",
        
      },{
        name:"Blue",
        color: "0a34cb",
        emissive:"000000",
        
      },{
        name:"assault-sight",
        color: "363636",
        emissive:"000000",
        
      },{
        name:"Green",
        color: "c7ff00",
        emissive:"000000",
        
      },{
        name:"Grey.005",
        color: "010101",
        emissive:"000000",
        
      },{
        name:"WhiteEmissive", // bright green
        color: "010101",
        emissive:"ffd7e5",
        
      },{
        name:"whiteNonEmissive",
        color: "9c9c9c",
        emissive:"000000",
      },
      
    ];

    this.shootManDark = [
      {
        name:"assault-main-color",
        color:"030303", // bright purple
        emissive:"000000",
      },{
        name:"Material.015", // assault clips
        color:"1c1c1c",
        emissive:"000000",
      },{
        name:"Material.013",
        color:"00ff15",
        emissive:"005c01",
      },{
        name:"Red",
        color:"030303", //dark purple main color
        emissive:"000000",
      },{
        name:"Blue",
        color:"030303", // dark purple body
        emissive:"000000",
      },{
        name:"assault-sight",
        color:"00ff15",
        emissive:"000000",
      },{
        name:"Green",
        color:"1c1c1c", //dark grey
        emissive:"000000",
      },{
        name:"Grey.005",
        color:"141414",
        emissive:"000000",
      },{
        name:"WhiteEmissive", // bright green
        color: "00ff15",
        emissive:"005c01",
      },{
        name:"whiteNonEmissive",
        color: "141414",
        emissive:"000000",
      },
      
    ];


    this.shootManKawaii = [
      {
        name:"assault-main-color",
        color:"8557fa", // bright purple
        emissive:"000000",
      },{
        name:"Material.015", // assault clips
        color:"ed3bbd",
        emissive:"000000",
      },{
        name:"Material.013",
        color:"020082",
        emissive:"000000",
      },{
        name:"Red",
        color:"ed3bbd", //light yellow
        emissive:"000000",
      },{
        name:"Blue",
        color:"e1eb34", // dark purple body
        emissive:"000000",
      },{
        name:"assault-sight",
        color:"00ff15",
        emissive:"000000",
      },{
        name:"Green",
        color:"8557fa", //dark grey
        emissive:"000000",
      },{
        name:"Grey.005",
        color:"8557fa",
        emissive:"000000",
      },{
        name:"WhiteEmissive", // bright green eyes
        color: "ffffff",
        emissive:"ffffff",
      },{
        name:"whiteNonEmissive",
        color: "2eccf0", // light blue 
        emissive:"000000",
      },
      
    ];



    /// STICKY

    this.stickyDefault = [
    { name : "light",
      color : "494949",
      emissive: "000000" 
    },{
      name:"emissive.001",
      color:"00ccc3",
      emissive:"000000"
    },{
      name:"PinkKawaii",
      color:"4414ff",
      emissive : "000000" 
    },{
      name: "Material.012",
      color:"f7fff9",
      emissive:"000000"
    },{
      name:"GreyKawaii.001",
      color:"746b61",
      emissive:"000000",
    },{
      name:"YellowKawaii.001",
      color:"ffa422",
      emissive:"000000"
    },{
      name:"white-eye",
      color:"cccccc",
      emissive:"000000"
    },{
      name :"blacksmile",
      color:"000000",
      emissive:"000000"
    },{
      name:"white-kawaii",
      color:"cccccc",
      emissive:"000000"
    },{
      name:"YellowKawaii",
      color:"ffa422",
      emissive:"000000"
    },{
      name:"blackKawaii",
      color:"000000",
      emissive:"000000"
    },{
      name:"BlueLight",
      color:"ff0625",
      emissive:"000000"
    },{
      name:"WhiteFat",
      color:"cccccc",
      emissive:"cccccc"
    },{
      name:"DarkGreen",
      color:"042140",
      emissive:"000000"
    },{
      name:"GreyKawaii",
      color:"746b61",
      emissive:"000000"
    }]

    this.stickyDark = [
    { name : "light",
      color : "030303",
      emissive: "000000" 
    },{
      name:"emissive.001",
      color:"1e00ff",
      emissive:"1e00ff"
    },{
      name:"PinkKawaii",
      color:"1e00ff",
      emissive : "1e00ff" 
    },{
      name: "Material.012",
      color:"333333",
      emissive:"000000"
    },{
      name:"GreyKawaii.001",
      color:"333333",
      emissive:"000000",
    },{
      name:"YellowKawaii.001",
      color:"030303",
      emissive:"030303"
    },{
      name:"white-eye",
      color:"1e00ff",
      emissive:"1e00ff"
    },{
      name:"blacksmile",
      color:"1e00ff",
      emissive:"1e00ff"
    },{
      name:"white-kawaii",
      color:"1e00ff",
      emissive:"1e00ff"
    },{
      name:"YellowKawaii",
      color:"030303",
      emissive:"000000"
    },{
      name:"blackKawaii",
      color:"1e00ff",
      emissive:"1e00ff"
    },{
      name:"BlueLight",
      color:"1e00ff",
      emissive:"1e00ff"
    },{
      name:"WhiteFat",
      color:"1e00ff",
      emissive:"1e00ff"
    },{
      name:"DarkGreen",
      color:"333333",
      emissive:"000000"
    },{
      name:"GreyKawaii",
      color:"333333",
      emissive:"000000"
    }]

    this.stickyKawaii = [
    { name : "light",
      color : "e4f05d",
      emissive: "000000" 
    },{
      name:"emissive.001",
      color:"ea59f7",
      emissive:"000000"
    },{
      name:"PinkKawaii",
      color:"ea59f7",
      emissive : "000000" 
    },{
      name: "Material.012",
      color:"333333",
      emissive:"000000"
    },{
      name:"GreyKawaii.001",
      color:"85ffd8",//green
      emissive:"000000",
    },{
      name:"YellowKawaii.001",
      color:"ff85f1",
      emissive:"000000"
    },{
      name:"white-eye",
      color:"ff85f1",
      emissive:"ff85f1"
    },{
      name:"blacksmile",
      color:"46eb5a",
      emissive:"000000"
    },{
      name:"white-kawaii",
      color:"46eb5a",
      emissive:"1e00ff"
    },{
      name:"YellowKawaii",
      color:"e4f05d",
      emissive:"000000"
    },{
      name:"blackKawaii",
      color:"46eb5a",
      emissive:"000000"
    },{
      name:"BlueLight",
      color:"46eb5a",
      emissive:"000000"
    },{
      name:"WhiteFat",
      color:"ffffff",
      emissive:"000000"
    },{
      name:"DarkGreen",
      color:"383854",
      emissive:"000000"
    },{
      name:"GreyKawaii",
      color:"46d5eb",
      emissive:"000000"
    }]

    this.nitroDefault = [
    {
      name:'darkgreysub',
      color:'0a0a0a',
      emissive:'000000'
    },{
      name:'greensub',
      color:'00cc00',
      emissive:'000000'
    },{
      name:'light grey sub',
      color:'060606',
      emissive:'000000'
    },{
      name:'Eyes',
      color:'000000',
      emissive:'ff6600'
    },{
      name:'tip.005',
      color:'00cb03',
      emissive:'000000'
    },{
      name:'blast.004',
      color:'cc2c00',
      emissive:'000000'
    },{
      name:'GreenPunk',
      color:'00cb03',
      emissive:'000000'
    },{
      name:'Grey.006',
      color:'606060',
      emissive:'000000'
    },{
      name:'DarkGrey',
      color:'111111',
      emissive:'000000'
    }]

    this.nitroDark = [
    {
      name:'darkgreysub',
      color:'0a0a0a',
      emissive:'000000'
    },{
      name:'greensub',
      color:'00cc00',
      emissive:'000000'
    },{
      name:'light grey sub',
      color:'060606',
      emissive:'000000'
    },{
      name:'Eyes',
      color:'000000',
      emissive:'ff0000'
    },{
      name:'GreenPunk',
      color:'333333',
      emissive:'000000'
    },{
      name:'Grey.006',
      color:'333333',
      emissive:'000000'
    },{
      name:'DarkGrey',
      color:'111111',
      emissive:'000000'
    }];
    this.nitroKawaii = [
    {
      name:'darkgreysub',
      color:'4ee3e6',
      emissive:'000000'
    },{
      name:'e0a61d',
      color:'00cc00',
      emissive:'000000'
    },{
      name:'light grey sub',
      color:'73d187',
      emissive:'000000'
    },{
      name:'Eyes',
      color:'020aad',
      emissive:'000000'
    },{
      name:'GreenPunk',
      color:'333333',
      emissive:'000000'
    },{
      name:'Grey.006',
      color:'333333',
      emissive:'000000'
    },{
      name:'DarkGrey',
      color:'111111',
      emissive:'000000'
    }]

    this.arr = [
      {
        name:"assault",
        swatches:[
          {
            name:"Default",
            icon:"#ff160b",
            array:this.shootManDefault
          },
          {
            name:"Dark",
            icon:"#1e00ff", 
            array:this.shootManDark
          },{
            name:"Kawaii", 
            icon:"#ff85ba", 
            array:this.shootManKawaii
          }
        ]
      },
      {
        name:"sticky",
        swatches:[
          {
            name:"Default",
            icon:"#e6f238",
            array:this.stickyDefault
          },
          {
            name:"Dark",
            icon:"#1e00ff", 
            array:this.stickyDark
          },{
            name:"Kawaii", 
            icon:"#47e7ff", 
            array:this.stickyKawaii
          }
        ]
      },{
        name:"submachine",
        swatches:[
          {
            name:"Default",
            icon:"#e6f238",
            array:this.nitroDefault
          },
          {
            name:"Dark",
            icon:"#ff0000", 
            array:this.nitroDark
          },{
            name:"Kawaii", 
            icon:"#47e7ff", 
            array:this.nitroKawaii
          }
        ]
      },
    ];

    
  }

  checkIfMaterialMatchesSwatch(matName, swatches){
    for(let i = 0; i<swatches.length; i++){
      if(matName == swatches[i].name){
        return {color:swatches[i].color, emissive:swatches[i].emissive};
      }  
    }
    return null;
  }
  getSwatchByName(character, name){
    const swatch = this.getSwatchesArrayFromName(character);
    console.log(swatch)
    return this.getSwatch(swatch, name);
  }

  getSwatchesArrayFromName(name){
    for(let i = 0; i<this.arr.length; i++){
      if(name==this.arr[i].name)
        return this.arr[i].swatches;
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
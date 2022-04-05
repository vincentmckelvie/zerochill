window.logged = {
	in:true,
}

class DenyButton{
	constructor(OBJ) {
		const self = this;
		this.btn = OBJ.btn;
		this.user = OBJ.user; 
		this.btn.addEventListener("click", function(){
			$.get("/denyfriend?user="+escape(self.user), function(OBJ) {
				self.btn.parentElement.parentElement.remove();
			});	
		})
	}
}

class AcceptButton{
	constructor(OBJ) {
		const self = this;
		this.btn = OBJ.btn;
		this.user = OBJ.user;
		this.btn.addEventListener("click", function(){
			$.get("/acceptfriend?user="+escape(self.user), function(OBJ) {
				self.btn.parentElement.parentElement.remove();
			});	
		})
	}
}

class RemoveButton{
	constructor(OBJ) {
		const self = this;
		this.btn = OBJ.btn;
		this.user = OBJ.user;
		this.btn.addEventListener("click", function(){
			$.get("/removefriend?user="+escape(self.user), function(OBJ) {
				self.btn.parentElement.parentElement.remove(); // two parents abovve
			});	
		})
	}
}


document.getElementById("user-button").addEventListener("click",function(){
	hideAll();
	document.getElementById('user-holder-user').style.display = "block";
	document.getElementById('user-button').className = "user-header-buttons-active";
})
document.getElementById("user-items").addEventListener("click",function(){
	hideAll();
	document.getElementById("user-holder-items").style.display = "block";
	document.getElementById('user-items').className = "user-header-buttons-active";
})
document.getElementById("user-friends").addEventListener("click",function(){
	hideAll();
	document.getElementById("user-holder-friends").style.display = "block";
	document.getElementById('user-friends').className = "user-header-buttons-active";
})
document.getElementById("user-requests").addEventListener("click",function(){
	hideAll();
	document.getElementById("user-holder-requests").style.display = "block";
	document.getElementById('user-requests').className = "user-header-buttons-active";
})

document.getElementById("add-friend-btn").addEventListener("click",function(){
	const user = document.getElementById("add-friend-user-name").value;
	console.log(user);
	document.getElementById('add-friend-success').style.display = "none";
	if(user.length >= 8 && user.length <= 15){
		document.getElementById('add-friend-error').style.display = "none";
		$.get("/addfriend?user="+escape(user), function(OBJ) {
			if(OBJ.error!=null){
				addFriendError(OBJ.error);
			}else{
				document.getElementById('add-friend-success').style.display = "block";
			}
		});
	}else{
		addFriendError("wrong amount of characters");
	}
})

const denyBtns = document.getElementsByClassName("friend-requests-deny");
const denyArray = [];
for(let i = 0;i<denyBtns.length; i++){
	denyArray.push(new DenyButton({btn:denyBtns[i],user:denyBtns[i].dataset.user}))
}

const acceptBtns = document.getElementsByClassName("friend-requests-accept");
const acceptArray = [];
for(let i = 0;i<acceptBtns.length; i++){
	acceptArray.push(new AcceptButton({btn:acceptBtns[i],user:acceptBtns[i].dataset.user}))
}

const removeBtns = document.getElementsByClassName("friend-remove");
const removeArray = [];
for(let i = 0;i<removeBtns.length; i++){
	removeArray.push(new RemoveButton({btn:removeBtns[i],user:removeBtns[i].dataset.user}))
}

document.getElementById("add-friend-btn").addEventListener("click",function(){
	const user = document.getElementById("add-friend-user-name").value;
	console.log(user);
	document.getElementById('add-friend-success').style.display = "none";
	if(user.length >= 8 && user.length <= 15){
		document.getElementById('add-friend-error').style.display = "none";
		$.get("/addfriend?user="+escape(user), function(OBJ) {
			console.log(OBJ)
			if(OBJ.error!=null){
				addFriendError(OBJ.error);
			}else{
				document.getElementById('add-friend-success').style.display = "block";
			}
		});
	}else{
		addFriendError("wrong amount of characters");
	}
})


function addFriendError(err){
	document.getElementById('add-friend-error').style.display = "block";
	document.getElementById('add-friend-error').innerHTML = err;
}



function hideAll(){
	const one = document.getElementsByClassName("user-header-buttons-active");
	for(let k = 0;k<one.length; k++){
		one[k].className = "user-header-buttons";
	}
	const collection = document.getElementsByClassName("user-section-holders");
	for(let i = 0;i<collection.length; i++){
		collection[i].style.display="none";
	}
}

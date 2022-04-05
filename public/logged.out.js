window.logged = {
	in:false,
}

document.getElementById("show-sign-up").addEventListener("click",function(){
	toggleSignUp(true);
})
document.getElementById("show-sign-in").addEventListener("click",function(){
	toggleSignUp(false);
})
function toggleSignUp(showSignUp){
	if(showSignUp){
		document.getElementById("login").style.display="none";
		document.getElementById("sign-up").style.display="block";
	}else{
		document.getElementById("login").style.display="block";
		document.getElementById("sign-up").style.display="none";
	}
}
var noddes = {
	init:function(data){
		console.log("Init");
		noddes.initEvents();
	},
	initEvents:function(){
		noddes.initKeyboard();
		//Mouse
		document.addEventListener('mousedown', noddes.events.startmove);
		document.addEventListener('mousemove', noddes.events.move);
		document.addEventListener('mouseup', noddes.events.endmove);
		//Touchpad
		document.addEventListener('touchstart', noddes.events.move);
		document.addEventListener('touchmove', noddes.events.move);
		document.addEventListener('touchend', noddes.events.move);/*function(e){
			
		});*/
		
	},
	events:{
		startmove:function(e){
			console.log('down');
			
			if(noddes.states.keyboardState.spkey){
				noddes.states.actionState.move=true;
				console.log("Init start")
				noddes.states.actionState.moveStart={
					x:e.clientX,
					y:e.clientY
				};
				noddes.states.nodesViewport.x=parseInt(document.getElementById("NodesPanel").children[0].style.marginLeft)
				noddes.states.nodesViewport.y=parseInt(document.getElementById("NodesPanel").children[0].style.marginTop)
				noddes.changeCursor("move");
			}
		},
		move:function(e){
			if(noddes.states.actionState.move){
				newx = noddes.states.nodesViewport.x+(-1)*(noddes.states.actionState.moveStart.x-e.clientX);
				newy = noddes.states.nodesViewport.y+(-1)*(noddes.states.actionState.moveStart.y-e.clientY);
				//console.log("Мы двигаем на "+newx+" и "+newy);
				//Учесть Scale

				if(newx*noddes.states.nodesViewport.z < 1500 && newx*noddes.states.nodesViewport.z > -1500 && newy*noddes.states.nodesViewport.z < 1500 && newy*noddes.states.nodesViewport.z > -1500){
					document.getElementById("NodesPanel").children[0].style.marginLeft=newx+"px";
					document.getElementById("NodesPanel").children[0].style.marginTop=newy+"px";
				}
				//
			}
			//console.log('move');
		},
		endmove:function(e){
			console.log('up');
			if(noddes.states.keyboardState.spkey){
				noddes.states.actionState.move=false;
				noddes.changeCursor("grab");
			}
		}
	},
	initKeyboard:function(){
		document.addEventListener('keydown', function(e){
			switch(e.keyCode){
				case 17: 
					if(!noddes.states.keyboardState.spkey){
						noddes.states.keyboardState.ctkey=true;
					}
				break;
				case 18: 
					if(!noddes.states.keyboardState.spkey){
						noddes.states.keyboardState.alkey=true;
					}
				break;
				case 16: 
					if(!noddes.states.keyboardState.spkey){
						noddes.states.keyboardState.shkey=true;
					}
				break;
				case 32: 
					if(!noddes.states.keyboardState.spkey){
						noddes.states.keyboardState.spkey=true;
						noddes.changeCursor("grab");
					}
				break;
			}
		}, false);
		document.addEventListener('keyup', function(e){
			switch(e.keyCode){
				case 17: noddes.states.keyboardState.ctkey=false;break;
				case 18: noddes.states.keyboardState.alkey=false;break;
				case 16: noddes.states.keyboardState.shkey=false;break;
				case 32: 
					noddes.states.keyboardState.spkey=false;
					noddes.changeCursor("default");
				break;
			}
		}, false);

	},
	changeCursor:function(cursorType){
		document.getElementById("NodesPanel").style.cursor=cursorType;
		if(cursorType=="grab"){//if needs webkit Kostyl for chrome
			document.getElementById("NodesPanel").style.cursor="-webkit-"+cursorType;
		}
		console.log("Курсор: "+cursorType)
	},
	data:[
		{
			type:"text",
			color:"#fff000",
			x:335,
			y:169,
			//...
			data:{
				text:"Hello World",
				font:"Arial",
				//...
				size:"20"
			}
		}
	],
	states:{
		keyboardState:{
			ctkey:false,
			alkey:false,
			shkey:false,
			spkey:false
		},
		actionState:{
			move:false,//Перемещение по холсту
			moveStart:{
				x:null,
				y:null
			}
		},
		nodesViewport:{
			x:0,
			y:0,
			z:1//Zoom
		}
	}
}

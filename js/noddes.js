var noddes = {
	init:function(data){
		console.log("Init");
		noddes.initEvents();
	},
	initEvents:function(){
		noddes.initKeyboard();
		document.addEventListener('mousedown', function(e){
			console.log('down');
			
			if(noddes.states.keyboardState.spkey){
				noddes.states.actionState.move=true;
				console.log("Init start")
				noddes.states.actionState.moveStart={
					x:e.clientX,
					y:e.clientY
				};
				noddes.states.nodesViewport={
					x:parseInt(document.getElementById("NodesPanel").children[0].style.marginLeft),
					y:parseInt(document.getElementById("NodesPanel").children[0].style.marginTop)
				}
				noddes.changeCursor("move");
			}
			
		});
		document.addEventListener('mouseup', function(e){
			console.log('up');
			if(noddes.states.keyboardState.spkey){
				noddes.states.actionState.move=false;
				noddes.changeCursor("grab");
			}
		});
		document.addEventListener('mousemove', function(e){
			
			if(noddes.states.actionState.move){
				//console.log(e);
				//
				newx = noddes.states.actionState.moveStart.x-e.clientX;
				newy = noddes.states.actionState.moveStart.y-e.clientY;
				//console.log("Мы двигаем на "+newx+" и "+newy);
				document.getElementById("NodesPanel").children[0].style.marginLeft=noddes.states.nodesViewport.x+(-1)*newx+"px";
				document.getElementById("NodesPanel").children[0].style.marginTop=noddes.states.nodesViewport.y+(-1)*newy+"px";
				
				//
			}
			//console.log('move');
		});
		
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
			y:0
		}
	}
}

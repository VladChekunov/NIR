var noddes = {
	init:function(data){
		console.log("Init");
		noddes.initEvents();
		noddes.renderData();
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
		document.addEventListener('touchend', noddes.events.move);
		document.body.addEventListener("wheel", noddes.events.scroll);
			
		document.childNodes[1].focus();
		
	},
	renderData:function(){//Render Data on NodeTree		
		for(var i = 0; i<noddes.data.length;i++){
			newNode = document.createElement("div");
			newNode.innerHTML=noddes.data[i].name;
			newNode.style.background=noddes.data[i].color;
			newNode.className="NodeBox";
			newNode.setAttribute("data-id", noddes.data[i].id);
			newNode.style.transform="rotate(0deg) translate("+noddes.data[i].x+"px, "+noddes.data[i].y+"px)";

			document.getElementsByClassName("NodesContainer")[0].appendChild(newNode);
		}
		noddes.reRenderData();
	},
	reRenderData:function(e){

		document.getElementById("NodesPanel").children[0].style.marginLeft = noddes.states.nodesViewport.x+"px";//=;
		document.getElementById("NodesPanel").children[0].style.marginTop = noddes.states.nodesViewport.y+"px";//=parseInt();

		//scale Canvas
		document.getElementsByClassName("NodesContainer")[0].style.width=(1400*noddes.states.nodesViewport.z)+"px";
		document.getElementsByClassName("NodesContainer")[0].style.height=(1000*noddes.states.nodesViewport.z)+"px";
		//Move Nodes
		for(var i = 0;i<document.getElementsByClassName("NodeBox").length;i++){
			for(var j=0;j<noddes.data.length;j++){
				if(noddes.data[j].id==document.getElementsByClassName("NodeBox")[i].getAttribute("data-id")){
					document.getElementsByClassName("NodeBox")[i].style.transform="rotate(0deg) translate("+noddes.states.nodesViewport.z*noddes.data[j].x+"px, "+noddes.states.nodesViewport.z*noddes.data[j].y+"px)";
				}
			}
		}


		if(1000*noddes.states.nodesViewport.z>1){
			//newx = 1200;
			//newy = 1200;
		}else{//menshe
			//newx = 200;
			//newy = 200;
		}
		//document.getElementById("NodesPanel").children[0].style.marginLeft=newx+"px";
		//document.getElementById("NodesPanel").children[0].style.marginTop=newy+"px";
		//Center
	},
	events:{
		zoomplus:function(e){
			noddes.states.nodesViewport.z+=0.1;

			deltax = Math.ceil(document.getElementsByClassName("NodesPanelWrapper")[0].offsetWidth/2)-noddes.states.nodesViewport.x;
			deltay = Math.ceil(document.getElementsByClassName("NodesPanelWrapper")[0].offsetHeight/2)-noddes.states.nodesViewport.y;

			//console.log("cx: "+centerx+", cy: "+centery+"\nax: "+noddes.states.nodesViewport.x+", ay: "+noddes.states.nodesViewport.y+"\ndx: "+deltax+", dy: "+deltay)
			
			noddes.states.nodesViewport.x -= deltax*0.1;
			noddes.states.nodesViewport.y -= deltay*0.1;

			noddes.reRenderData(e);
		},
		zoomminus:function(e){
			noddes.states.nodesViewport.z-=0.1;

			deltax = Math.ceil(document.getElementsByClassName("NodesPanelWrapper")[0].offsetWidth/2)-noddes.states.nodesViewport.x;
			deltay = Math.ceil(document.getElementsByClassName("NodesPanelWrapper")[0].offsetHeight/2)-noddes.states.nodesViewport.y;

			//console.log("cx: "+centerx+", cy: "+centery+"\nax: "+noddes.states.nodesViewport.x+", ay: "+noddes.states.nodesViewport.y+"\ndx: "+deltax+", dy: "+deltay)
			
			noddes.states.nodesViewport.x += deltax*0.1;
			noddes.states.nodesViewport.y += deltay*0.1;

			noddes.reRenderData(e);
		},
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
		scroll:function(e){
				e.preventDefault();
				if(noddes.states.keyboardState.ctkey){
					if(e.deltaY>0){//up
						noddes.events.zoomminus(e);
						return false;
					}else if(e.deltaY<0){//down
						noddes.events.zoomplus(e);
						return false;
					}
				}
				return false;
		},
		move:function(e){
			if(noddes.states.actionState.move){
				newx = noddes.states.nodesViewport.x+(-1)*(noddes.states.actionState.moveStart.x-e.clientX);
				newy = noddes.states.nodesViewport.y+(-1)*(noddes.states.actionState.moveStart.y-e.clientY);
				//console.log("Мы двигаем на "+newx+" и "+newy);
				//Учесть Scale

				if(newx < 1500*noddes.states.nodesViewport.z && newx > -1500*noddes.states.nodesViewport.z && newy < 1500*noddes.states.nodesViewport.z && newy > -1500*noddes.states.nodesViewport.z){
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
			noddes.states.nodesViewport.x = parseInt(document.getElementById("NodesPanel").children[0].style.marginLeft);
			noddes.states.nodesViewport.y = parseInt(document.getElementById("NodesPanel").children[0].style.marginTop);
		}
	},
	initKeyboard:function(){
		document.addEventListener('keydown', function(e){
			console.log(e);
			//173 61
			switch(e.keyCode){
				case 61: // -_
					if(noddes.states.keyboardState.alkey){
						noddes.events.zoomplus(e);
					}
				break;
				case 173: // =+
					if(noddes.states.keyboardState.alkey){
						noddes.events.zoomminus(e);
					}
				break;
				case 17: // ctrl
					if(!noddes.states.keyboardState.spkey){
						noddes.states.keyboardState.ctkey=true;
					}
				break;
				case 18: // alt
					if(!noddes.states.keyboardState.spkey){
						noddes.states.keyboardState.alkey=true;
					}
				break;
				case 16: // shift
					if(!noddes.states.keyboardState.spkey){
						noddes.states.keyboardState.shkey=true;
					}
				break;
				case 32: // space
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
			id:213,
			type:"text",
			color:"#fff000",
			name:"Sample Text Node",
			x:335,
			y:169,
			//...
			data:{
				text:"Hello World",
				font:"Arial",
				//...
				size:"20"
			},
			inputs:[],
			cache:null
		},
		{
			id:21,
			type:"image",
			color:"#fff000",
			name:"Sample Image",
			x:635,
			y:10,
			//...
			data:{
				text:"Hello World",
				font:"Arial",
				//...
				size:"20"
			},
			inputs:[],
			cache:null
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

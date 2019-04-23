var noddes = {
	init:function(data){
		console.log("Init");
		noddes.initEvents();
		noddes.data = data;		
		noddes.renderData();
		
	},
	initEvents:function(){
		noddes.initKeyboard();
		//Mouse
		document.addEventListener('mousedown', noddes.events.startmove);
		document.addEventListener('click', noddes.events.startclick);
		document.addEventListener('mousemove', noddes.events.move);
		document.addEventListener('mouseup', noddes.events.endmove);
		//Touchpad
		document.addEventListener('touchstart', noddes.events.move);
		document.addEventListener('touchmove', noddes.events.move);
		document.addEventListener('touchend', noddes.events.move);
		document.body.addEventListener("wheel", noddes.events.scroll);
			
		document.childNodes[1].focus();
		//Toolbar
		for(var i = 0; i<document.getElementsByClassName("ToolsContainer")[0].children.length;i++){
			let iter = i;
			document.getElementsByClassName("ToolsContainer")[0].children[i].addEventListener('click', 
				(function(e){
					iter = iter;
					noddes.events.changetool(iter);
				})
			);
		}
		
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
			for(var j = 0; j<noddes.data[i].inputs.length;j++){
				newLink = document.createElement("div");

				fromId=noddes.data[i].id;
				fromIndex=i;
				toId=noddes.data[i].inputs[j];//
				toIndex=noddes.nodes.getIndexById(toId);

				newLink.setAttribute("from-id", fromId);
				newLink.setAttribute("to-id", toId);
				newLink.className="NodeLine";

				xStart = noddes.data[toIndex].x+50;
				yStart = noddes.data[toIndex].y+20;

				linkWidth = noddes.data[fromIndex].x-noddes.data[toIndex].x;
				linkHeight = noddes.data[fromIndex].y-noddes.data[toIndex].y;
				if(linkWidth<2 && linkWidth>-2){
					linkWidth=2;
				}
				if(linkHeight<2 && linkHeight>-2){
					linkHeight=2;
				}
				

				newLink.innerHTML='<svg version="1.2" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="overflow: visible; width: '+linkWidth+'px; height: '+linkHeight+'px; opacity: 1; mix-blend-mode: normal;" viewBox="0 0 '+linkWidth+' '+linkHeight+'"><defs></defs><g><path style="stroke: rgb(0, 0, 0); stroke-width: 1; stroke-linecap: butt; stroke-linejoin: miter; fill: none;" d="M'+xStart+' '+yStart+' l'+linkWidth+' '+linkHeight+'"></path></g></svg>';
				document.getElementsByClassName("NodesContainer")[0].appendChild(newLink);
				

				console.log("line "+noddes.data[fromIndex].name+" - "+noddes.data[toIndex].name);
			
			}
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
		for(var i = 0;i<document.getElementsByClassName("NodeLine").length;i++){
			//get FromId and ToId
			fromId = document.getElementsByClassName("NodeLine")[i].getAttribute("from-id");
			fromIndex = noddes.nodes.getIndexById(fromId);
			toId = document.getElementsByClassName("NodeLine")[i].getAttribute("to-id");
			toIndex = noddes.nodes.getIndexById(toId);
			

			xStart = noddes.states.nodesViewport.z*noddes.data[toIndex].x+50;
			yStart = noddes.states.nodesViewport.z*noddes.data[toIndex].y+20;
			console.log(xStart+"_"+yStart);
			linkWidth = (noddes.data[fromIndex].x-noddes.data[toIndex].x)*noddes.states.nodesViewport.z;
			linkHeight = (noddes.data[fromIndex].y-noddes.data[toIndex].y)*noddes.states.nodesViewport.z;

			if(linkWidth<2 && linkWidth>-2){
				linkWidth=2;
			}
			if(linkHeight<2 && linkHeight>-2){
				linkHeight=2;
			}
			console.log(linkWidth+"_"+linkHeight);
			//change coords in 8 places
			document.getElementsByClassName("NodeLine")[i].children[0].style.width=linkWidth+"px";
			document.getElementsByClassName("NodeLine")[i].children[0].style.height=linkHeight+"px";
			document.getElementsByClassName("NodeLine")[i].children[0].setAttribute("viewBox","0 0 "+linkWidth+" "+linkHeight);
			document.getElementsByClassName("NodeLine")[i].children[0].children[1].children[0].setAttribute("d","M"+xStart+" "+yStart+" l "+linkWidth+" "+linkHeight);
			
		}
	},
	events:{
		startclick:function(e){
			if(noddes.states.actionState.action=="cursor"){
				if(e.target.className=="NodesContainer" || e.target.parentNode.className=="NodesContainer" || e.target.parentNode.parentNode.parentNode.parentNode.className=="NodesContainer"){
					if((!noddes.states.keyboardState.ctkey && !noddes.states.keyboardState.shkey) || e.target.className=="NodesContainer"){
						//Clear selected list
						noddes.props.clear();
						noddes.selected=[];
						for(var i = 0;i<document.getElementsByClassName("NodeBox").length;i++){
							if(document.getElementsByClassName("NodeBox")[i].getAttribute("data-selected")=="true"){
								document.getElementsByClassName("NodeBox")[i].removeAttribute("data-selected");
							}
						}
						for(var i = 0;i<document.getElementsByClassName("NodeLine").length;i++){
							if(document.getElementsByClassName("NodeLine")[i].getAttribute("data-selected")=="true"){
								document.getElementsByClassName("NodeLine")[i].removeAttribute("data-selected");
							}
						}
					}
				
					if(e.target.className=="NodeBox" && e.target.getAttribute("data-selected")==null){
						e.target.setAttribute("data-selected", "true");
						noddes.selected.push({
							type: "node",
							id: e.target.getAttribute("data-id")
						});
						if(noddes.selected.length==1){
							//PropsNodes
							noddes.props.open(e.target.getAttribute("data-id"));
						}else{
							noddes.props.stats();
						}
					}else if(e.target.tagName=="path" && e.target.parentNode.parentNode.parentNode.className=="NodeLine" && e.target.parentNode.parentNode.parentNode.getAttribute("data-selected")==null){
						e.target.parentNode.parentNode.parentNode.setAttribute("data-selected", "true");
						noddes.selected.push({
							type: "line",
							fromid: e.target.parentNode.parentNode.parentNode.getAttribute("from-id"),
							toid: e.target.parentNode.parentNode.parentNode.getAttribute("to-id")
						});
						if(noddes.selected.length==1){
							//PropsNodes
							noddes.props.open(e.target.parentNode.parentNode.parentNode.getAttribute("to-id"));
						}else{
							noddes.props.stats();
						}
					}
				}
			}

			console.log(e);
		},
		changetool:function(index){
			noddes.states.actionState.action = noddes.tools.toolsList[index];
			
			noddes.changeCursor(noddes.tools.cursorsList[index]);
			//alert()
		},
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
			if(noddes.states.actionState.action=="cursor" && true){//more of null obj
				//
			}
			if(noddes.states.keyboardState.spkey || noddes.states.actionState.action=="move"){
				//Move action
				noddes.states.actionState.move=true;
				console.log("Init start")
				noddes.states.actionState.moveStart={
					x:e.clientX,
					y:e.clientY
				};
				noddes.states.nodesViewport.x=parseInt(document.getElementById("NodesPanel").children[0].style.marginLeft)
				noddes.states.nodesViewport.y=parseInt(document.getElementById("NodesPanel").children[0].style.marginTop)
				noddes.changeCursor("move");
			}else if(noddes.states.actionState.action=="zoom"){
				if(noddes.states.keyboardState.ctkey){
					//-
					noddes.events.zoomminus(e);
					//alert(0);
				}else{
					//+
					noddes.events.zoomplus(e);
				}
				//alert("zoom");
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
			if(noddes.states.keyboardState.spkey || noddes.states.actionState.action=="move"){
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
			switch(e.keyCode){
				case 61: // -_
					if(noddes.states.keyboardState.alkey){
						noddes.events.zoomplus(e);
					}
				break;
				case 187: // -_
					if(noddes.states.keyboardState.alkey){
						noddes.events.zoomplus(e);
					}
					break;
				case 173: // =+
					if(noddes.states.keyboardState.alkey){
						noddes.events.zoomminus(e);
					}
				break;
				case 189: // =+
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
	props:{
		open:function(nid){
			document.getElementsByClassName("PropsContainer")[0].innerHTML="Selected Node";
		},
		stats:function(){
			document.getElementsByClassName("PropsContainer")[0].innerHTML="Selected "+noddes.selected.length+" objects.";
		},
		clear:function(){
			document.getElementsByClassName("PropsContainer")[0].innerHTML="Nothing selected.";
		}
	},
	tools:{
		toolsList:[
			"cursor", 
			"move", 
			"zoom", 
			"add"
		],
		cursorsList:[
			"default",
			"grab",
			"zoom-in",
			"copy"
		]
	},
	changeCursor:function(cursorType){
		document.getElementById("NodesPanel").style.cursor=cursorType;
		if(cursorType=="grab"){//if needs webkit Kostyl for chrome
			document.getElementById("NodesPanel").style.cursor="-webkit-"+cursorType;
		}
		console.log("Курсор: "+cursorType)
	},
	nodes:{
		getIndexById:function(nid){
			for(var i = 0;i<noddes.data.length;i++){
				if(noddes.data[i].id==nid){
					return i;
				}
			}
			return -1;
		}
	},
	selected:[],
	data:[],
	states:{
		keyboardState:{
			ctkey:false,
			alkey:false,
			shkey:false,
			spkey:false
		},
		toolsState:{
			active:"cursor"
		},
		actionState:{
			action: "cursor",
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

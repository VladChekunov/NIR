var noddes = {
	init:function(data){
		console.log("Init");
		noddes.initEvents();
		noddes.types.checkDefaultTypes();
		noddes.data = data;
		//noddes.data = JSON.parse("[{\"id\":0,\"type\":\"view\",\"color\":\"ff0000\",\"name\":\"View Node\",\"x\":422,\"y\":399,\"data\":{\"scale\":100,\"isTarget\":false},\"inputs\":[24],\"cache\":{}},{\"id\":22,\"type\":\"marge\",\"color\":\"fff000\",\"name\":\"marge\",\"x\":358,\"y\":192,\"data\":{\"top\":\"first\",\"size\":\"union\",\"offsetX\":120,\"offsetY\":0},\"inputs\":[21,213],\"cache\":{}},{\"id\":213,\"type\":\"text\",\"color\":\"fff000\",\"name\":\"Sample Text Node\",\"x\":270,\"y\":34,\"data\":{\"text\":\"Sample\\nText\\nRendering\",\"font\":\"Arial\",\"valign\":\"center\",\"halign\":\"center\",\"width\":120,\"height\":120,\"color\":\"000000\",\"size\":20},\"inputs\":[],\"cache\":{}},{\"id\":21,\"type\":\"image\",\"color\":\"fff000\",\"name\":\"Sample Image\",\"x\":635,\"y\":10,\"data\":{\"image\":{\"source\":\"C:\\\\fakepath\\\\ddddd.png\",\"data\":\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAIAAAC2BqGFAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4wYCCwsvPT311AAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAsElEQVR42u3QQREAAAQAMATRvyUpnM8WYTnRwb1SIFo0okWLRrRoRIsWjWjRiBYtGtGiES1aNKJFI1q0aESLRrRo0YgWjWjRohEtGtGiRSNaNKJFi0a0aESLFo1o0YgWLRrRohEtWjSiRSNatGhEi0a0aNGIFo1o0aIRLRrRokUjWjSiRYtGtGhEixaNaNGIFi0a0aIRLVo0okUjWrRoRItGtGjRiBaNaNGiES0a0f8WbSsCDfJ75mQAAAAASUVORK5CYII=\",\"format\":\"image/png\"}},\"inputs\":[],\"cache\":{}},{\"data\":{\"top\":\"first\",\"size\":\"union\",\"offsetX\":120,\"offsetY\":0},\"id\":23,\"x\":545,\"y\":190,\"cache\":{},\"type\":\"marge\",\"color\":\"fff000\",\"name\":\"marge\",\"inputs\":[213,21]},{\"id\":24,\"type\":\"marge\",\"color\":\"aaaaaa\",\"name\":\"Marge Node\",\"x\":455,\"y\":287,\"inputs\":[22,23],\"cache\":{},\"data\":{\"top\":\"first\",\"size\":\"union\",\"offsetX\":0,\"offsetY\":120}}]");
		noddes.renderData();
		noddes.render.init();
	},
	initEvents:function(){
		noddes.initKeyboard();
		//Mouse
		document.getElementById("NodesPanel").addEventListener('mousedown', noddes.events.startmove);
		document.getElementById("NodesPanel").addEventListener('click', noddes.events.startclick);
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
	updateNode:function(nid, index){
		if(index==undefined){
			index = noddes.nodes.getIndexById(nid);
		}
		node = document.querySelector('div.NodeBox[data-id="'+nid+'"]');
		//type color name x y
		//inputs
		node.style.background="#"+noddes.data[index].color;
		node.innerHTML=noddes.data[index].name;
		//node.style.transform="rotate(0deg) translate("+noddes.data[index].x+"px, "+noddes.data[index].y+"px)";
		links = document.querySelectorAll('div.NodeLine[from-id="'+nid+'"]');
		for(var i = 0;i<links.length;i++){
			document.getElementsByClassName("NodesContainer")[0].removeChild(links[i]);
		}

		fromId = noddes.data[index].id;
		fromIndex = index;
		for(var i = 0;i<noddes.data[index].inputs.length;i++){
			toId = noddes.data[index].inputs[i];
			toIndex = noddes.nodes.getIndexById(toId);
			noddes.renderLink(fromId, fromIndex, toId, toIndex);
		}

		noddes.reRenderData();
		
	},
	renderLink:function(fromId, fromIndex, toId, toIndex){
				newLink = document.createElement("div");


				newLink.setAttribute("from-id", fromId);
				newLink.setAttribute("to-id", toId);
				newLink.className="NodeLine";
				
				//To
				xStart = noddes.data[toIndex].x+50;
				yStart = noddes.data[toIndex].y+20;

				//From
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
		
	},
	renderDataByIndex:function(i){
			newNode = document.createElement("div");
			newNode.innerHTML=noddes.data[i].name;
			newNode.style.background="#"+noddes.data[i].color;
			newNode.className="NodeBox";
			newNode.setAttribute("data-id", noddes.data[i].id);
			newNode.style.transform="rotate(0deg) translate("+noddes.data[i].x+"px, "+noddes.data[i].y+"px)";

			document.getElementsByClassName("NodesContainer")[0].appendChild(newNode);
			for(var j = 0; j<noddes.data[i].inputs.length;j++){

				fromId=noddes.data[i].id;
				fromIndex=i;
				toId=noddes.data[i].inputs[j];
				toIndex=noddes.nodes.getIndexById(toId);

				noddes.renderLink(fromId, fromIndex, toId, toIndex);
			}
	},
	renderData:function(){//Render Data on NodeTree		
		for(var i = 0; i<noddes.data.length;i++){
			noddes.renderDataByIndex(i);
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
		imageUploaded:function(el){//
			//console.log);
			file = el.files[0];
			var reader = new FileReader();
			reader.readAsDataURL(file);
			//.value = el.value;
			reader.onload = function(e){
				if(e.target.readyState == FileReader.DONE){
					var img = el.nextSibling.children[0];
					img.src = e.target.result;
					//console.log(img);
				}
			}
		},
		createnode:function(e){
			newNode = {};
			newNode.id = noddes.nodes.genNewId();
			newNode.type = noddes.props.types[parseInt(document.getElementById("newNodeSelect").value)];
			newNode.color="aaaaaa";
			newNode.name=noddes.props.typesNames[parseInt(document.getElementById("newNodeSelect").value)];
			newNode.x = noddes.states.newNode.x;
			newNode.y = noddes.states.newNode.y;
			newNode.inputs = [];
			newNode.cache = null;

			newNode.data = {};			
			for(var i = 0;i<noddes.props.typesprops[parseInt(document.getElementById("newNodeSelect").value)].length;i++){
				newNode.data[noddes.props.typesprops[parseInt(document.getElementById("newNodeSelect").value)][i].type]=noddes.props.typesprops[parseInt(document.getElementById("newNodeSelect").value)][i].def;
			}
			noddes.data.push(newNode);
			noddes.renderDataByIndex(noddes.data.length-1);
			noddes.windows.clearModalWindows();
		},
		addnode:function(e){
			noddes.states.newNode.x = e.clientX-noddes.states.nodesViewport.x;
			noddes.states.newNode.y = e.clientY-noddes.states.nodesViewport.y;
			noddes.windows.addNewNodeWindow();
		},
		startclick:function(e){
			if(noddes.states.actionState.action=="add"){
				noddes.states.actionState.action="cursor";
				noddes.changeCursor(noddes.tools.cursorsList[0]);
				noddes.events.addnode(e);
			}else if(noddes.states.actionState.action=="cursor"){
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
		},
		removenode:function(e){
			selected = document.querySelectorAll('[data-selected=true]');
			for(var i =0;i<selected.length;i++){
				var nodeID = selected[i].getAttribute("data-id");
				var fromLinks = document.querySelectorAll('.NodeLine[from-id="'+nodeID+'"]');
				var toLinks = document.querySelectorAll('.NodeLine[to-id="'+nodeID+'"]');

				for(var j = 0;j<toLinks.length;j++){
					toLinks[j].parentNode.removeChild(toLinks[j]);
				}
				for(var j = 0;j<fromLinks.length;j++){
					fromLinks[j].parentNode.removeChild(fromLinks[j]);
				}
				selected[i].parentNode.removeChild(selected[i]);
				
				noddes.nodes.removeById(nodeID);
			}
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
		startmove:function(e){
			console.log('down');
			if(noddes.states.actionState.action=="cursor" && noddes.selected.length>0){//more of null obj
				noddes.states.actionState.nodemove=true;
				console.log("Start Move objects");
				noddes.states.actionState.moveStart={
					x:e.clientX,
					y:e.clientY
				};
				noddes.changeCursor("move");
			}else if(noddes.states.keyboardState.spkey || noddes.states.actionState.action=="move"){
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
				}else{
					//+
					noddes.events.zoomplus(e);
				}
			}
		},
		move:function(e){
			if(noddes.states.actionState.nodemove){
				newx = (-1)*(noddes.states.actionState.moveStart.x-e.clientX);
				newy = (-1)*(noddes.states.actionState.moveStart.y-e.clientY);
				
				selected = document.querySelectorAll('[data-selected=true]');
				for(var i =0;i<selected.length;i++){
					comp = getComputedStyle(document.querySelectorAll('[data-selected=true]')[i]).transform.split(", ");

					document.querySelectorAll('[data-selected=true]')[i].style.transform="rotate(0deg) translate("+(newx+parseInt(comp[4]))+"px, "+(newy+parseInt(comp[5]))+"px)";
					var nodeID = selected[i].getAttribute("data-id");
					var nodeIndex = noddes.nodes.getIndexById(nodeID);

					var fromLinks = document.querySelectorAll('.NodeLine[from-id="'+nodeID+'"]');
					var toLinks = document.querySelectorAll('.NodeLine[to-id="'+nodeID+'"]');
					console.log("TODO Относительно DOM, а не data");
					//noddes.data[fromIndex].x -> DOM////
					for(var j = 0;j<toLinks.length;j++){
						fromIndex = noddes.nodes.getIndexById(toLinks[j].getAttribute("from-id"));
						xStart = noddes.states.nodesViewport.z*(newx+parseInt(comp[4]))+50;
						yStart = noddes.states.nodesViewport.z*(newy+parseInt(comp[5]))+20;
						
						linkWidth = (noddes.data[fromIndex].x-(newx+parseInt(comp[4])))*noddes.states.nodesViewport.z;
						linkHeight = (noddes.data[fromIndex].y-(newy+parseInt(comp[5])))*noddes.states.nodesViewport.z;

						if(linkWidth<2 && linkWidth>-2){
							linkWidth=2;
						}

						if(linkHeight<2 && linkHeight>-2){
							linkHeight=2;
						}
						toLinks[j].children[0].style.width=linkWidth+"px";
						toLinks[j].children[0].style.height=linkHeight+"px";
						toLinks[j].children[0].setAttribute("viewBox","0 0 "+linkWidth+" "+linkHeight);
						toLinks[j].children[0].children[1].children[0].setAttribute("d","M"+xStart+" "+yStart+" l "+linkWidth+" "+linkHeight);
					}

					for(var j = 0;j<fromLinks.length;j++){
						toIndex = noddes.nodes.getIndexById(fromLinks[j].getAttribute("to-id"));
						if(toIndex!=-1){
							xStart = noddes.states.nodesViewport.z*(newx+parseInt(comp[4]))+50;
							yStart = noddes.states.nodesViewport.z*(newy+parseInt(comp[5]))+20;
							
							linkWidth = (noddes.data[toIndex].x-(newx+parseInt(comp[4])))*noddes.states.nodesViewport.z;
							linkHeight = (noddes.data[toIndex].y-(newy+parseInt(comp[5])))*noddes.states.nodesViewport.z;

							if(linkWidth<2 && linkWidth>-2){
								linkWidth=2;
							}

							if(linkHeight<2 && linkHeight>-2){
								linkHeight=2;
							}
							fromLinks[j].children[0].style.width=linkWidth+"px";
							fromLinks[j].children[0].style.height=linkHeight+"px";
							fromLinks[j].children[0].setAttribute("viewBox","0 0 "+linkWidth+" "+linkHeight);
							fromLinks[j].children[0].children[1].children[0].setAttribute("d","M"+xStart+" "+yStart+" l "+linkWidth+" "+linkHeight);
						}
					}

				}
				noddes.states.actionState.moveStart={
					x:e.clientX,
					y:e.clientY
				};
			}else if(noddes.states.actionState.move){
				newx = noddes.states.nodesViewport.x+(-1)*(noddes.states.actionState.moveStart.x-e.clientX);
				newy = noddes.states.nodesViewport.y+(-1)*(noddes.states.actionState.moveStart.y-e.clientY);
				//
				//document.getElementsByClassName("NodeBox")[i].getAttribute("data-id")
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
			//console.log('up');
			if(noddes.states.actionState.action=="cursor" && noddes.states.actionState.nodemove==true){
				//2019
				selected = document.querySelectorAll('[data-selected=true]');
				for(var i =0;i<selected.length;i++){
					var nodeID = selected[i].getAttribute("data-id");
					var nodeIndex = noddes.nodes.getIndexById(nodeID);
					//console.log(nodeIndex+"#######");
					if(nodeIndex!=-1){
						newdata = getComputedStyle(document.querySelectorAll('[data-selected=true]')[i]).transform.split(" ");
						noddes.data[nodeIndex].x = parseInt(newdata[4]);
						noddes.data[nodeIndex].y = parseInt(newdata[5]);
					}
					//console.log(noddes.data[nodeIndex].x+"x"+noddes.data[nodeIndex].y);
				}
				noddes.states.actionState.nodemove=false;
				noddes.changeCursor("default");
			}
			if(noddes.states.keyboardState.spkey || noddes.states.actionState.action=="move"){
				noddes.states.actionState.move=false;
				noddes.changeCursor("grab");
			}
			//Todo MOVE all coords in loop
			noddes.states.nodesViewport.x = parseInt(document.getElementById("NodesPanel").children[0].style.marginLeft);
			noddes.states.nodesViewport.y = parseInt(document.getElementById("NodesPanel").children[0].style.marginTop);
		}
	},
	initKeyboard:function(){
		document.addEventListener('keydown', function(e){
			console.log(e);
			switch(e.keyCode){
				case 46: // Del
					noddes.events.removenode();
				break;
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
					if(!noddes.states.keyboardState.ctkey){
						noddes.states.keyboardState.ctkey=true;
					}
				break;
				case 18: // alt
					if(!noddes.states.keyboardState.alkey){
						noddes.states.keyboardState.alkey=true;
					}
				break;
				case 16: // shift
					if(!noddes.states.keyboardState.shkey){
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
	types:{
		typesList:[],
		defaultTypes:["Arial","Impact","Helvetica","Courier New","Courier","Verdana","Georgia","Palatino","Garamond","Bookman","Comic Sans MS","Trebuchet MS","Arial Black","Impact","Times New Roman","Times","Roboto","Segoe UI","Liberation Serif"],
		checkDefaultTypes:function(){
			var baseFonts = ['monospace', 'sans-serif', 'serif'];
    			var defaultWidth = {};
    			var defaultHeight = {};

			var s = document.createElement("span");
			s.style.fontSize = '72px';
			s.innerHTML = 'abcdefghijklmnopqrstuvwxyz';
			document.body.appendChild(s);
    			for (var index in baseFonts) {
				s.style.fontFamily = baseFonts[index];
				defaultWidth[index]=s.offsetWidth;
				defaultHeight[index]=s.offsetHeight;
			}
			//console.log(defaultWidth)
			for(var index in noddes.types.defaultTypes){
				var original = true;
				for(var i = 0; i<3; i++){
					s.style.fontFamily = noddes.types.defaultTypes[index]+", "+baseFonts[i];
					if(s.offsetWidth==defaultWidth[i] && s.offsetHeight==defaultHeight[i]){
						original=false;
						break;
					}
					
				}
				if(original){
					noddes.types.typesList.push(noddes.types.defaultTypes[index]);
				}
			}
			console.log(noddes.types.typesList);
			document.body.removeChild(s);
		},
		getFonts:function(o){
			offsets = o.getBoundingClientRect();
			pastePlace=o.parentNode.children[0];
			noddes.windows.showSelectFontWin(Math.floor(offsets.left)-window.innerWidth/4, Math.floor(offsets.top)+24, pastePlace);
		},
		checkFont(fontName){
			alert("TODO CHECK USER TYPED FONT");
		}
	},
	windows:{
		showSelectColorWin:function(x,y,pp){
			col = pp.style.backgroundColor;
			col = col.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(,\s*\d+\.*\d+)?\)$/);
			r=col[1];
			g=col[2];
			b=col[3];
			result = "<div style=\"position:absolute;width:200px;right:auto;top:"+y+"px;left:"+x+"px;\" class=\"modalWindow\"><span>Select color:</span><br></div>";

			document.getElementsByClassName("popupPanel")[0].innerHTML=result;

			var colorPreview = document.createElement("div");
			colorPreview.className = "colorPreview";
			var oldColor = document.createElement("div");
			oldColor.style.background = pp.style.backgroundColor;
			var newColor = document.createElement("div");
			newColor.style.background = pp.style.backgroundColor;

			var redColor = document.createElement("input");
			redColor.className = "colorPickerRed";
			redColor.type = "number";
			redColor.max = 255;
			redColor.value = r;

			var greenColor = document.createElement("input");
			greenColor.className = "colorPickerGreen";
			greenColor.type = "number";
			greenColor.max = 255;
			greenColor.value = g;

			var blueColor = document.createElement("input");
			blueColor.className = "colorPickerBlue";
			blueColor.type = "number";
			blueColor.max = 255;
			blueColor.value = b;

			document.getElementsByClassName("modalWindow")[0].appendChild(document.createTextNode("R: "));
			document.getElementsByClassName("modalWindow")[0].appendChild(redColor);
			document.getElementsByClassName("modalWindow")[0].appendChild(document.createElement("br"));

			document.getElementsByClassName("modalWindow")[0].appendChild(document.createTextNode("G: "));
			document.getElementsByClassName("modalWindow")[0].appendChild(greenColor);
			document.getElementsByClassName("modalWindow")[0].appendChild(document.createElement("br"));

			document.getElementsByClassName("modalWindow")[0].appendChild(document.createTextNode("B: "));
			document.getElementsByClassName("modalWindow")[0].appendChild(blueColor);
			document.getElementsByClassName("modalWindow")[0].appendChild(document.createElement("br"));

			changeColor=function(){
				newColor.style.background = "rgb("+redColor.value+", "+greenColor.value+", "+blueColor.value+")";
			}
			redColor.onchange=changeColor;
			greenColor.onchange=changeColor;
			blueColor.onchange=changeColor;

			colorPreview.appendChild(oldColor);
			colorPreview.appendChild(newColor);

			document.getElementsByClassName("modalWindow")[0].appendChild(colorPreview);

			var a = document.createElement("a");
			document.getElementsByClassName("modalWindow")[0].appendChild(a);
			a.innerHTML="Change";
			a.href="javascript://";
			a.className="btn";
			a.onclick=function(){
				pp.style.backgroundColor = "#"+noddes.colors.rgbToHex("rgb("+document.getElementsByClassName("colorPickerRed")[0].value+", "+document.getElementsByClassName("colorPickerGreen")[0].value+", "+document.getElementsByClassName("colorPickerBlue")[0].value+")");
				noddes.windows.clearModalWindows();
			}

			var c = document.createElement("a");
			document.getElementsByClassName("modalWindow")[0].appendChild(c);
			c.innerHTML="Cancel";
			c.href="javascript://";
			c.className="btn";
			c.onclick=function(){noddes.windows.clearModalWindows();}
			noddes.windows.makeWindowDraggable(document.getElementsByClassName("popupPanel")[0].children[0], false);
			
		},
		showSelectFontWin:function(x,y,pp){
			result = "<div style=\"position:absolute;width:25vw;right:auto;top:"+y+"px;left:"+x+"px;\" class=\"modalWindow\"><span>Select font:</span></div>";
			document.getElementsByClassName("popupPanel")[0].innerHTML=result;
			for(i = 0;i<noddes.types.typesList.length;i++){
				var a = document.createElement("a");
				document.getElementsByClassName("modalWindow")[0].appendChild(a);
				a.innerHTML=noddes.types.typesList[i];
				a.href="javascript://";
				a.className="fontListEl";
				a.onclick=function(){
					pp.value = this.innerHTML;
					noddes.windows.clearModalWindows();
				}
			}
			document.getElementsByClassName("popupPanel")[0].querySelector(".modalWindow").innerHTML += "<a class=\"btn\" onclick=\"noddes.windows.clearModalWindows()\" href=\"javascript://\">Cancel</a>";
			noddes.windows.makeWindowDraggable(document.getElementsByClassName("popupPanel")[0].children[0], false);
			
		},
		getElementHTML:function(nid){
			var nodeIndex = noddes.nodes.getIndexById(nid);
			return '<div class="listElement" data-id="'+nid+'"><span>'+noddes.data[nodeIndex].name+'</span><a onclick="this.parentNode.parentNode.removeChild(this.parentNode);" class="rembtn" href="javascript://"><i style="font-size:24px" class="fa">&#xf00d;</i></a>'+'<a onclick="if(this.parentNode.nextSibling){var cin = this.parentNode.nextSibling.children[0].innerHTML;this.parentNode.nextSibling.children[0].innerHTML=this.parentNode.children[0].innerHTML;this.parentNode.children[0].innerHTML=cin;var cid = this.parentNode.nextSibling.getAttribute(\'data-id\');this.parentNode.nextSibling.setAttribute(\'data-id\', this.parentNode.getAttribute(\'data-id\'));this.parentNode.setAttribute(\'data-id\', cid);}" class="movbtn" href="javascript://"><i style="font-size:24px" class="fa">&#xf0d7;</i></a>'+'<a onclick="if(this.parentNode.previousSibling){var cin = this.parentNode.previousSibling.children[0].innerHTML;this.parentNode.previousSibling.children[0].innerHTML=this.parentNode.children[0].innerHTML;this.parentNode.children[0].innerHTML=cin;var cid = this.parentNode.previousSibling.getAttribute(\'data-id\');this.parentNode.previousSibling.setAttribute(\'data-id\', this.parentNode.getAttribute(\'data-id\'));this.parentNode.setAttribute(\'data-id\', cid);};" class="movbtn" href="javascript://"><i style="font-size:24px" class="fa">&#xf0d8;</i></a></div>';
			
		},
		changeElement:function(nid){
			document.getElementsByClassName('nodesList')[0].innerHTML+=noddes.windows.getElementHTML(nid);
			noddes.windows.clearModalWindows();
		},
		addChangeElementWindow:function(){
			result = "<div class=\"modalWindow\">Select node from list:<br>";
			//console.log()
			for(var i = 0;i<noddes.data.length;i++){
				result += "<a class='nodeListEl' onclick='noddes.windows.changeElement("+noddes.data[i].id+")' href='javascript://'>"+noddes.data[i].name+"</a>";
			}
			result += "<a class=\"btn\" onclick=\"noddes.windows.clearModalWindows()\" href=\"javascript://\">Cancel</a>";
			result += "</div>";
			document.getElementsByClassName("popupPanel")[0].innerHTML=result;
			noddes.windows.makeWindowDraggable(document.getElementsByClassName("popupPanel")[0].children[0], true);
		},
		makeWindowDraggable:function(windowNode, isCenter){
			var draggable = document.createElement("div");
			draggable.className="draggableZone";
			draggable.innerHTML="<i class=\"fas fa-grip-vertical\"></i>";
			draggable.onmousedown=function(e){
				var pos = [0, 0, 0, 0];
				e.preventDefault();
				pos[0] = e.clientX;
				pos[1] = e.clientY;
				draggable.onmousemove=function(e){
					e.preventDefault();
					pos[2] = pos[0] - e.clientX;
					pos[3] = pos[1] - e.clientY;
					pos[0] = e.clientX;
					pos[1] = e.clientY;
					windowNode.style.left = (windowNode.offsetLeft - pos[2])+"px";
					windowNode.style.top = (windowNode.offsetTop - pos[3])+"px";
				}
				draggable.onmouseup=function(){
					draggable.onmousemove = null;
					draggable.onmouseup = null;
				}
			}
			if(isCenter){
				windowNode.style.position="absolute";
				windowNode.style.margin="inherit";
				windowNode.style.left=((window.innerWidth/2)-(windowNode.clientWidth/2))+"px";
				windowNode.style.top=((window.innerHeight/2)-(windowNode.clientHeight/2)-60)+"px";
			}
			//windowNode.appendChild(draggable);
			windowNode.insertBefore(draggable, windowNode.firstChild);
		},
		addNewNodeWindow:function(){
			result = "<div class=\"modalWindow\">New Node<br><select id=\"newNodeSelect\">";
			for(var i = 0;i<noddes.props.types.length;i++){
				result+="<option value=\""+i+"\">"+noddes.props.typesNames[i]+"</option>";
			}
			result+="</select><br><a class=\"btn\" onclick=\"noddes.events.createnode();\" href=\"javascript://\">Add</a> <a class=\"btn\" onclick=\"noddes.windows.clearModalWindows()\" href=\"javascript://\">Cancel</a></div>";
			document.getElementsByClassName("popupPanel")[0].innerHTML=result;
			noddes.windows.makeWindowDraggable(document.getElementsByClassName("popupPanel")[0].children[0], true);
		},
		errorMsg:function(msg){
			result = "<div class=\"modalWindow\">Ошибка: "+msg+"<br><a class=\"btn\" onclick=\"noddes.windows.clearModalWindows()\" href=\"javascript://\">Ok</a></div>";
			document.getElementsByClassName("popupPanel")[0].innerHTML=result;
			noddes.windows.makeWindowDraggable(document.getElementsByClassName("popupPanel")[0].children[0], true);
		},
		clearModalWindows:function(){
			document.getElementsByClassName("popupPanel")[0].innerHTML="";
		}
	},
	colors:{
		rgbToHex:function(rgb){
			function hex(x){return ("0" + parseInt(x).toString(16)).slice(-2);}
			rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(,\s*\d+\.*\d+)?\)$/);
			return hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
		},
		selectColor:function(o){
			offsets = o.getBoundingClientRect();;
			noddes.windows.showSelectColorWin(Math.floor(offsets.left)-200, Math.floor(offsets.top)+24, o);
		}
	},
	props:{
		showProps:function(){
			if(document.querySelectorAll(".PropsContainer .tabs")[0].children[1].className=="act"){
				document.querySelectorAll(".PropsContainer .tabs")[0].children[0].classList.add("act");
				document.querySelectorAll(".PropsContainer .tabs")[0].children[1].classList.remove("act");
				document.getElementsByClassName("datasArea")[0].style.display="none";
				document.getElementsByClassName("propsArea")[0].style.display="block";
			}
		},
		showDatas:function(){
			if(document.querySelectorAll(".PropsContainer .tabs")[0].children[0].className=="act"){
				document.querySelectorAll(".PropsContainer .tabs")[0].children[1].classList.add("act");
				document.querySelectorAll(".PropsContainer .tabs")[0].children[0].classList.remove("act");
				document.getElementsByClassName("propsArea")[0].style.display="none";
				document.getElementsByClassName("datasArea")[0].style.display="block";
			}
		},
		types:[//Types of nodes
			"view",
			"text",
			"image",
			"marge",
			"scale"
		],
		typesNames:[
			"View Node",
			"Text Node",
			"Image Node",
			"Marge Node",
			"Scale Node"
		],
		typesprops:[//Fields of nodes types
			[//view
				{
					name: "Scale",
					type: "scale",
					unit: "%",
					def: 100,
					propel: 1
				},
				{
					name: "Target",
					type: "isTarget",
					def: false,
					propel: 8
				}
			],
			[//text
				{
					name: "Content",
					type: "text",
					def: "",//default value
					propel: 6
				//	min: 0,
				//	max: 20,
				//	...
					//
				},
				{
					name: "Font",
					type: "font",
					def: "Arial",
					propel: 2
				},
				{
					name: "Size",
					type: "size",
					unit: "px",
					def: 18,
					propel: 1
				},
				{
					name: "HAlign",
					type: "halign",
					vars: ["top", "center", "bottom"],
					def: "top",
					propel: 3
				},
				{
					name: "VAlign",
					type: "valign",
					vars: ["left", "center", "right"],
					def: "left",
					propel: 3
				},
				{
					name: "Height",
					type: "height",
					def: "120",
					unit: "px",
					propel: 1
				},
				{
					name: "Width",
					type: "width",
					def: "180",
					unit: "px",
					propel: 1
				},
				{
					name: "Color",
					type: "color",
					def: "000000",
					propel: 4
				},
			],
			[//image
				{
					name: "Image",
					type: "image",
					def: {
						source: null,
						data: null,
						format: null
					},
					propel: 7
				}
			],
			[//marge
				{
					name: "top",
					type: "top",
					vars: ["first", "second"],
					def: "first",
					propel: 3
				},
				{
					name: "Size",
					type: "size",
					vars: ["first", "second", "union", "difference"],
					def: "first",
					propel: 3
				},
				{
					name: "Offset X",
					type: "offsetX",
					def: 0,
					unit: "px",
					propel: 1
				},
				{
					name: "Offset Y",
					type: "offsetY",
					def: 0,
					unit: "px",
					propel: 1
				}
			],
			[//scale
				{
					name: "Width",
					type: "width",
					def: 100,
					unit: "px",
					propel: 1
				},
				{
					name: "Height",
					type: "height",
					def: 100,
					unit: "px",
					propel: 1
				}
			]
		],
		propselslist:[
			{//Text field
				add:function(typeprop, val){
					return typeprop.name+": <input value='"+val+"'>";
				},
				get:function(fieldDOMNode){
					//console.log(fieldDOMNode);
					//document.getElementsByClassName("datasArea")[0].getElementsByClassName("field")[0]
					return fieldDOMNode.children[0].value;
				}
			},
			{//Numberic field
				add:function(typeprop, val){
					return typeprop.name+": <input type='number' value='"+val+"'>"+typeprop.unit;
				},
				get:function(fieldDOMNode){
					return parseInt(fieldDOMNode.children[0].value);
				}
			},
			{//Font field
				add:function(typeprop, val){
					return typeprop.name+": <input type='text' value='"+val+"'> <a href='javascript://' onclick='noddes.types.getFonts(this);'>select</a>";
				},
				get:function(fieldDOMNode){
					return fieldDOMNode.children[0].value;
				}
			},
			{//Selects
				add:function(typeprop, val){
					vars="";
					for(var i=0;i<typeprop.vars.length;i++){
						if(val==typeprop.vars[i]){
							vars+="<option value='"+typeprop.vars[i]+"' selected='selected'>"+typeprop.vars[i]+"</option>"
						}else{
							vars+="<option value='"+typeprop.vars[i]+"'>"+typeprop.vars[i]+"</option>"
						}
					}
					return typeprop.name+": <select value='"+val+"'>"+vars+"</select>";
				},
				get:function(fieldDOMNode){
					return fieldDOMNode.children[0].value;
				}
			},
			{//Color
				add:function(typeprop, val){
					return typeprop.name+": <span onclick='noddes.colors.selectColor(this)' class='colorfield' style='background-color:#"+val+"'> ";
				},
				get:function(fieldDOMNode){
					return noddes.colors.rgbToHex(fieldDOMNode.children[0].style.backgroundColor);
				}
			},
			{//List
				add:function(typeprop, val){
					list="<div class='nodesList'>";
					for(var i = 0;i<val.length;i++){
						list+=noddes.windows.getElementHTML(val[i]);
					}
					list+="</div>";
					list+="<a class=\"btn\" onclick=\"noddes.windows.addChangeElementWindow(this);\" href=\"javascript://\">Add Node</a>";
					return typeprop.name+": "+list;
				},
				get:function(fieldDOMNode){
					res = [];
					for(var i = 0;i<document.getElementsByClassName("nodesList")[0].children.length;i++){
						res.push(parseInt(document.getElementsByClassName("nodesList")[0].children[i].getAttribute("data-id")));
					}
					return res;
				}
			},
			{//Textarea
				add:function(typeprop, val){
					//val = val.replace("\n","");
					return typeprop.name+": <br><textarea>"+val+"</textarea>";
				},
				get:function(fieldDOMNode){
					return fieldDOMNode.children[1].value;
				}
			},{//Image
				add:function(typeprop, val){
					image="";
					path='';
					format='';
					data='';
					if(val.data!=null){
						path=val.source;
						format=val.format;
						data=val.data;
						var img = new Image();
						img.src = data;

						image = "Image ("+img.width+"x"+img.height+"), "+val.format+"<br><i>"+val.source+"</i><br>";
					}
					return image+'NewImage: <input id="fileinput" onchange="noddes.events.imageUploaded(this)" accept="image/png, image/jpeg" type="file"><div id="newData" style="display:none"><img src="'+data+'"><input value="'+path+'"><input value="'+format+'"></div>';
/*
*/
				},
				get:function(fieldDOMNode){
					fileinput = fieldDOMNode.querySelector("input#fileinput");
					file = fieldDOMNode.querySelector("input#fileinput").files[0];
					if(file==undefined && fieldDOMNode.querySelector("#newData").children[1].value==""){
						return {source: null, data: null, format: null};
					}else{
						sourceData=null;
						formatData=null;
						dataData=null;
						if(file==undefined){
							dataData=fieldDOMNode.querySelector("#newData").children[0].src;
							sourceData=fieldDOMNode.querySelector("#newData").children[1].value;
							formatData=fieldDOMNode.querySelector("#newData").children[2].value;
							if(sourceData==""){sourceData=null;formatData=null;dataData=null}
						}else{
							sourceData=fileinput.value;
							formatData=file.type;
							dataData=fieldDOMNode.querySelector("#newData").children[0].src;
						}
						return {source: sourceData, data: dataData, format: formatData}
					}
				}
			},{//Checkbox
				add:function(typeprop, val){
					if(val){
						return typeprop.name+': <input type="checkbox" checked=true>';
					}else{
						return typeprop.name+': <input type="checkbox">';
					}
				},
				get:function(fieldDOMNode){
					res = fieldDOMNode.querySelector("input").checked;
					console.log(res);
					if(res){
						noddes.render.clearTarget();
						noddes.render.target = parseInt(noddes.selected[0].id);
						return true;
					}else{
						if(parseInt(noddes.selected[0].id) == noddes.render.target){
							noddes.render.clearTarget();
						}
						return false;
					}
				}			
			}
		],
		

		open:function(nid){
			var nodeIndex = noddes.nodes.getIndexById(nid);
			if(nodeIndex!=-1){
				document.getElementsByClassName("PropsContainer")[0].innerHTML="Selected Node "+nid+", type "+noddes.data[nodeIndex].type;
				document.getElementsByClassName("PropsContainer")[0].innerHTML+="<div class=\"tabs\"><a class=\"act\" onclick=\"noddes.props.showProps()\" href=\"javascript://\">Props</a><a onclick=\"noddes.props.showDatas()\" href=\"javascript://\">Datas</a></div><div style=\"display:block\" class=\"propsArea\"></div><div style=\"display:none\" class=\"datasArea\"></div>";
				var nodeTypeId = -1;
				
				for(var i = 0;i<noddes.props.types.length;i++){
					if(noddes.data[nodeIndex].type==noddes.props.types[i]){
						nodeTypeId=i;
					}
				}

				//Add node props
				document.getElementsByClassName("propsArea")[0].innerHTML+="<div class='field'>"+noddes.props.propselslist[3].add({
					name:"Type",
					vars:noddes.props.types
				},noddes.data[nodeIndex].type)+"</div>";

				document.getElementsByClassName("propsArea")[0].innerHTML+="<div class='field'>"+noddes.props.propselslist[4].add({
					name:"Color"
				},noddes.data[nodeIndex].color)+"</div>";

				document.getElementsByClassName("propsArea")[0].innerHTML+="<div class='field'>"+noddes.props.propselslist[0].add({
					name:"Name"
				},noddes.data[nodeIndex].name)+"</div>";
				document.getElementsByClassName("propsArea")[0].innerHTML+="<div class='field'>"+noddes.props.propselslist[1].add({
					name:"X",
					unit:"px"
				},noddes.data[nodeIndex].x)+"</div>";
				document.getElementsByClassName("propsArea")[0].innerHTML+="<div class='field'>"+noddes.props.propselslist[1].add({
					name:"Y",
					unit:"px"
				},noddes.data[nodeIndex].y)+"</div>";
				document.getElementsByClassName("propsArea")[0].innerHTML+="<div class='field'>"+noddes.props.propselslist[5].add({
					name:"Inputs"
				},noddes.data[nodeIndex].inputs)+"</div>";

				//Add data props
				for(var i = 0;i<noddes.props.typesprops[nodeTypeId].length;i++){
					el = noddes.props.typesprops[nodeTypeId][i];
					console.log(noddes.props.typesprops[nodeTypeId][i].propel)
					document.getElementsByClassName("datasArea")[0].innerHTML+="<div class='field'>"+noddes.props.propselslist[noddes.props.typesprops[nodeTypeId][i].propel].add(el, noddes.data[nodeIndex].data[el.type])+"</div>";
				}
				document.getElementsByClassName("PropsContainer")[0].innerHTML+='<a href="javascript://" onclick="noddes.props.saveProps('+nid+');" class="btn">Save</a>';
				document.getElementsByClassName("PropsContainer")[0].innerHTML+='<a href="javascript://" onclick="noddes.nodes.duplicateNode('+nid+');" class="btn">Duplicate</a>';
				document.getElementsByClassName("PropsContainer")[0].innerHTML+='<a href="javascript://" onclick="noddes.render.previewData(noddes.render.renderNode('+nid+'));" class="btn">Preview</a>';
				if(noddes.data[nodeIndex].type=="view"){
					document.getElementsByClassName("PropsContainer")[0].innerHTML+='<br><a href="javascript://" onclick="noddes.render.saveAsImage('+nid+');" class="btn">Save as Image</a>';
				}
			}
		},
		saveProps:function(nid){
			var nodeIndex = noddes.nodes.getIndexById(nid);
			var nodeTypeId = -1;
			for(var i = 0;i<noddes.props.types.length;i++){
				if(noddes.data[nodeIndex].type==noddes.props.types[i]){
					nodeTypeId=i;
				}
			}
			noddes.data[nodeIndex].cache=null;
			//Type
			noddes.data[nodeIndex]["type"] = noddes.props.propselslist[3].get(document.getElementsByClassName("propsArea")[0].getElementsByClassName("field")[0]);
			//Color
			noddes.data[nodeIndex]["color"] = noddes.props.propselslist[4].get(document.getElementsByClassName("propsArea")[0].getElementsByClassName("field")[1]);
			//Name
			noddes.data[nodeIndex]["name"] = noddes.props.propselslist[0].get(document.getElementsByClassName("propsArea")[0].getElementsByClassName("field")[2]);
			//X
			noddes.data[nodeIndex]["x"] = noddes.props.propselslist[1].get(document.getElementsByClassName("propsArea")[0].getElementsByClassName("field")[3]);
			//Y
			noddes.data[nodeIndex]["y"] = noddes.props.propselslist[1].get(document.getElementsByClassName("propsArea")[0].getElementsByClassName("field")[4]);
			//inputs
			noddes.data[nodeIndex]["inputs"] = noddes.props.propselslist[5].get(document.getElementsByClassName("propsArea")[0].getElementsByClassName("field")[5]);


			noddes.updateNode(nid, nodeIndex);

			for(var i = 0;i<noddes.props.typesprops[nodeTypeId].length;i++){
				noddes.data[nodeIndex].data[noddes.props.typesprops[nodeTypeId][i].type] = noddes.props.propselslist[noddes.props.typesprops[nodeTypeId][i].propel].get(document.getElementsByClassName("datasArea")[0].getElementsByClassName("field")[i]);
			}		
		},
		stats:function(){
			document.getElementsByClassName("PropsContainer")[0].innerHTML="Selected "+noddes.selected.length+" objects.";
		},
		clear:function(){
			document.getElementsByClassName("PropsContainer")[0].innerHTML="Nothing selected.";
			noddes.windows.clearModalWindows();
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
		duplicateNode:function(nid, index){
			if(index==undefined){
				index = noddes.nodes.getIndexById(nid);
			}
			node = Object.create(noddes.data[index]);
			node.data = Object.create(noddes.data[index].data);
			if(noddes.data[index].type=="image"){
				node.data.image = Object.create(noddes.data[index].data.image);
			}
			node.id = noddes.nodes.genNewId();
			node.x+=40;
			node.y+=40;
			noddes.data.push(node);
			noddes.renderDataByIndex(noddes.data.length-1);
			noddes.updateNode(node.id, noddes.data.length-1);
		},
		genNewId:function(){
			var id = noddes.data[noddes.data.length-1].id;
			while(noddes.nodes.getIndexById(id)!=-1){
				id++;	
			}
			return id;
		},
		getIndexById:function(nid){
			console.log("Find for "+nid);
			for(var i = 0;i<noddes.data.length;i++){
				if(noddes.data[i].id==nid){
					return i;
				}
			}
			return -1;
		},
		removeById:function(nid){
			res = -1;
			for(var i = 0;i<noddes.data.length;i++){
				if(noddes.data[i].id==nid){
					noddes.data.splice(i, 1);
				}else{
					for(var j = 0;j<noddes.data[i].inputs.length;j++){
						if(noddes.data[i].inputs[j]==nid){
							noddes.data[i].inputs.splice(j, 1);
						}
					}
				}
			}
			return res;
		}
	},
	render:{
		cvs:null,
		ctx:null,
		prc:null,
		target:-1,
		forceRedraw:true,
		init:function(){
			noddes.render.cvs = document.getElementById("PreviewContainer");
			noddes.render.ctx = noddes.render.cvs.getContext("2d");
		},
		clearTarget:function(){
			noddes.render.target = -1;
			for(var i=0;i<noddes.data.length;i++){
				if(noddes.data[i].type=="view"){
					if(noddes.data[i].data.isTarget==true){
						noddes.data[i].data.isTarget=false;
						break;
					}
				}
			}
			
		},
		getScale:function(){
			if(noddes.render.target!=-1){
				return (noddes.data[noddes.nodes.getIndexById(noddes.render.target)].data.scale/100);
			}else{
				return 1;
			}
		},
		saveAsImage:function(nid){
			img = noddes.render.imageDataToImage(noddes.render.renderNode(nid));
			//alert();
			//window.open(img.src, "_blank");
			noddes.render.saveBase64AsFile(img.src, "File.png");
		},
		previewData:function(data){
			console.log(data);
			if(data!=-1){
				noddes.render.cvs.width = data.width;
				noddes.render.cvs.height = data.height;
				noddes.render.ctx.clearRect(0, 0, noddes.render.cvs.width, noddes.render.cvs.height);
				noddes.render.ctx.putImageData(data, 0, 0);
			}
			//console.log(data);
		},
		saveBase64AsFile(base64, fileName) {
			var link = document.createElement("a");
			link.setAttribute("href", base64);
			link.setAttribute("download", fileName);
			document.body.appendChild(link);
			link.click();
			setTimeout(function() {
				document.body.removeChild(link);
				//window.URL.revokeObjectURL(url); 
			}, 0); 
		},
		imageDataToImage:function(imagedata){
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');
			canvas.width = imagedata.width;
			canvas.height = imagedata.height;
			ctx.putImageData(imagedata, 0, 0);

			var image = new Image();
			image.src = canvas.toDataURL();
			//image.onload=function(){
			//	resolve(image);
			//}

			return image;
			/*new Promise(function(){
			});*/
			//return image;
		},
		renderScale:function(node){
			if(node.inputs.length!=1){
				noddes.windows.errorMsg("Please, select one input node.");
				return -1;
			}

			var source = noddes.render.imageDataToImage(noddes.render.renderNode(node.inputs[0]));

			var canvas = document.createElement('canvas');
			noddes.render.prc = canvas.getContext("2d");

			canvas.width = node.data.width
			canvas.height = node.data.height
			ctx = noddes.render.prc;

			//window.open(source.src,"_blank");

			ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
			data = ctx.getImageData(0, 0, canvas.width, canvas.height);

			return data;
		},
		renderText:function(node){
			scale = noddes.render.getScale();

			var canvas = document.createElement('canvas');
			canvas.width = node.data.width*scale;
			canvas.height = node.data.height*scale;
			noddes.render.prc = canvas.getContext("2d");

			ctx = noddes.render.prc;
			ctx.fillStyle = "#"+node.data.color;
			ctx.font = parseInt(node.data.size)*scale+"px "+node.data.font;

			
			switch(node.data.valign){
				case "left":
					ctx.textAlign = "left";
					x = 0;
					break;
				case "center":
					ctx.textAlign = "center";
					x = (node.data.width/2)*scale;
					break;
				case "right":
					ctx.textAlign = "right";
					x = node.data.width*scale;
					break;
			}
			texts = node.data.text.split("\n");
			switch(node.data.halign){
				case "top":
					ctx.textBaseline = "top";
					y=0;
					for(var i = 0;i<texts.length;i++){
						ctx.fillText(texts[i], x, y+(i*node.data.size*scale)); 
					}
					break;
				case "center":
					ctx.textBaseline = "middle";
					y=(node.data.height/2)*scale;
					for(var i = 0;i<texts.length;i++){
						ctx.fillText(texts[i], x, (y-((((texts.length-1)/2-i))*node.data.size*scale))); 
					}
					break;
				case "bottom":
					ctx.textBaseline = "bottom";
					y=node.data.height*scale;
					for(var i = 0;i<texts.length;i++){
						ctx.fillText(texts[i], x, y-((texts.length-1-i)*node.data.size*scale)); 
					}
					break;
			}

			console.log(canvas.width);
			console.log(canvas.height);

			data = ctx.getImageData(0, 0, canvas.width, canvas.height);

			return data;
		},
		renderImage:function(node){
			if(node.data.image.data==null){
				noddes.windows.errorMsg("Изображение не выбрано");
				return -1;
			}
			scale = noddes.render.getScale();

			var img = new Image();
			img.src=node.data.image.data;

			var canvas = document.createElement('canvas');
			noddes.render.prc = canvas.getContext("2d");

			canvas.width = img.width*scale;
			canvas.height = img.height*scale;
			ctx = noddes.render.prc;

			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			data = ctx.getImageData(0, 0, canvas.width, canvas.height);

			return data;
		},
		renderMarge:function(node){
			if(node.inputs.length!=2){
				noddes.windows.errorMsg("Выходных нод у элемента наложение должно быть 2.");
				console.log("ERR: Выходных нод у элемента наложение должно быть 2.");
				return -1;
			}
			let imageA = noddes.render.renderNode(node.inputs[0]);
			let imageB = noddes.render.renderNode(node.inputs[1]);
			if(imageA==-1 || imageB==-1){
				console.log("ERR: Входные ноды не работают как надо.");
				return -1;
			}else{

				console.log("A:"+node.inputs[0]+", B:"+node.inputs[1]);

				console.log("Aw:"+imageA.width);
				console.log("Ah:"+imageA.height);
				console.log("Bw:"+imageB.width);
				console.log("Bh:"+imageB.height);


				let offsetX = node.data.offsetX;
				let offsetY = node.data.offsetY;


				width = 0;
				height = 0;
				switch(node.data.size){
					case "first":
						width = imageA.width+offsetX;
						height = imageA.height+offsetY;
					break;
					case "second":
						width = parseInt(imageB.width)+parseInt(offsetX);
						height = parseInt(imageB.height)+parseInt(offsetY);
					break;
					case "union"://FIX THIS TODOOOOOOOOO
						console.log((height = imageA.height+offsetY)+"ЖЖЖЖЖ");

						if(imageB.width+offsetX>=imageA.width+offsetX){
							width = imageB.width+offsetX;
						}else{
							width = imageA.width+offsetX;
						}
						if(imageB.height+offsetY>imageA.height+offsetY){
							height = imageB.height+offsetY;
						}else{
							height = imageA.height+offsetY;
						}
					break;
					case "difference":
						if((imageB.width-offsetX)<=(imageA.width-offsetX)){
							width = imageB.width-offsetX;
						}else{
							width = imageA.width-offsetX;
						}
						if((imageB.height-offsetY)<=(imageA.height-offsetY)){
							height = imageB.height-offsetY;
						}else{
							height = imageA.height-offsetY;
						}
					break;
				}
				if(width==0){
					noddes.windows.errorMsg("Ширина слишком маленькая.");
					return -1;
				}
				if(height==0){
					noddes.windows.errorMsg("Высота слишком маленькая.");
					return -1;
				}
				console.log("w:"+width+", h:"+height);
				var canvas = document.createElement('canvas');
				canvas.width = width;
				canvas.height = height;
				noddes.render.prc = canvas.getContext("2d");
				ctx = noddes.render.prc;

        			var cvs2=document.createElement("canvas");
        			cvs2.width=width;
        			cvs2.height=height;
        			var ctx2=cvs2.getContext("2d");


				ctx.putImageData(imageA, offsetX, offsetY);
				ctx2.putImageData(imageB,0,0);

				switch(node.data.top){
					case "first":
						ctx.drawImage(cvs2,0,0);
					break;
					case "second":
						ctx2.drawImage(canvas,0,0);
						ctx = ctx2;
					break;
				}

				//ctx.beginPath();
				//ctx.rect(0, 0, width, height);
				//ctx.fillStyle = "red";
				//ctx.fill();


			/*
					top:"first",//first second
					size:"second",//first, second, union, difference
					offsetX:0,
					offsetY:0
			*/
				data = ctx.getImageData(0, 0, canvas.width, canvas.height);
				return data;
			}
		},
		renderView:function(node){
			if(node.inputs.length!=1){
				noddes.windows.errorMsg("Входных нод у ноды предпросмотра должно быть 1.");
				return -1;
			}
			input = noddes.render.renderNode(node.inputs[0]);
			return input;
		},
		renderNode:function(nid){
			let index = noddes.nodes.getIndexById(nid);
			//console.log("recached ["+index+"] = "+nid);
			var res;
			if(noddes.data[index].cache==null || noddes.render.forceRedraw){
				//console.log(index);
				switch(noddes.data[index].type){
					case "text":
						res=noddes.render.renderText(noddes.data[index]);
						//console.log("Записали текст в "+nid);
					break;
					case "image":
						res=noddes.render.renderImage(noddes.data[index]);
						//console.log("Записали изображение в "+nid);
					break;
					case "marge":
						res=noddes.render.renderMarge(noddes.data[index]);
						//console.log("Записали рез объединения в "+nid);
					break;
					case "view":
						res=noddes.render.renderView(noddes.data[index]);
						//console.log("Записали предпросмотр в "+nid);
					break;
					case "scale":
						res=noddes.render.renderScale(noddes.data[index]);
						//console.log("Записали изменение размера в "+nid);
					break;
				}
				
				noddes.data[index].cache=res;
			}else{
				res = noddes.data[index].cache;
			}
			//noddes.render.previewData(res);
			return res;
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
			nodemove:false,
			moveStart:{
				x:null,
				y:null
			}
		},
		nodesViewport:{
			x:0,
			y:0,
			z:1//Zoom
		},
		newNode:{
			x:0,
			y:0
		}
	}
}

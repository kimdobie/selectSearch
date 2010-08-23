////////////////////////////////INFO////////////////////////////////////////
// This library was created by Kim Doberstein

// Version 1.2.2 - beta (aka inprogress)
// Date: 08/23/2010
//
//This jQuery plug-in allows a select list to be narrowed down by a text input box.

// NOTE: These functions require the jQuery library.  It was created using version 1.2.6
// You can downloaded jQuery at: http://jquery.com/
////////////////////////////////////////////////////////////////////////////






jQuery.fn.selectSearch = function(searchBoxObj,varObj) {
	//this is the select menu/list
	
	return this.each(function(){
	var jQueryselectList=jQuery(this);
	var jQuerysearchBox=jQuery(searchBoxObj);
	
	var selectLast=true;
	var startSearchFromFront=false;
	var sortOptions=true;
	var sortOptGroups=true;
	var showEmptyOptGroup=false;
	var fixedWidth=true;
	


	var selectList=jQuery(this);// Just an easy way to remember this object;
	
	
	// Check to see if any of the above vars have been set via the varObj
	if(varObj!=undefined){
	
		if(varObj.showEmptyOptGroup!=undefined&&(typeof varObj.showEmptyOptGroup=="boolean")) showEmptyOptGroup=varObj.showEmptyOptGroup;
		if(varObj.selectLast!=undefined&&(typeof varObj.selectLast=="boolean")) selectLast=varObj.selectLast;
		if(varObj.startSearchFromFront!=undefined&&(typeof varObj.startSearchFromFront=="boolean")) startSearchFromFront=varObj.startSearchFromFront;
		if(varObj.fixedWidth!=undefined&&(typeof varObj.fixedWidth=="boolean")) fixedWidth=varObj.fixedWidth;
		
		if(varObj.sortOptions!=undefined&&(typeof varObj.sortOptions=="boolean")) sortOptions=varObj.sortOptions;
		if(varObj.sortOptGroups!=undefined&&(typeof varObj.sortOptGroups=="boolean")) sortOptGroups=varObj.sortOptGroups;
		
	}
	
	
	//Set fixed width if neccessary
	if(fixedWidth)jQueryselectList.css('width',jQueryselectList.css('width'));


	//Set attribute to rememeber the search type
	$(this).attr('data-selectSearch-fromFront',startSearchFromFront);
	
	
	
	
	// Empty out any value in the search box
	jQuerysearchBox.val("");
	
	jQuerysearchBox.keyup(function(){
		var searchString=jQuery(this).val();
		
		var showOption=true;
		
		var selectedCounter=0;
	
		
		
		
			
		var tempArray=new Array();
		
		var optionList=selectSearch_Options.optionItems[jQueryselectList.attr('id')];
		
		
		// Need to escape input
		var inputText=cleanInput(jQuerysearchBox.val());
		
		
		for(var i=0;i<optionList.length;i++){
			
			tempArray[i]=new Array(optionList[i][0],new Array());	
			for(j=0;j<optionList[i][1].length;j++){
				//go through each item and see if it matches
				
			
			
				var showOption=false;	
				
				if(selectList.attr('data-selectSearch-fromFront')=='true')showOption=matchingFromStart(inputText,optionList[i][1][j].text);
				else showOption=matching(inputText,optionList[i][1][j].text);
				
			
				
				if(showOption)  tempArray[i][1].push(optionList[i][1][j]);
				
			
			}
		
		}
		
		
		
		
		// now to actually build the options.
		jQueryselectList.selectSearch_buildOptions(tempArray,showEmptyOptGroup);
		
			
		
		
		
		
		// there is only one option item left - select it
		
		if(selectLast&&jQueryselectList.find('option').length==1){
			jQueryselectList.find('option').attr('selected','selected');
		}
		
		
		
	});// end keyup
	
	jQueryselectList.change(function(){
		

		jQuery(this).find('option').each(function(){
		
			
			if(jQuery(this).attr('selected')){
			
				checkIfInSelectedArray(jQuery(this).attr('value'),true,jQueryselectList);
					
			}
			else{
				checkIfInSelectedArray(jQuery(this).attr('value'),false,jQueryselectList);
			}
			
			
			
			
			
		});
	
	
	});
	
	
	checkIfInSelectedArray=function(valueToBeRemoved,selected,jQueryselectList){
		
	
		
		var index=jQuery.inArray(valueToBeRemoved, selectSearch_Options.optionItems[jQueryselectList.attr('id')+"_selected"]);
		
		
		
		
		if(index==-1&&selected){
			// should be in array but is not
			
			selectSearch_Options.optionItems[jQueryselectList.attr('id')+"_selected"].push(valueToBeRemoved);
			//alert(jQueryselectList.attr('id')+"_selected"+" | "+selectSearch_Options.optionItems[jQueryselectList.attr('id')+"_selected"]);
			
		}
		else if(index!=-1&&!selected){
			// in array but shouldn't be
			
			selectSearch_Options.optionItems[jQueryselectList.attr('id')+"_selected"].splice(index,1);
			//alert(jQueryselectList.attr('id')+"_selected"+" | "+selectSearch_Options.optionItems[jQueryselectList.attr('id')+"_selected"]);
			
		}
		
		
	};
	
	
	
	
	cleanInput=function(input){
		// NOTE: backslashes "\" and carrots "^" still need to be escaped, but don't cause a falure for the user
		
		input=input.replace("(","\\\(");
		input=input.replace(")","\\\)");
		input=input.replace("*","\\\*");
		input=input.replace("+","\\\+");
		input=input.replace("[","\\\[");
		input=input.replace("]","\\\]");
		input=input.replace("?","\\\?");
		input=input.replace("|","\\\|");
		return input;
		
		
	};
	
	
	
	
	//first let's check to see if there is an id assigned to the select menu - if not assign one
	if(jQueryselectList.attr('id')==""){
		jQueryselectList.attr('id',"selectSearch_SelectList"+selectSearch_IDCounter);
		selectSearch_IDCounter++;
	}
	
	
	var listID=jQueryselectList.attr('id');
	var optionList=new Array();
	selectSearch_Options.optionItems[jQueryselectList.attr('id')+"_selected"]=new Array();
	
	
	var lastOptGroup=null;
	var optGroupNum=-1;
	

	jQueryselectList.children().each(function(){
		//FInd first child objects - optgroups or options not in an optgroup
		var currentOptGroupName="";
		var isThisAGroup=false;
		
		if(this.tagName.toLowerCase()=="optgroup"){
			currentOptGroupName=jQuery(this).attr("label");
			isThisAGroup=true;
		}
	
		if(lastOptGroup!=currentOptGroupName){
			optGroupNum++;
			lastOptGroup=currentOptGroupName;
			optionList[optGroupNum]=new Array(currentOptGroupName,new Array());
			
		}
		
		if(!isThisAGroup){
			//var isSelected=jQuery(this).attr('selected');
			
			optionList[optGroupNum][1].push({"text":jQuery(this).text(),"value":jQuery(this).attr("value")});
			if(jQuery(this).attr('selected')){
				selectSearch_Options.optionItems[jQueryselectList.attr('id')+"_selected"].push(jQuery(this).attr('value'));
			}
			
			
		
		}
		
		else{
			//this is an optgroup and need to go through and add each element in the optgroup
			jQuery(this).children().each(function(){
				optionList[optGroupNum][1].push({"text":jQuery(this).text(),"value":jQuery(this).attr("value")});
				if(jQuery(this).attr('selected')){
					selectSearch_Options.optionItems[jQueryselectList.attr('id')+"_selected"].push(jQuery(this).attr('value'));	
				}
					 
			});
			
		}
			
	});					   
						   
	
	
	
	
	
	
	selectSearch_Options.optionItems[jQueryselectList.attr('id')]=optionList;
		
		
		
	
	
	
	
	// sort if neccessary
	jQueryselectList.selectSearch_sortOptions(sortOptGroups,sortOptions,showEmptyOptGroup);
	
	
	
	matchingFromStart=function(startString,testString){	
		var pattern=new RegExp("^"+startString+".*","i");
		return pattern.test(testString);
	};

	matching=function(enterString,testString){
		var pattern=new RegExp(enterString,"ig");
		return pattern.test(testString);
	};
	
							  });
};// end selectSearch


////////////////////////////////////////////////////////////////

jQuery.fn.selectSearch_buildOptions=function(tempArray,showEmptyOptGroup){
	
	jQueryselectList=jQuery(this);
	jQueryselectList.html("");
	
	
	
	
	
	
	var hasSelected=false;
	
	if(selectSearch_Options.optionItems[jQueryselectList.attr('id')+"_selected"]!=undefined) hasSelected=true;
	
	
	
	for(var k=0;k<tempArray.length;k++){
		var htmlString="";
		
		//create an optgroup and related options
		if(tempArray[k][0]!=""&&(showEmptyOptGroup||tempArray[k][1].length>0)) htmlString+="<optgroup label='"+tempArray[k][0]+"'>";
		
		for(var m=0;m<tempArray[k][1].length;m++){
			htmlString+="<option value='"+tempArray[k][1][m].value+"'";
			
		
			
			
			 if(hasSelected&&jQuery.inArray(tempArray[k][1][m].value, selectSearch_Options.optionItems[jQueryselectList.attr('id')+"_selected"])!=-1){
				htmlString+= "selected='selected' ";
			} 
			
			
			htmlString+= ">"+tempArray[k][1][m].text+"</option>";
		}
		
		if(tempArray[k][0]!=""&&(showEmptyOptGroup||tempArray[k][1].length>0))htmlString+="</optgroup>";
		
		jQueryselectList.append(htmlString);
		
		
	}
	
	
	return this;// allow daisychaining
	
};








////////////////////////////////////////////////////////////////////

jQuery.fn.selectSearch_sortOptions=function(sortOptGroups,sortOptions,showEmptyOptGroup){

	selectItems=selectSearch_Options.optionItems[jQuery(this).attr('id')];
	
	
	
	//.toLowerCase()
	
	if(sortOptGroups){
		//Sort opt groups! - remeber that selectItem[x][0] is the name of the optgroup
		selectItems.sort(
			function(a,b){
				if(b[0].toLowerCase()<a[0].toLowerCase())return 1;
				if(b[0].toLowerCase()>a[0].toLowerCase())return -1;
				else return 0;	  
			}
		);
	}
	// Sort all the items in each optgroup
	if(sortOptions){
		for(var i=0;i<selectItems.length;i++){
			selectItems[i][1].sort(
				function(a,b){
					if( b.text.toLowerCase() < a.text.toLowerCase() ){ return 1; }
					if( b.text.toLowerCase() > a.text.toLowerCase() ){ return -1; }
					else return 0;
				}
			);
		}
	}
	jQuery(this).selectSearch_buildOptions(selectItems,showEmptyOptGroup);
	
	
	
	
	
	
	return this;
};



////////////////////////////////////////////////////////////////////
jQuery.fn.selectSearch_addOption=function(itemText,itemValue,optGroupLabel,varObj){
	
	var sortOptions=true;
	var sortOptGroups=true;
	var selectLast=true;
	var showEmptyOptGroup=true;
	var searchBox=null;
	

	if(varObj!=undefined){
	
		if(varObj.sortOptions!=undefined&&(typeof varObj.sortOptions=="boolean"))sortOptions=varObj.sortOptions;
		if(varObj.sortOptGroups!=undefined&&(typeof varObj.sortOptGroups=="boolean"))sortOptGroups=varObj.sortOptGroups;
		if(varObj.selectLast!=undefined&&(typeof varObj.selectLast=="boolean"))selectLast=varObj.selectLast;
		if(varObj.showEmptyOptGroup!=undefined&&(typeof varObj.showEmptyOptGroup=="boolean"))showEmptyOptGroup=varObj.showEmptyOptGroup;
		if(varObj.searchBox!=undefined&&(typeof varObj.searchBox=="object"))searchBox=varObj.searchBox;
	}
	
	// This allows you to dynamically add a new option to the 
		if(typeof optGroupLabel=="undefined")optGroupLabel="";
		
		var selectItems=selectSearch_Options.optionItems[jQuery(this).attr('id')];
		
		//First let's see if there is a match for optgroup
		var foundOpt=false;
		for(var i=0;i<selectItems.length&&!foundOpt;i++){
			if(optGroupLabel==selectItems[i][0]){
				// found the opt group - add here
				selectItems[i][1].push({"text":itemText,"value":itemValue});
				foundOpt=true;
			}
		}
		
		if(!foundOpt){
			//a opt group wasn't found - add a new one
			selectItems.push(new Array(optGroupLabel,new Array({"text":itemText,"value":itemValue})));
			
		}
		
		
		// sort
		jQuery(this).selectSearch_sortOptions(sortOptGroups,sortOptions,showEmptyOptGroup);
		// then simulate a key up on the corresponding textfield
		if(searchBox!=null)searchBox.trigger('keyup');
		return this;
		
		
};


///////////////////////////////////////////////////////////////////////
jQuery.fn.selectSearch_removeOption=function(itemText,itemValue,optGroupLabel){
	
	if(itemValue==undefined)itemValue="";
	var enteredOptGroup=true;
	if(optGroupLabel==undefined||optGroupLabel==""){
			optGroupLabel="";
			enteredOptGroup=false;
	
	}
	var selectItems=selectSearch_Options.optionItems[jQuery(this).attr('id')];
	
	var optGroupFound=false;
	//remove from array
	for(var i=0;i<selectItems.length&&!optGroupFound;i++){
			if(optGroupLabel==selectItems[i][0]||!enteredOptGroup){
				for(var j=0;j<selectItems[i][1].length&&!optGroupFound;j++){
					if(selectItems[i][1][j].text==itemText&&selectItems[i][1][j].value==itemValue){
						selectItems[i][1].splice(j,1);	
						optGroupFound=true;
					}
				}
				
			}
		}
	
	//remove from select item
	
	
	if(enteredOptGroup){
		
		var jQueryoptGroup=jQuery(this).find('optgroup[label="'+optGroupLabel+'"]').eq(0);
		 jQueryoptGroup.find('option[value="'+itemValue+'"]:contains("'+itemText+'")').eq(0).remove();
		 
		 //is this optgroup now empty
	
		 if(jQueryoptGroup.find('option').length==0) jQueryoptGroup.remove();
	}
	else jQuery(this).find('option[value="'+itemValue+'"]:contains("'+itemText+'")').eq(0).remove();
	
	
	
	
	
	
	
	
	return this;
	
	
};



///////////////////////////////////////////////////////////////////////
jQuery.fn.selectSearch_startSearchFromFront=function(startSearchFromFront_val){
	//data-selectSearch-fromFront
		
	if(startSearchFromFront_val==undefined||(typeof startSearchFromFront_val!="boolean")){
		alert('Please send a boolean to the 	selectSearch_startSearchFromFront method');
		return;
	}
	$(this).attr('data-selectSearch-fromFront',startSearchFromFront_val);
	
};



function selectSearch_OptionsObject(){
	//This is a helper object that will hold all the information for the selectSearch objects on the page
	//The use of a big helper object is to prevent name collisions
	
	//This object just holds a big array formatted this way:
	
	
	//optionItems['selectObj Id'].length=number of opt groups
	//optionItems['selectObj Id'][x][0]=optgroup label
	//optionItems['selectObj Id'][x][1].length=number of items in an optgroup
	//optionItems['selectObj Id'][x][1][y].text=text for a given item
	//optionItems['selectObj Id'][x][1][y].value=value for a given item
	
	
	//optionItems['selectObj id _selected'][x]=value for a selected item
	
	
	
	this.optionItems=new Array();
	
};

var selectSearch_Options=new selectSearch_OptionsObject();
var selectSearch_IDCounter=0;
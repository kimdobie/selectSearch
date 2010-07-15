////////////////////////////////INFO////////////////////////////////////////
// This library was created by Kim Doberstein

// Version 1.2.2 - beta
// Date: 07/15/2010
//
//This jQuery plug-in allows a select list to be narrowed down by a text input box.

// NOTE: These functions require the jQuery library.  It was created using version 1.2.6
// You can downloaded jQuery at: http://jquery.com/
////////////////////////////////////////////////////////////////////////////






///////////////////////////////// HOW TO USE THESE FUNCTIONS /////////////////////////
// In most cases, you call the selectSearch to a table object using jQuery "daisy-chaining"

// Example : $('#mySelectList').selectSearch(searchBoxObj);

// Where searchBoxObj, is a jQuery pointer to the search box the user types in their search string to narrow down the select menu



// If you need to tweek how the selectSearch method is applied, you can add any of the following options:
// {
//	 selectLast:true/false,  			 // If there is only one option left, should it be selected
//	startSearchFromFront:true/false,	 //Shoudld the search begin matching at the start of the option text
//	sortOptions:true/false, 			//Should the options be sorted
//	sortOptGroups:true/false, 			//Shoudl the optgroups be sorted
//	showEmptyOptGroup:true/false, 		//If there are any optgroups that do not have any options, should the optgroup label show
//	fixedWidth:true/false, 				//Should the select list have a fixed width
// }


// Example: $('#mySelectList').selectSearch(searchBoxObj,{selectLast:false,startSearchFromFront:false});


//////////////////////////////////////////////////////////////////////////////////






////////////////////////////////// GENERAL TIPS FOR SETTING UP YOUR SELECT LIST ///////////

//* All optgroups should have a non-empty label
//* All option items should have a value attribute set

//////////////////////////////////////////////////////////////////////////////////






//////////////////////////////// ADDING AN OPTION //////////////////////
//Because of how this library is constructed, you cannot directly add an option via the DOM.
//You must call the selectSearch_addOption method and apply it the select list
//
//Example: $('#mySelectList').selectSearch_addOption(itemText,itemValue,optGroupLabel)
//
//Where:
//	itemText - the display text of the option
//	itemValue - the value of the value attribute of the option
//	optGroupLabel - the label of the optgroup this item should be under.  If it shouldn't be in an optgroup, use ""
	
	

// If you need to tweek how the selectSearch_addOption method is applied, you can add any of the following options:
// {
//	 selectLast:true/false,   // If there is only one option left, should it be selected
//	sortOptions:true/false, //Should the options be sorted
//	sortOptGroups:true/false, //Shoudl the optgroups be sorted
//	showEmptyOptGroup:true/false, //If there are any optgroups that do not have any options, should the optgroup label show


// }


// Example:  jQuery('#mySelectList').selectSearch_addOption(itemText,itemValue,optGroupLabel,{selectLast:false,sortOptGroups:false});

//////////////////////////////////////////////////////////////////////////////////





//////////////////////////////// REMOVING AN OPTION //////////////////////
//Because of how this library is constructed, you cannot directly remove an option via the DOM.
//You must call the selectSearch_removeOption method and apply it the select list
//
//Example: jQuery('#mySelectList').selectSearch_removeOption(itemText,itemValue,optGroupLabel)
//
//Where:
//	itemText - the display text of the option
//	itemValue - the value of the value attribute of the option
//	optGroupLabel - the label of the optgroup this item should be under.  If it isn't in an optgroup, use ""
	
// NOTE currently you MUST provide all three arguments.  This method will only rmeove the first matched option

//////////////////////////////////////////////////////////////////////////////////





//////////////////////////////// HOW THIS LIBRARY WORKS //////////////////////
//When the selectSearch method is called, all the options in the select list are stored in a large array.
//When the user types a charachter into the search box, this library emptys all the options in the select list,
//goes through the array and adds matching array entries to a temporary array, and then the temporary array
//is used to re-construct the options in the select list.
//
//One's first response to just hide/show option items in the select list that match wat was entered into the searchbox.
//While this works well in Firefox, other browsers including IE and Safari do not allow you to hide an option tag.

//////////////////////////////////////////////////////////////////////////////////










jQuery.fn.selectSearch = function(searchBoxObj,varObj) {
	return this.each(function(){
	var jQueryselectList=jQuery(this);
	var jQuerysearchBox=jQuery(searchBoxObj);
	
	var selectLast=true;
	var startSearchFromFront=false;
	var sortOptions=true;
	var sortOptGroups=true;
	var showEmptyOptGroup=false;
	var fixedWidth=true;
	

	
	
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
				if(startSearchFromFront)showOption=matchingFromStart(inputText,optionList[i][1][j].text);
				else showOption=matching(inputText,optionList[i][1][j].text);
				
				if(showOption)  tempArray[i][1].push(optionList[i][1][j]);
				
			
			}
		
		}
		
		// now to actually build the options.
		jQueryselectList.selectSearch_buildOptions(tempArray,showEmptyOptGroup);
		
			
		
		
		
		
		// there is only one option item left - select it
		
		if(selectLast&&jQueryselectList.find('option').length==1){
			jQueryselectList.find('option:visible').each(function(){this.selected=true});
		}
		
		
		
	});// end keyup
	
	
	
	cleanInput=function(input){
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
		
		if(!isThisAGroup) optionList[optGroupNum][1].push({"text":jQuery(this).text(),"value":jQuery(this).attr("value")});
		
		else{
			//this is an optgroup and need to go through and add each element in the optgroup
			jQuery(this).children().each(function(){
				optionList[optGroupNum][1].push({"text":jQuery(this).text(),"value":jQuery(this).attr("value")});					 
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
	for(var k=0;k<tempArray.length;k++){
		var htmlString="";
		
		//create an optgroup and related options
		if(tempArray[k][0]!=""&&(showEmptyOptGroup||tempArray[k][1].length>0)) htmlString+="<optgroup label='"+tempArray[k][0]+"'>";
		
		for(var m=0;m<tempArray[k][1].length;m++){
			htmlString+="<option value='"+tempArray[k][1][m].value+"'>"+tempArray[k][1][m].text+"</option>";
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




function selectSearch_OptionsObject(){
	//This is a helper object that will hold all the information for the selectSearch objects on the page
	//The use of a big helper object is to prevent name collisions 
	//This is only used on IE
	
	//This object just holds a big array formatted this way:
	
	
	//optionItems['selectObj Id'].length=number of opt groups
	//optionItems['selectObj Id'][x][0]=optgroup label
	//optionItems['selectObj Id'][x][1].length=number of items in an optgroup
	//optionItems['selectObj Id'][x][1][y].text=text for a given item
	//optionItems['selectObj Id'][x][1][y].value=value for a given item
	
	this.optionItems=new Array();
	
};

var selectSearch_Options=new selectSearch_OptionsObject();
var selectSearch_IDCounter=0;
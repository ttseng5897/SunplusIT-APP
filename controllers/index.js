function updateListView() {
	var txtAccount = $.texfieldAcct.value;
	var url = "http://ithsweb09.sunplusit.com/webapp/json/GetWepAPPMainData.ashx";
	var client = Ti.Network.createHTTPClient({
	    //  called when the response data is available
	    onload : function(e) {
	    	Ti.API.log('ACT:'+txtAccount+' IP:'+Titanium.Platform.address+' / WEB Return: '+client.responseText);
	    	if(isJson(client.responseText)) {
	    		var results = JSON.parse(client.responseText);
		        // display results on console
		        Ti.API.info(JSON.stringify(results,null,2));
	    	}else{
	    		alert("無法連線到伺服器，請聯絡MIS人員！ 主機訊息："+client.responseText);
	    	}
	      
	    },
	    //  called when an error occurs, including a timeout
	    onerror : function(e) {
	        var results = JSON.parse(client.responseText);
	        // display error results on the console
	        Ti.API.err(JSON.stringify(results,null,2));
	        alert("無法連線到伺服器，請聯絡MIS人員！");
	    },
	});
	// Prepare the connection
	client.open("POST", url);
	// Send the request with parameters
	client.send({
	    ACT : txtAccount,
	    IP : Titanium.Platform.address
	});
	
	var sections = [];
	var basicDataSet = [];
	var basicSection = Ti.UI.createListSection({ headerTitle: '資產調撥單'});
	basicDataSet.push({properties: { title: 'Selection Style', itemId: 'list_selection_style', accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_DETAIL, height:44}});
}

function chkLogin() {	
	var txtAccount = $.texfieldAcct.value;
	var txtPWD = $.texfieldPwd.value;
	
	if(indicatorAdded == false)
	{
		if (ActivityIndicatorStyle) actInd.style = ActivityIndicatorStyle.BIG;
		$.viewLoginArea.add(actInd);
		actInd.show();
		indicatorAdded = true;
	}
	
	var url = "http://ithsweb09.sunplusit.com/webapp/json/ExecuteActiveDirectory.ashx";
	var client = Ti.Network.createHTTPClient({
	    //  called when the response data is available
	    onload : function(e) {
	    	Ti.API.log('WEB Return: '+client.responseText);
	        var results = JSON.parse(client.responseText);
	        // display results on console
	        // Ti.API.info(JSON.stringify(results,null,2));
	        if(indicatorAdded==true) {
	        	actInd.hide();
				$.viewLoginArea.remove(actInd);
				indicatorAdded = false;
	        }
	        
	        if(results.status == "ok") {
	        	$.viewLoginArea.visible = false;
	        	$.viewListWaittingForms.visible = true;
	        	updateListView();
	        }else{
	        	$.texfieldPwd.value = "";
	        	alert("登入錯誤！");
	        }
	        
	        
	      
	    },
	    //  called when an error occurs, including a timeout
	    onerror : function(e) {
	    	Ti.API.log('ACCT:'+txtAccount+'/PWD:'+txtPWD+' WEB Return: '+client.responseText);
	        var results = JSON.parse(client.responseText);
	        // display error results on the console
	        Ti.API.err(JSON.stringify(results,null,2));
	        alert("無法連線到伺服器，請聯絡MIS人員！");
	        
	        if(indicatorAdded==true) {
	        	actInd.hide();
				$.viewLoginArea.remove(actInd);
				indicatorAdded = false;
	        }
	    },
	});
	// Prepare the connection
	client.open("POST", url);
	// Send the request with parameters
	client.send({
	    ACT : txtAccount,
	    PWD : txtPWD,
	    IP : Titanium.Platform.address
	});
}

$.index.open();
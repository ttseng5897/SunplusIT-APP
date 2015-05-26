// ------> Start Functions

function chkLogin() {	
	var txtAccount = $.texfieldAcct.value;
	var txtPWD = $.texfieldPwd.value;
	
	if(indicatorAdded == false)
	{
		if (Ti.Platform.name === 'iPhone OS'){
		  actInd.style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;
		}
		else {
		  actInd.style = Ti.UI.ActivityIndicatorStyle.DARK;
		}
		actInd.top = 50;
		$.viewLoginArea.add(actInd);
		actInd.show();
		indicatorAdded = true;
	}
	
	var url = "http://ithsweb09.sunplusit.com/webapp/json/ExecuteActiveDirectory.ashx";
	var client = Ti.Network.createHTTPClient({
	    //  called when the response data is available
	    onload : function(e) {
	    	Ti.API.log('WEB Return: '+client.responseText);
	    	if(isJson(client.responseText)) {
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
		        	Titanium.App.Properties.setString('loginAccount',txtAccount);
		        	Titanium.App.Properties.setString('lastIP',Titanium.Platform.address);
		        	//updateListView();
		        	mainWindow.open();
		        }else{
		        	$.texfieldPwd.value = "";
		        	alert("登入錯誤！");
		        }
	        }else{
	        	alert("無法連線到伺服器，請聯絡MIS人員！ 主機訊息："+client.responseText);
	        }
	        
	      
	    },
	    //  called when an error occurs, including a timeout
	    onerror : function(e) {
	    	alert("無法連線到伺服器，請聯絡MIS人員！ 主機訊息："+client.responseText);
	        
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

// ------> End Functions

// ------> Start Page Actions
$.texfieldAcct.value = Titanium.App.Properties.getString('loginAccount');

$.index.open();
$.texfieldPwd.focus();

// ------> End Page Actions
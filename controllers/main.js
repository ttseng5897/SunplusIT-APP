function fetchDataToList(dataSet) {
	var sections = [];
	var listDataSet = [];
	
	var titleSection = Ti.UI.createListSection({ headerTitle: '資產調撥單', footerTitle: ' ' });
	
	for (var key in dataSet) {
		if (dataSet.hasOwnProperty(key)) {
		  listDataSet.push( {properties: { title: dataSet[key].form_subject, height: "auto", color: "gray", font: { fontSize: 13 } } } );
		}
	}
	/*
	var listDataSet = [
	    {properties: { title: "黎孟巡 建立的 財產調撥單 ，請您處理!!", height: "auto", color: "gray", font: { fontSize: 13 } } },
	    {properties: { title: "李建壹 建立的 財產調撥單 ，請您處理!!", height: "auto", color: "gray", font: { fontSize: 13 } } },
	];
	
	*/
	titleSection.setItems(listDataSet);
	sections.push(titleSection);
	$.listviewFormsWaitting.sections = sections;
	//$.listviewFormsWaitting.setSections(sections);
}

function updateListView() {
	var txtAccount = Titanium.App.Properties.getString('loginAccount');
	var url = "http://ithsweb09.sunplusit.com/webapp/json/GetWepAPPMainData.ashx";
	var client = Ti.Network.createHTTPClient({
	    //  called when the response data is available
	    onload : function(e) {
	    	Ti.API.log('ACT:'+txtAccount+' IP:'+Titanium.Platform.address+' / WEB Return: '+client.responseText);
	    	if(isJson(client.responseText)) {
	    		Ti.API.log('test:'+isJson(client.responseText));
	    		var results = JSON.parse(client.responseText);
		        Ti.API.info(JSON.stringify(results,null,2));
		        fetchDataToList(results);
	    	}else{
	    		alert("無法連線到伺服器，請聯絡MIS人員！ 主機訊息："+client.responseText);
	    	}
	      
	    },
	    //  called when an error occurs, including a timeout
	    onerror : function(e) {
	        alert("無法連線到伺服器，請聯絡MIS人員！ 主機訊息："+client.responseText);
	    },
	});
	// Prepare the connection
	client.open("POST", url);
	// Send the request with parameters
	client.send({
	    ACT : txtAccount,
	    IP : Titanium.App.Properties.getString('lastIP')
	});
	
	var sections = [];
	var basicDataSet = [];
	var basicSection = Ti.UI.createListSection({ headerTitle: '資產調撥單'});
	basicDataSet.push({properties: { title: 'Selection Style', itemId: 'list_selection_style', accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_DETAIL, height:44}});
}

$.winForms.addEventListener('open',function()
	{
		updateListView();
});

function fetchDataToList(dataSet) {
	var sections = [];
	var listDataSet = [];
	
	var titleSection = Ti.UI.createListSection({ headerTitle: '資產調撥單', footerTitle: ' ' });
	
	for (var key in dataSet) {
		if (dataSet.hasOwnProperty(key)) {
		  listDataSet.push( {properties: { title: dataSet[key].form_subject, height: "auto", color: "gray", 
		  	font: { fontSize: 13 }, form_content1: dataSet[key].form_content1,
		  	form_content2: dataSet[key].form_content2, applicant_account: dataSet[key].applicant_account, applicant_name: dataSet[key].applicant_name,
		  	applicant_dept: dataSet[key].applicant_dept, signflow_now: dataSet[key].signflow_now, signflow_msg: dataSet[key].signflow_msg,
		  	applicant_ext: dataSet[key].applicant_ext, sign_type: dataSet[key].sign_type, form_createdate: dataSet[key].form_createdate
		  	  } } );
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
	$.listviewFormsWaitting.addEventListener('itemclick', function(e){
		var item = titleSection.getItemAt(e.itemIndex);
		Ti.API.log(item.properties.title);
		var passData = [ { "title": item.properties.title, content: item.properties.form_content1 + item.properties.form_content2 , 
			flow: item.properties.signflow_msg, flow_now: item.properties.signflow_now, applicant_name: item.properties.applicant_name,
			applicant_dept: item.properties.applicant_dept, applicant_ext: item.properties.applicant_ext, applicant_date: item.properties.form_createdate
			 } ];
		Titanium.App.Properties.setList('formContentValue',passData);
		var viewForm = Alloy.createController('viewForm').getView();
		Ti.API.log('Add a Popin View!');
		UI.popIn(viewForm);
	});
}

function updateListView() {
	var txtAccount = Titanium.App.Properties.getString('loginAccount');
	var url = "http://ithsweb09.sunplusit.com/webapp/json/GetWepAPPMainData.ashx";
	var client = Ti.Network.createHTTPClient({
	    //  called when the response data is available
	    onload : function(e) {
	    	var txtResponse = client.responseText;
	    	var txtResponseReplaced = txtResponse.replace(/(\r\n|\n|\r)/gm,"<br>");
	    	Ti.API.log('ACT:'+txtAccount+' IP:'+Titanium.Platform.address+' / WEB Return: '+txtResponseReplaced);

	    	if(isJson(txtResponseReplaced)) {
	    		Ti.API.log('test:'+isJson(txtResponseReplaced));
	    		var results = JSON.parse(txtResponseReplaced);
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
	/*
	var sections = [];
	var basicDataSet = [];
	var basicSection = Ti.UI.createListSection({ headerTitle: '資產調撥單'});
	basicDataSet.push({properties: { title: 'Selection Style', itemId: 'list_selection_style', accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_DETAIL, height:44}});
	*/
}

Ti.API.log('UpdateListView !!!!');
updateListView();
		
/*
$.winForms.addEventListener('open',function()
	{
		Ti.API.log('UpdateListView !!!!');
		updateListView();
});
*/

//------------------------------------------------
var u = Ti.Android != undefined ? 'dp' : 0;

var UI = {
    visible: null,
    viewStack: [],
    zIndexLevels: {
        normal: 1,
        dialog: 2,
        alert: 3
    },
    add: function(view) { 
    	$.winForms.add(view); UI.viewStack.push(view); 
    	
    },
    remove: function(view) { 
    	$.winForms.remove(view); UI.viewStack.splice(UI.viewStack.indexOf(view), 1);     	
    },
    popIn: popInView,
    popOut: popOutView,
    fadeIn: fadeInView,
    fadeOut: fadeOutView
};

function popInView(view) {
    // add a close button to it
    var closeButton = Ti.UI.createButton({
        font: { fontSize: 20 + u, fontWeight: 'bold' },
        color: '#fff', backgroundColor: '#000', borderColor: '#555',
        title: 'X', style: 0,
        borderRadius: 6,
        top: -4 + u, right: -4 + u,
        width: 30 + u, height: 30 + u,
        zIndex: 5
    });
    closeButton.addEventListener('click', function () {
        UI.popOut(view);
    });
    view.add(closeButton);

    if (Ti.Android) {
        UI.add(view);
        view.fireEvent('open');
    }
    else {
        // position the view so that it is hidden
        view.opacity = 0;
        view.transform = Ti.UI.create2DMatrix().scale(0);
        UI.add(view);
        // animate it so it pops out of the screen
        var tooBig = Ti.UI.createAnimation({
            opacity: 1, transform: Ti.UI.create2DMatrix().scale(1.1),
            duration: 350
        });
        var shrinkBack = Ti.UI.createAnimation({
            transform: Ti.UI.create2DMatrix(),
            duration: 400
        });
        tooBig.addEventListener('complete', function () {
            view.animate(shrinkBack);
        });
        shrinkBack.addEventListener('complete', function () {
            view.fireEvent('open');
        });
        view.animate(tooBig);
    }
}

function popOutView(view) {
    if (Ti.Android) {
        view.fireEvent('close');
        UI.remove(view);
    }
    else {
        var hide = Ti.UI.createAnimation({
            opacity: 0, transform: Ti.UI.create2DMatrix().scale(0),
            duration: 400
        });
        hide.addEventListener('complete', function () {
            view.fireEvent('close');
            UI.remove(view);
        });
        view.animate(hide);
    }
}

function fadeInView(view) {
    UI.add(view);
    view.opacity = 0;
    var fade = Ti.UI.createAnimation({
        opacity: 1,
        duration: 500
    });
    fade.addEventListener('complete', function () {
        view.fireEvent('open');
    });
    view.animate(fade);
}

function fadeOutView(view) {
    var fade = Ti.UI.createAnimation({
        opacity: 0,
        duration: 500
    });
    fade.addEventListener('complete', function () {
        view.fireEvent('close');
        UI.remove(view);
    });
    view.animate(fade);
}


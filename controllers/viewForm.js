// ------> Start Functions

function updateSignStatus(signStatus) {
	Ti.API.log('Send Data: ' + formData[0].seqno + '/' + signStatus + '/' + Titanium.App.Properties.getString('loginAccount'));
	
	
	
	var txtAccount = Titanium.App.Properties.getString('loginAccount');
	var url = "http://ithsweb09.sunplusit.com/webapp/json/ExecuteAuthorize.ashx";
	var client = Ti.Network.createHTTPClient({
	    //  called when the response data is available
	    onload : function(e) {
	    	var txtResponse = client.responseText;
			Ti.API.log('test:'+isJson(txtResponse));
			
	    	if(isJson(txtResponse)) {
	    		var results = JSON.parse(txtResponse);
		        Ti.API.info(JSON.stringify(results,null,2));
		        if(results.status == 'ok') {
		        	alert('簽核完成。');
		        }else if(results.status == 'fail') {
		        	alert('伺服端作業失敗，無法為您簽核，請洽MIS。');
		        }else if(results.status == 'IP error') {
		        	alert('無法為您簽核，您是駭客嗎？');
		        }else{
		        	alert('簽核失敗，無法為您簽核，請洽MIS。');
		        }
		        
		        Ti.App.fireEvent('updateFormList');
				Ti.App.fireEvent('removeForm');
	    	}else{
	    		alert("無法連線到伺服器，請聯絡MIS人員！ 主機訊息："+txtResponse);
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
	    seqno : formData[0].seqno,
	    status: signStatus,
	    act: Titanium.App.Properties.getString('loginAccount'),
	    ip : Titanium.App.Properties.getString('lastIP')
	});
	
}
// ------> End Functions

// ------> Start Adjust Layout
var formData = Titanium.App.Properties.getList('formContentValue');

$.btnAccept.width = Math.floor((DEVICE_WIDTH - 22) / 2) - 1;
$.btnReject.width = Math.floor((DEVICE_WIDTH - 22) / 2) - 1;

$.scrollviewContent.height = DEVICE_HEIGHT - ($.viewSignType_3.height + $.viewSignType_3.bottom) - ($.lblSubject.height + $.lblSubject.top) - 10;

$.lblSubject.text = formData[0].title;
$.lblContent.text = formData[0].content;
// ------> End Adjust Layout

// ------> Start Actions
$.btnFlow.addEventListener('click',function() {
	var txtDisplay = formData[0].flow;
	var dialog = Ti.UI.createAlertDialog({
	    message: '目前流程：' + formData[0].flow_now + '\n\n' + txtDisplay.replace(/<br>/gm,"\n"),
	    ok: 'OK',
	    title: '簽核流程資訊'
	});
	dialog.show();
});

$.btnApplicant.addEventListener('click',function() {
	var messageDisplay = '申請日期：' + formData[0].applicant_date + '\n申請者：' + formData[0].applicant_name + '\n分機：' + formData[0].applicant_ext + 
	'\n部門：' +  formData[0].applicant_dept;
		
	var dialog = Ti.UI.createAlertDialog({
	    message: messageDisplay,
	    ok: 'OK',
	    title: '申請者資訊'
	});
	dialog.show();
});

$.btnAccept.addEventListener('click',function() {
	var optionsDialogOpts = {
		options:['確定', '取消'],
		destructive:1,
		cancel:1,
		title:'您確定要核準本申請單嗎？'
	};
	
	if (isAndroid) {
		optionsDialogOpts.selectedIndex = 1;
	}
	
	var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);
	
	// add event listener
	dialog.addEventListener('click',function(e)
	{
		if(e.index == 0) {
			updateSignStatus(1);
		}
		
	});
	
	dialog.show();
});

$.btnReject.addEventListener('click',function() {
	var optionsDialogOpts = {
		options:['確定', '取消'],
		destructive:0,
		cancel:1,
		title:'您確定要退回本申請單嗎？'
	};
	
	if (isAndroid) {
		optionsDialogOpts.selectedIndex = 1;
	}
	
	var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);
	
	// add event listener
	dialog.addEventListener('click',function(e)
	{
		if(e.index == 0) {
			updateSignStatus(2);
		}
		
	});
	
	dialog.show();
});
// ------> End Actions

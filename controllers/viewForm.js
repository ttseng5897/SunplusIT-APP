var formData = Titanium.App.Properties.getList('formContentValue');

$.btnAccept.width = Math.floor((DEVICE_WIDTH - 22) / 2) - 1;
$.btnReject.width = Math.floor((DEVICE_WIDTH - 22) / 2) - 1;

$.scrollviewContent.height = DEVICE_HEIGHT - ($.viewSignType_3.height + $.viewSignType_3.bottom) - ($.lblSubject.height + $.lblSubject.top) - 10;

$.lblSubject.text = formData[0].title;
$.lblContent.text = formData[0].content;

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
			
		}
		
	});
	
	dialog.show();
});


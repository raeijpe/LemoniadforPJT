sap.ui.define([
		"sap/ui/model/json/JSONModel",
		"sap/ui/Device"
	], function (JSONModel, Device) {
		"use strict";

		return {

			createDeviceModel : function () {
				var oModel = new JSONModel(Device);
				oModel.setDefaultBindingMode("OneWay");
				return oModel;
			},
			
			createApplicationModel : function () {
				var oModel = new JSONModel(
				{
					activeMentorIcon: "sap-icon://physical-activity",
					alumniMentorIcon: "sap-icon://leads"
				});
				oModel.setDefaultBindingMode("OneWay");
				return oModel;
			}


		};

	}
);
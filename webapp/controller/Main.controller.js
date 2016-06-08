sap.ui.define([
		"com/sap/mentors/lemonaid/projectteam/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"com/sap/mentors/lemonaid/projectteam/model/formatter",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/core/routing/History"
	], function (BaseController, JSONModel, formatter, Filter, FilterOperator, History) {
		"use strict";

		return BaseController.extend("com.sap.mentors.lemonaid.projectteam.controller.Main", {

			formatter: formatter,

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			/**
			 * Called when the Main controller is instantiated.
			 * @public
			 */
			onInit : function () {
				var oViewModel;
				oViewModel = new JSONModel({
					MainTableTitle : this.getResourceBundle().getText("MainTableTitle"),
					saveAsTileTitle: this.getResourceBundle().getText("MainViewTitle"),
					shareOnJamTitle: this.getResourceBundle().getText("MainViewTitle"),
					shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailMainSubject"),
					shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailMainMessage", [location.href]),
					tableNoDataText : this.getResourceBundle().getText("tableNoDataText"),
					tableBusyDelay : 0
				});
				this.setModel(oViewModel, "mainView");
			},

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */

			/**
			 * Event handler for navigating back.
			 * We navigate back in the browser historz
			 * @public
			 */
			onNavBack : function() {
				history.go(-1);
			}
		});
	}
);
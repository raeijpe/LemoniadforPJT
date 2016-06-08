sap.ui.define([
	"com/sap/mentors/lemonaid/projectteam/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"com/sap/mentors/lemonaid/projectteam/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/routing/History"
], function(BaseController, JSONModel, formatter, Filter, FilterOperator, History) {
	"use strict";

	return BaseController.extend("com.sap.mentors.lemonaid.projectteam.controller.Mentorlist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the Mentorlist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			var oViewModel,
				iOriginalBusyDelay,
				oAllMentorlistTable = this.byId("allMentorlistTable"),
				oActiveMentorlistTable = this.byId("activeMentorlistTable"),
				oAlumniMentorlistTable = this.byId("alumniMentorlistTable");

			iOriginalBusyDelay = oAllMentorlistTable.getBusyIndicatorDelay();
			this._allMentorlistTable = oAllMentorlistTable;
			this._activeMentorlistTable = oActiveMentorlistTable;
			this._alumniMentorlistTable = oAlumniMentorlistTable;
			this._allMentorlistTableSearchState = [];
			this._activeMentorlistTableSearchState = [];
			this._alumniMentorlistTableSearchState = [];

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				MentorlistTableTitle: this.getResourceBundle().getText("MentorlistTableTitle"),
				saveAsTileTitle: this.getResourceBundle().getText("MentorlistViewTitle"),
				shareOnJamTitle: this.getResourceBundle().getText("MentorlistViewTitle"),
				shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailMentorlistSubject"),
				shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailMentorlistMessage", [location.href]),
				tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
				tableBusyDelay: 0
			});
			this.setModel(oViewModel, "mentorlistView");

			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			oAllMentorlistTable.attachEventOnce("updateFinished", function() {
				// Restore original busy indicator delay for Mentorlist's table
				oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
			});
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinishedMentorlistTable: function(oEvent) {
			// update the Mentorlist's object counter after the table update
			var oTable = oEvent.getSource();
			var iTotalItems = oEvent.getParameter("total");
			var aSplitId = oTable.getId().split("--");
			var iIndex = aSplitId.length - 1;
			var sPropertyName = "/".concat(aSplitId[iIndex]).concat("Count");
			this.getModel("mentorlistView").setProperty(sPropertyName, iTotalItems);
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPress: function(oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},

		/**
		 * Event handler for navigating back.
		 * We navigate back in the browser historz
		 * @public
		 */
		onNavBack: function() {
			history.go(-1);
		},

		onSearchMentorListTable: function(oEvent) {
			var oTable = oEvent.getSource().getParent().getParent();
			var aSplitId = oTable.getId().split("--");
			var iIndex = aSplitId.length - 1;
			var sTableName = aSplitId[iIndex];

			if (oEvent.getParameters().refreshButtonPressed) {
				this.onRefresh(sTableName);
			} else {
				var oTableSearchState = [];
				var sQuery = oEvent.getParameter("query");

				if (sQuery && sQuery.length > 0) {
					oTableSearchState = [new Filter([
						new Filter("FullName", FilterOperator.Contains, sQuery)
					], false)];
				}
				this._applySearch(sTableName, oTableSearchState);
			}

		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function(sTableName) {
			var tableName = "_".concat(sTableName);
			this[tableName].getBinding("items").refresh();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showObject: function(oItem) {
			// this.getRouter().navTo("object", {
			// 	objectId: oItem.getBindingContext().getProperty("Id")
			// });
	
			// 	var oItem = event.getSource();
			var oContext = oItem.getBindingContext();
			var obj = oContext.getObject();
			var sid = obj.Id;
			// Routing pattern is set up in manifest.json and expects a Shirt Number for now.
			this.getRouter().navTo("mentorDetails",{"sid" : sid});
	
	
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {object} oTableSearchState an array of filters for the search
		 * @private
		 */
		_applySearch: function(sTableName, oTableSearchState) {
			var oViewModel = this.getModel("mentorlistView");
			var tableName = "_".concat(sTableName);
			this[tableName].getBinding("items").filter(oTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (oTableSearchState.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("MentorlistNoDataWithSearchText"));
			}
		}

	});
});
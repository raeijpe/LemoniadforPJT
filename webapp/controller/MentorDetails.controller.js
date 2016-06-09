sap.ui.define([
	"com/sap/mentors/lemonaid/projectteam/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"com/sap/mentors/lemonaid/projectteam/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/routing/History"
], function(BaseController, JSONModel, formatter, Filter, FilterOperator, History) {
	"use strict";

	return BaseController.extend("com.sap.mentors.lemonaid.projectteam.controller.MentorDetails", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the MentorDetails controller is instantiated.
		 * @public
		 */
		onInit: function() {
			var oViewModel;
			oViewModel = new JSONModel({
				MentorDetailsTableTitle: this.getResourceBundle().getText("MentorDetailsTableTitle"),
				saveAsTileTitle: this.getResourceBundle().getText("MentorDetailsViewTitle"),
				shareOnJamTitle: this.getResourceBundle().getText("MentorDetailsViewTitle"),
				shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailMentorDetailsSubject"),
				shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailMentorDetailsMessage", [location.href]),
				tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
				tableBusyDelay: 0
			});
			this.setModel(oViewModel, "mentorDetailsView");
			this.getRouter().getRoute("mentorDetails").attachMatched(this._onRouteMatched, this);

		},

		_onRouteMatched: function(oEvent) {
			this.sMentorId = oEvent.getParameter("arguments").sid;
			this.getModel().metadataLoaded().then(this.bindView.bind(this));
		},

		bindView: function() {
			this.getView().bindElement({
				path: this.getModel().createKey("/Mentors", {
					Id: this.sMentorId
				}),
				parameters: {
					expand: 'MentorStatus,RelationshipToSap,Country,Topic1,Topic2,Topic3'
				},
				events: {
					change: this._onBindingChange.bind(this)
				}
			});
		},

		_onBindingChange: function() {
			// set avatar
			var oContext = this.getView().getBindingContext();
			this.getEventBus().publish("mentorDetails", "viewBindingChanged", {
				context: oContext
			});
			var sEmail = oContext.getProperty("Email1");
			var avatar = this.getAvatarURL(sEmail);
			this.oView.byId("mentorDetailsObjectPageHeader").setObjectImageURI(avatar);
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler for navigating back.
		 * We navigate back in the browser historz
		 * @public
		 */
		onNavBack: function() {
			history.go(-1);
		}
	});
});
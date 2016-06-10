sap.ui.define(["com/sap/mentors/lemonaid/projectteam/controller/BaseController", "sap/ui/model/json/JSONModel",
	"com/sap/mentors/lemonaid/projectteam/model/formatter", "sap/ui/model/Filter", "sap/ui/model/FilterOperator",
	"sap/ui/core/routing/History", "openui5/googlemaps/MapUtils"
], function(BaseController, JSONModel, formatter, Filter, FilterOperator, History, mapUtils) {
	"use strict";

	return BaseController.extend("com.sap.mentors.lemonaid.projectteam.controller.MentorDetailsLocation", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods */ /* =========================================================== */

		/** * Called when the Main controller is instantiated. * @public */
		onInit: function() {
			var oViewModel;
			oViewModel = new JSONModel({
				MainTableTitle: this.getResourceBundle().getText("MainTableTitle"),
				saveAsTileTitle: this.getResourceBundle().getText("MainViewTitle"),
				shareOnJamTitle: this.getResourceBundle().getText("MainViewTitle"),
				shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailMainSubject"),
				shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailMainMessage", [location.href]),
				tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
				tableBusyDelay: 0
			});
			this.setModel(oViewModel, "mentorDetailsLocationView");
 
			this.getEventBus().subscribe("mentorDetails", "viewBindingChanged", this.mentorDetailsBindingChanged, this);
			},


			mentorDetailsBindingChanged: function(channelId, eventId, data){
				if (data && data.context){
				this.setMentorLocation(data.context);
				}
			},

/// Deze nog implementeren op basis van event

//            this.setMentorLocation();
// 		this.getEventBus().subscribe("App", "RefreshCourseDetail", this._refresh, this);
// 		this.getEventBus().unsubscribe("App", "RefreshCourseDetail", this._refresh, this);
//
//        var oContext = evt.getParameter("arguments");
//		this.getEventBus().publish("App", "RefreshStartPage", {
//			context : oContext
//		});
		
        
		/* =========================================================== */
		/* event handlers */ /* =========================================================== */

		/** * Event handler for navigating back. * We navigate back in the browser historz * @public */
		onNavBack: function() {
			history.go(-1);
		},
		
		 setMentorLocation: function(oBindingContext) {
//		 	if (oBindingContext){
            var oMap = this.getView().byId("mentorDetailsLocationMap");
            var oObject = oBindingContext.getObject();
            var oMentorsModel = this.getModel("mentors");
            var aEntries = oMentorsModel.getData();

            // check for an existing entry
            var fnFilter = function(oEntry) {
                return (oEntry.Id === oObject.Id);
            };

            var oEntry = aEntries.filter(fnFilter)[0] || null;
			var refreshMap = function refreshMap(){
				this.getView().invalidate();
				var oMapU = this.getView().byId("mentorDetailsLocationMap");
				
				var oContextM = oMentorsModel.getContext("/" + this._mapMentorId);
                oMapU.setBindingContext(oContextM, "mentors"); 
                delete this._mapMentorId;
			};

            if (!oEntry) {
            	this._mapMentorId = aEntries && aEntries.length || 0;
//                this.searchForLocation(oObject, this.addMentorLocation.bind(this), this.setMentorLocation.bind(this));
                this.searchForLocation(oObject, this.addMentorLocation.bind(this), refreshMap.bind(this));

            } else {
                var oContext = oMentorsModel.getContext("/" + aEntries.indexOf(oEntry));
                oMap.setBindingContext(oContext, "mentors");      
     
            }
		 	
//		 }
        },

        /**
         * search for the location, if found add to the model and set the map
         * @param  {object} oObject     context data for entry
         * @param  {function} fnCallBack1 add the location to the model
         * @param  {function} fnCallBack2 set the location
         */
        searchForLocation: function(oObject, fnCallBack1, fnCallBack2) {
            var sAddress = oObject.City + " " + oObject.State;

            mapUtils.search({
                "address": sAddress
            }).then(fnCallBack1).then(fnCallBack2);
        },

        /**
         * read the first returned entry from the geocode call and set it to model
         * @param {array} aResults array of found locations
         * @param {string} sStatus  status of the call
         */
        addMentorLocation: function(aResults, sStatus) {
            if (sStatus === "OK") {
                var oMentorsModel = this.getModel("mentors");
                var aEntries = oMentorsModel.getData();
                var oObject = this.getView().getBindingContext().getObject();
                var oLocation = aResults[0];
                var oEntry = {
                    Id: oObject.Id,
                    lat: oLocation.geometry.location.lat(),
                    lng: oLocation.geometry.location.lng(),
                    info: oLocation.formatted_address
                };

                aEntries.push(oEntry);
                oMentorsModel.setData(aEntries);
            }
        }
		
		
	});
});
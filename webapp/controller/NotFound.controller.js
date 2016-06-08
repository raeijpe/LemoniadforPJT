sap.ui.define([
		"com/sap/mentors/lemonaid/projectteam/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("com.sap.mentors.lemonaid.projectteam.controller.NotFound", {

			/**
			 * Navigates to the mentorlist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("mentorlist");
			}

		});

	}
);
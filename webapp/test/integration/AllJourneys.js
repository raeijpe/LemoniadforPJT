jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
		"sap/ui/test/Opa5",
		"com/sap/mentors/lemonaid/projectteam/test/integration/pages/Common",
		"sap/ui/test/opaQunit",
		"com/sap/mentors/lemonaid/projectteam/test/integration/pages/Worklist",
		"com/sap/mentors/lemonaid/projectteam/test/integration/pages/Object",
		"com/sap/mentors/lemonaid/projectteam/test/integration/pages/NotFound",
		"com/sap/mentors/lemonaid/projectteam/test/integration/pages/Browser",
		"com/sap/mentors/lemonaid/projectteam/test/integration/pages/App"
	], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "com.sap.mentors.lemonaid.projectteam.view."
	});

	sap.ui.require([
		"com/sap/mentors/lemonaid/projectteam/test/integration/WorklistJourney",
		"com/sap/mentors/lemonaid/projectteam/test/integration/ObjectJourney",
		"com/sap/mentors/lemonaid/projectteam/test/integration/NavigationJourney",
		"com/sap/mentors/lemonaid/projectteam/test/integration/NotFoundJourney"
	], function () {
		QUnit.start();
	});
});


var $root = $('html, body');
var gSelectedMaandIndex = 0;
var gKalenderInstellingen = gKalenderDefaultsJSON;

$(document).ready(function(){
	var instellingen = getUrlParameter('instellingen');
	if (typeof instellingen !== "undefined") {
		alert(decodeURIComponent(instellingen));
		gKalenderInstellingen = JSON.parse(decodeURIComponent(instellingen));
		alert(JSON.stringify(gKalenderInstellingen, null, 2));
	} else {
		alert('geen instellingen meegegeven');
	}
	
	activateSelectStartmaand();
	var tmpMaandIndex = getUrlParameter('maandIndex');
	if (typeof tmpMaandIndex === "undefined") {
		tmpMaandIndex = getUrlParameter('maandindex');
	}
	if (typeof tmpMaandIndex !== "undefined") {
		gSelectedMaandIndex = tmpMaandIndex*1;
		$("#startmaandSelect").val(tmpMaandIndex);
	}
	fillInvoerMaandData(gSelectedMaandIndex);

	activateShowHidePrintInstellingen();
	activateAnimatedLinkToResultaat();
	activateSerializeJSONToString();

});



// Show of Hide de Instellingen-div door te klikken op de resultaatDiv.
// Eerst kijken of de Instellingen-div zichtbaar is. Zoja: verbergen. Zonee: laten zien.
var activateShowHidePrintInstellingen = function() {
    $("#resultaatDiv").click(function(){
		
		if ($("#instellingenDiv").is(":visible")) {
			$("#instellingenDiv").hide();
			$("#resultaatTitel").hide();
			
			$("#resultaatDiv").attr('class', 'divResultaatZonderInstellingen');
			
		} else {
			$("#instellingenDiv").show();
			$("#resultaatTitel").show();

			$("#resultaatDiv").attr('class', 'divalgemeen divResultaatSamenMetInstellingen');

			// scroll 'slow' naar het anchor 'anchorBijInstellingen'
			// Een anchor is een plek in je pagina waarnaar je toe kan linken. Probeer maar eens file:///K:/Projecten/kalender-50-dingen/kalender.html#anchorBijInstellingen
			$root.animate({ scrollTop: $("#anchorBijInstellingen").offset().top }, 'slow');
		}
    });
};

// activeer de selectbox om een startmaand te kunnen selecteren.
var activateSelectStartmaand = function() {
	var selectedIndex = -1;
	$( "#startmaandSelect" )
		  .change(function() {
			var str = "";
			$( "select option:selected" ).each(function() {
			  str += $( this ).text() + " ";
			  selectedIndex = $( this ).val();
			});
			$( "#debugDiv" ).text( str );
			gSelectedMaandIndex = selectedIndex*1;
			fillInvoerMaandData(selectedIndex*1);
		  })
		  .trigger( "change" );

};

// vul de invoerteksten voor de maanden in, te beginnen bij de geselecteerde maand
var fillInvoerMaandData = function(selectedMaandIndex) {
	for (var i=1; i<=12; i++) {
		var ix = (i+selectedMaandIndex)<=12 ? i+selectedMaandIndex-1 : (i+selectedMaandIndex-1)%12;
		$("#invoerMaandTitel"+i).val(gKalenderInstellingen.maanden[ix].titel);
		$("#invoerMaandTekst"+i).val(gKalenderInstellingen.maanden[ix].tekst);
	}
};

// vul de resultaatteksten voor de maanden in, te beginnen bij de geselecteerde maand
var fillResultaatMaandData = function() {
	for (var i=1; i<=12; i++) {
		$("#resultaatMaandTitel"+i).text($("#invoerMaandTitel"+i).val());
		$("#resultaatMaandTekst"+i).text($("#invoerMaandTekst"+i).val());
	}
};


// scroll 'slow' naar het anchor 'anchorBijResultaat'
// Een anchor is een plek in je pagina waarnaar je toe kan linken. Probeer maar eens file:///K:/Projecten/kalender-50-dingen/kalender.html#anchorBijResultaat
var activateAnimatedLinkToResultaat = function () {
	$('#linkNaarResultaat').click(function(){
		fillResultaatMaandData();
		$root.animate({
			scrollTop: $( $(this).attr('href') ).offset().top
		}, 'slow');
	});
};


// dit is nodig om de instellingen op te kunnen slaan
var maakJSONVanInvoer = function() {
	var url = (document.location.pathname).replace("#anchorBijResultaat", "");
	var json = '{"maanden": [';
	var elBegin = '{';
	var elEind = '}';
	var elQuote = '"';
	var elLijm = ',';
	for (var i=1; i<=12; i++) {
		var ix = (12+i-gSelectedMaandIndex)%12 == 0 ? 12 : (12+i-gSelectedMaandIndex)%12;

		var titel = $("#invoerMaandTitel"+ix).val().replace("\n", "\\n").replace('"', '\"').replace("'", "\'");
		var tekst = $("#invoerMaandTekst"+ix).val().replace("\n", "\\n").replace('"', '\"').replace("'", "\'");
		json += elBegin + elQuote + 'titel' + elQuote + ':' + elQuote + titel + elQuote;
		json += elLijm;
		json += elQuote + 'tekst' + elQuote + ':' + elQuote + $("#invoerMaandTekst"+ix).val() + elQuote + elEind;
		if (i!=12) {
			json += ',';
		}
	}
	json += ']}';
	return url + '?maandIndex=' + gSelectedMaandIndex + '&instellingen=' + encodeURIComponent(json);
}


// maak een url die je kan opslaan
var serializeJSONToString = function() {
	var json_text = JSON.stringify(gKalenderInstellingen, null, 2);
	json_text = maakJSONVanInvoer();
	return json_text;
};

var activateSerializeJSONToString = function() {
		$("#serializeJSON").click(function(){
			var urlVoorOpslag = serializeJSONToString();
			$('#linkVoorOpslag').attr('href',urlVoorOpslag);
			$("#linkVoorOpslag").attr('class', 'linkVoorOpslagZichtbaar');

//			alert(serializeJSONToString());
    });

};


// Zie: http://stackoverflow.com/questions/19491336/get-url-parameter-jquery-or-how-to-get-query-string-values-in-js
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};


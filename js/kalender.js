
var $root = $('html, body');
var gSelectedMaandIndex = 0;
var gKalenderInstellingen = gKalenderDefaultsJSON;

$(document).ready(function(){
	var instellingen = getUrlParameter('instellingen');
	var tmpMaandIndex = getUrlParameter('maandIndex');
	if (typeof instellingen !== "undefined") {
		gKalenderInstellingen = JSON.parse(instellingen);
		alert(JSON.stringify(gKalenderInstellingen, null, 2));
	} else {
		alert('geen instellingen meegegeven');
	}

	activateSelectStartmaand();
	
	if (typeof tmpMaandIndex !== "undefined") {
		gSelectedMaandIndex = tmpMaandIndex;
		$("#startmaandSelect").val(tmpMaandIndex);
	}

	fillDefaultData();
	activateShowHidePrintInstellingen();
	activateAnimatedLinkToResultaat();
	activateSerializeJSONToString();

});



var fillDefaultData = function() {
	// vul de maanden in, te beginnen bij maand met index 0: dat is januari.
	fillInvoerMaandData(0);
	
};

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
//		$("#invoerMaandTitel"+i).val(gKalenderInstellingen.maanden[(i+selectedMaandIndex)<=12 ? i+selectedMaandIndex-1 : (i+selectedMaandIndex-1)%12].titel);
//		$("#invoerMaandTekst"+i).val(gKalenderInstellingen.maanden[(i+selectedMaandIndex)<=12 ? i+selectedMaandIndex-1 : (i+selectedMaandIndex-1)%12].tekst);
		$("#invoerMaandTitel"+i).val(gKalenderInstellingen.maanden[i-1].titel);
		$("#invoerMaandTekst"+i).val(gKalenderInstellingen.maanden[i-1].tekst);
	}
};

// vul de resultaatteksten voor de maanden in, te beginnen bij de geselecteerde maand
var fillResultaatMaandData = function() {
	for (var i=1; i<=12; i++) {
		$("#resultaatMaandTitel"+i).text($("#invoerMaandTitel"+i).val());
		$("#resultaatMaandTekst"+i).text($("#invoerMaandTekst"+i).val());
	}
};


// scroll langzaam naar het anchor '#anchorBijResultaat'
// de # hoort hier niet bij jQuery om een HTML-taq met een bepaald id op te zoeken maar hoort bij aan anchor in de tekst. 
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
	var url = document.location.href;
	var json = '{"maanden": [';
	var elBegin = '{';
	var elEind = '}';
	var elQuote = '"';
	var elLijm = ',';
	for (var i=1; i<=12; i++) {
		json += elBegin + elQuote + 'titel' + elQuote + ':' + elQuote + $("#invoerMaandTitel"+i).val() + elQuote;
		json += elLijm;
		json += elQuote + 'tekst' + elQuote + ':' + elQuote + $("#invoerMaandTekst"+i).val() + elQuote + elEind;
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


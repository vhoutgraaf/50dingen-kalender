
var $root = $('html, body');

// gSelectedMaandIndex gaat de gekozen index in de maand-selectbox bevatten. Standaard is deze 0: de eerste in de lijst. Oftewel Januari
// Maar als een argument 'maandIndex' is meegegeven aan de URL wordt die gebruikt.
var gSelectedMaandIndex = 0;
// gKalenderInstellingen gaat het JSON-object bevatten met de teksten. Standaard zijn dit de teksten uit kalenderdata.js.
// Maar als een argument 'instellingen' is meegegeven aan de URL wordt die gebruikt.
var gKalenderInstellingen = gKalenderDefaultsJSON;

// Deze functie: "$(document).ready" wordt uitgevoerd door JQuery zodra de hele webpagina, inclusief alle javascript en css is ingeladen in de browser.
// Pas vanaf dan kan je allerlei dingen doen met Javascript. Probeer je het eerder dan kan het gebeuren dat nog niet alles er is en het dus niet werkt.
$(document).ready(function(){
	// Eerst even kijken of er misschien argumenten zijn meegegeven met de url. 
	// Wanneer je de website opent met de kale link worden de standaard instellingen uit kalenderdata.js gebruikt.
	// Om je instellingen op te kunnen slaan kan je namelijk een link maken (met 'Maak een link voor opslag') waarin al je instellingen zijn opgeslagen.
	// Als je de website opent met die link worden je instellingen overgenomen.
	// Dat gaat zo: 
	// De index in de select-lijst van alle maanden staat in argument 'maandIndex'. Alles wat is ingevuld in de invulblokken staat in argument 'instellingen'
	// Dus een URL kan er zo uit zien: http://spacepolice.nl/50dingen-kalender/kalender.html?maandIndex=3&instellingen=%7B%22maanden%22%3A%20%5B%7B%22titel%22%3A%22Januari%22%2C%22tekst%22%3A%22maand%201%22%7D%2C%7B%22titel%22%3A%22Februari%22%2C%22tekst%22%3A%22maand%202%22%7D%2C%7B%22titel%22%3A%22Maart%22%2C%22tekst%22%3A%22maand%203%22%7D%2C%7B%22titel%22%3A%22April%22%2C%22tekst%22%3A%22maand%204%22%7D%2C%7B%22titel%22%3A%22Mei%22%2C%22tekst%22%3A%22maand%205%22%7D%2C%7B%22titel%22%3A%22Juni%22%2C%22tekst%22%3A%22maand%206%22%7D%2C%7B%22titel%22%3A%22Juli%22%2C%22tekst%22%3A%22maand%207%22%7D%2C%7B%22titel%22%3A%22Augustus%22%2C%22tekst%22%3A%22maand%208%22%7D%2C%7B%22titel%22%3A%22September%22%2C%22tekst%22%3A%22maand%209%22%7D%2C%7B%22titel%22%3A%22Oktober%22%2C%22tekst%22%3A%22maand%2010%22%7D%2C%7B%22titel%22%3A%22November%22%2C%22tekst%22%3A%22maand%2011%22%7D%2C%7B%22titel%22%3A%22December%22%2C%22tekst%22%3A%22maand%2012%22%7D%5D%7D
	// In dit geval heb je maand met index 3, dus april (want je begint bij 0 te tellen). De instellingen zijn een stuk ingewikkelder omdat
	// alle tekens die iets kunnen betekenen in een URL moeten worden gecodeerd zodat ze niet iets onbedoelds gaan veroorzaken.
	// Bijboorbeeld als je een & in je tekst hebt staan zou dat in een URL de start van een nieuw argument betekenen, en dat wil je niet in dit geval. 
	// Dus wordt een & vertaald naar %26. Enzovoorts. Hier staat een lijst: http://www.w3schools.com/tags/ref_urlencode.asp
	var instellingen = getUrlParameter('instellingen');
	// check of het argument 'instellingen' is meegegeven. 
	if (typeof instellingen !== "undefined") {
		// Jazeker, we hebben een argument 'instellingen'. Die moet eerst worden gedecodeerd met decodeURIComponent()
		// Daarna moet deze worden geparsed door functie JSON.parse zodat het veranderd van een tekenreeks in een Javascript JSON-object waarmee je echt iets kan doen in Javascript.
		// Sla het JSON-object op in de globale variabele gKalenderInstellingen
		gKalenderInstellingen = JSON.parse(decodeURIComponent(instellingen));
		//alert(JSON.stringify(gKalenderInstellingen, null, 2));
	} else {
		//alert('geen instellingen meegegeven');
	}
	
	// Zorg ervoor dat er iets gebeurd als je een maand kiest in de selectbox
	activateSelectStartmaand();
	
	// Ga nu na welke maandIndex er misschien is meegegeven aan de URL als argument. Als er niets wordt gevonden wordt deze op 0 gezet: de eerste keuze in de lijst oftewel Januari.
	// De index wordt opgeslagen in een globale variabele gSelectedMaandIndex
	var tmpMaandIndex = getUrlParameter('maandIndex');
	if (typeof tmpMaandIndex === "undefined") {
		tmpMaandIndex = getUrlParameter('maandindex');
	}
	if (typeof tmpMaandIndex !== "undefined") {
		gSelectedMaandIndex = tmpMaandIndex*1;
		$("#startmaandSelect").val(tmpMaandIndex);
	}
	// Vul de invoervelden in. gSelectedMaandIndex komt in het eerste blok te staan.
	fillInvoerMaandData(gSelectedMaandIndex);

	// Zorg ervoor dat er iets gebeurt als je klikt op het 'Resultaat'-div
	activateShowHidePrintInstellingen();

	// Zorg ervoor dat er iets gebeurt als je klikt op de link naar 'Resultaat': alle ingevulde tekst wordt overgenomen in het Resultaat , en er wordt langzaam gescrolled naar het resultaat.
	activateAnimatedLinkToResultaat();
	
	// Zorg ervoor dat je je instellingen kan opslaan in een URL
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

// Vul de invoerteksten voor de maanden in, te beginnen bij de geselecteerde maand
var fillInvoerMaandData = function(selectedMaandIndex) {
	for (var i=1; i<=12; i++) {
		var ix = (i+selectedMaandIndex)<=12 ? i+selectedMaandIndex-1 : (i+selectedMaandIndex-1)%12;
		var tmpTitel = gKalenderInstellingen.maanden[ix].titel;
		var tmpTekst = gKalenderInstellingen.maanden[ix].tekst;
		// Speciale tekens die de JSON in de war sturen zijn bij het maken van de opslag-URL veranderd: 
		// \n (nieuwe regel), "  en ' zijn allemaal veranderd in respectievelijk qqqqq, wwwww, eeeee en worden hier weer terugveranderd
		// in wat ze moeten zijn. 
		// Als iemand toevallig qqqqq, wwwww of eeeee als tekst heeft ingevoerd heeft-ie pech :-)
		var titel = tmpTitel.replace(/qqqqq/g, "\n").replace(/wwwww/g, '"').replace(/eeeee/g, "'");
		var tekst = tmpTekst.replace(/qqqqq/g, "\n").replace(/wwwww/g, '"').replace(/eeeee/g, "'");

		$("#invoerMaandTitel"+i).val(titel);
		$("#invoerMaandTekst"+i).val(tekst);
	}
};

// Vul de resultaatteksten voor de maanden in, te beginnen bij de geselecteerde maand
var fillResultaatMaandData = function() {
	for (var i=1; i<=12; i++) {
		var tmpTitel = $("#invoerMaandTitel"+i).val();
		var tmpTekst = $("#invoerMaandTekst"+i).val();
		// \n hoef je niet te vervangen: in CSS zet je daarvoor white-space: pre-line; in het element dat deze tekst gaat bevatten.
		// Zie: https://css-tricks.com/almanac/properties/w/whitespace/
		var titel = tmpTitel.trim();
		var tekst = tmpTekst.trim();
		$("#resultaatMaandTitel"+i).text(titel);
		$("#resultaatMaandTekst"+i).text(tekst);
	}
};


// Scroll 'slow' naar het anchor 'anchorBijResultaat'
// Een anchor is een plek in je pagina waarnaar je toe kan linken. Probeer maar eens file:///K:/Projecten/kalender-50-dingen/kalender.html#anchorBijResultaat
var activateAnimatedLinkToResultaat = function () {
	$('#linkNaarResultaat').click(function(){
		fillResultaatMaandData();
		$root.animate({
			scrollTop: $( $(this).attr('href') ).offset().top
		}, 'slow');
	});
};


// Deze functie heb je nodig om de instellingen op te kunnen slaan
// Speciale tekens die de JSON in de war sturen zijn moeten worden veranderd in iets onschuldigs. Dat gaat niet met encodeURIComponent vanwege allerlei redenen.
// \n (nieuwe regel), "  en ' worden veranderd in respectievelijk qqqqq, wwwww, eeeee. 
// Als iemand toevallig qqqqq, wwwww of eeeee als tekst heeft ingevoerd heeft-ie pech :-)
var maakJSONVanInvoer = function() {
	var url = (document.location.pathname).replace("#anchorBijResultaat", "");
	var json = '{"maanden": [';
	var elBegin = '{';
	var elEind = '}';
	var elQuote = '"';
	var elLijm = ',';
	for (var i=1; i<=12; i++) {
		var ix = (12+i-gSelectedMaandIndex)%12 == 0 ? 12 : (12+i-gSelectedMaandIndex)%12;

		var tmpTitel = $("#invoerMaandTitel"+ix).val();
		var tmpTekst = $("#invoerMaandTekst"+ix).val();
		var titel = tmpTitel.replace(/\r/g, "").replace(/\n/g, "qqqqq").replace(/"/g, 'wwwww').replace(/'/g, "eeeee");
		var tekst = tmpTekst.replace(/\r/g, "").replace(/\n/g, "qqqqq").replace(/"/g, 'wwwww').replace(/'/g, "eeeee");
		json += elBegin + elQuote + 'titel' + elQuote + ':' + elQuote + titel + elQuote;
		json += elLijm;
		json += elQuote + 'tekst' + elQuote + ':' + elQuote + tekst + elQuote + elEind;
		if (i!=12) {
			json += ',';
		}
	}
	json += ']}';
	//alert(json);
	return url + '?maandIndex=' + gSelectedMaandIndex + '&instellingen=' + encodeURIComponent(json);
}



// Maak een url die je kan opslaan
var activateSerializeJSONToString = function() {
		$("#serializeJSON").click(function(){
			var json_text = JSON.stringify(gKalenderInstellingen, null, 2);
			json_text = maakJSONVanInvoer();
			var urlVoorOpslag = json_text;
			$('#linkVoorOpslag').attr('href',urlVoorOpslag);
			$("#linkVoorOpslag").attr('class', 'linkVoorOpslagZichtbaar');
//			alert(serializeJSONToString());
    });

};


// Functie om argumenten die je meegeeft aan de URL gemakkelijk te kunnen bepalen.
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


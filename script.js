// COMPORTEMENT GENERAL

// Si l'utilisateur presse Enter dans les textbox, lance la fonction calcul()
$('.inputA').keyup(function(e) {
  // No need to do anything if it's not the enter key
  // Also only e.which is needed as this is the jQuery event object.
  if (e.which == 13) {
    calculA();
    return;
  }
});

$('.inputP').keyup(function(e) {
  // No need to do anything if it's not the enter key
  // Also only e.which is needed as this is the jQuery event object.
  if (e.which == 13) {
    calculP();
    return;
  }
});

$('.inputM').keyup(function(e) {
  // No need to do anything if it's not the enter key
  // Also only e.which is needed as this is the jQuery event object.
  if (e.which == 13) {
    calculM();
    return;
  }
});

// AFFICHAGE DES ONGLETS
function showIndex() {
  $('#tab-1').show();
  $('#tab-2').hide();
  $('#tab-3').hide();
  $('#indexButton').addClass('active');
  $('#puissanceButton').removeClass('active');
  $('#mixButton').removeClass('active');
}

function showPuissance() {
  $('#tab-1').hide();
  $('#tab-2').show();
  $('#tab-3').hide();
  $('#indexButton').removeClass('active');
  $('#puissanceButton').addClass('active');
  $('#mixButton').removeClass('active');
}

function showMix() {
  $('#tab-1').hide();
  $('#tab-2').hide();
  $('#tab-3').show();
  $('#indexButton').removeClass('active');
  $('#puissanceButton').removeClass('active');
  $('#mixButton').addClass('active');
}

function showOhygr() {
  $('#ohygr').toggle('fast');
}

// FONCTION SAUVEGARDE
function saveA() {

  // jQuery pour afficher le tableau de sauvegarde
  $("#saveDivA").show("slow");

  // jQuery copie les éléments dans le nouveau tableau
  $("#resultRowA").clone().appendTo("#saveTableA").css({
    display: "none"
  });

  // Affiche le tableau, supprime les id et diminue la police
  $("#saveTableA *").removeAttr("id").css({
    fontSize: "100%"
  }).show("slow");

  // SUPPRIMER UNE LIGNE DANS LE TABLEAU DE SAUVEGARDE
  $("#saveTableA td").click(function() {
    var row = $(this).closest('tr');
    row.remove();
    if ($('#saveTableA > tbody > tr').length == 0) { // hide table div if empty
      $('#saveDivA').hide("slow");
    }
    return false; // prevents default behavior
  });
}

function saveP() {

  // jQuery pour afficher le tableau de sauvegarde
  $("#saveDivP").show("slow");

  // jQuery copie les éléments dans le nouveau tableau
  $("#resultRowP").clone().appendTo("#saveTableP").css({
    display: "none"
  });

  // Affiche le tableau, supprime les id et diminue la police
  $("#saveTableP *").removeAttr("id").css({
    fontSize: "100%"
  }).show("slow");

  // SUPPRIMER UNE LIGNE DANS LE TABLEAU DE SAUVEGARDE
  $("#saveTableP td").click(function() {
    var row = $(this).closest('tr');
    row.remove();
    if ($('#saveTableP > tbody > tr').length == 0) { // hide table div if empty
      $('#saveDivP').hide("slow");
    }
    return false; // prevents default behavior
  });
}

function saveM() {

  // jQuery pour afficher le tableau de sauvegarde
  $("#saveDivM").show("slow");

  // jQuery copie les éléments dans le nouveau tableau
  $("#resultRowM").clone().appendTo("#saveTableM").css({
    display: "none"
  });

  // Affiche le tableau, supprime les id et diminue la police
  $("#saveTableM *").removeAttr("id").css({
    fontSize: "100%"
  }).show("slow");

  // SUPPRIMER UNE LIGNE DANS LE TABLEAU DE SAUVEGARDE
  $("#saveTableM td").click(function() {
    var row = $(this).closest('tr');
    row.remove();
    if ($('#saveTableM > tbody > tr').length == 0) { // hide table div if empty
      $('#saveDivM').hide("slow");
    }
    return false; // prevents default behavior
  });
}

/* -------------------------------------------------------------------------------------- */
// CALCUL DES VALEURS

// Fonction arrondie
function roundNumber(rnum, rlength) {
  var newnumber = Math.round(rnum * Math.pow(10, rlength)) / Math.pow(10, rlength);
  return newnumber;
}

// Déclaration des méthodes
var air = {
  getHygr: function(pv, pvs) {
    var hygr = 100 * pv / pvs;
    hygr = roundNumber(hygr, 0);
    return hygr;
  },

  getPvs: function(temp) {
    var pvs;
    if (temp > 0) {
      pvs = Math.pow(10, 2.7877 + (7.625 * temp) / (241.6 + temp));
    }
    else {
      pvs = Math.pow(10, 2.7877 + (9.756 * temp) / (272.7 + temp));
    }
    pvs = roundNumber(pvs, 0);
    return pvs;
  },

  getPv: function(hygr, pvs) {
    var pv = pvs * hygr / 100;
    pv = roundNumber(pv, 0);
    return pv;
  },

  getX: function(patm, pv) {
    var x = 0.622 * (pv / (patm - pv));
    x = roundNumber(x, 5);
    return x;
  },

  getH: function(temp, x) {
    var h = 1.006 * temp + x * (2501 + 1.83 * temp);
    h = roundNumber(h, 1);
    return h;
  },

  getV: function(temp, patm, x) {
    var v = (461.24 * (0.622 + x) * (temp + 273.15)) / patm;
    v = roundNumber(v, 3);
    return v;
  },

  getTr: function(temp, hygr) {
    var tr = Math.pow(hygr / 100, 1 / 8) * (112 + (0.9 * temp)) + (0.1 * temp) - 112;
    tr = roundNumber(tr, 2);
    return tr;
  }
}

// Calcul de l'air humide
function calculA() {

  // Récupération des données d'entrée
  var temp = parseInt(document.getElementById("temp").value, 10);
  var hygro = parseInt(document.getElementById("hygro").value, 10);
  var patm = parseInt(document.getElementById("patm").value, 10);

  // Si pas de valeurs
  if (document.getElementById("temp").value === "" || document.getElementById("hygro").value === "") {
    alert("Indiquer une température et une hygrométrie");
    return;
  }
  if (document.getElementById("patm").value === "") {
    patm = 101300;
  }

  // Affichage zone résultat
  $("#gridA").show();

  // Calcul des grandeurs
  var pvs = air.getPvs(temp);
  var pv = air.getPv(hygro, pvs);
  var x = air.getX(patm, pv);
  var h = air.getH(temp, x);
  var v = air.getV(temp, patm, x);
  var tr = air.getTr(temp, hygro);

  // Inscription des résultats dans le tableau
  document.getElementById("resultTemp").textContent = temp.toString() + " °C";
  document.getElementById("resultHygro").textContent = hygro.toString() + " %";
  document.getElementById("resultPvs").textContent = pvs.toString() + " Pa";
  document.getElementById("resultPv").textContent = pv.toString() + " Pa";
  document.getElementById("resultX").textContent = x.toString() + " kgeau/kgair";
  document.getElementById("resultH").textContent = h.toString() + " kj/kgair";
  document.getElementById("resultV").textContent = v.toString() + " m3/kg";
  document.getElementById("resultTr").textContent = tr.toString() + " °C";
}

// Calcul des puissances
function calculP() {
  var itemp = parseInt(document.getElementById("itemp").value, 10); // Température entrée batterie
  var ihygr = parseInt(document.getElementById("ihygr").value, 10); // Hygrométrie entrée batterie
  var otemp = parseInt(document.getElementById("otemp").value, 10); // Température sortie batterie

  if ($('#ohygr').is(':visible')) { // Hygrométrie sortie batterie
    var ohygr = parseInt(document.getElementById("ohygr").value, 10);
  }
  else { // Pour une évolution simple,
    var tempIpvs = air.getPvs(itemp); // on obtient l'hygrométrie via
    var tempOpvs = air.getPvs(otemp); // la pression de vapeur (fixe entrée/sortie)
    var tempPv = air.getPv(ihygr, tempIpvs);
    var ohygr = air.getHygr(tempPv, tempOpvs);
  }

  var q = parseInt(document.getElementById("debit").value, 10); // Débit d'air neuf
  var patm = 101300; // Pression atmosphérique

  // Cancel si pas de valeurs
  if (itemp.value === "" || ihygr.value === "" || otemp.value === "" || ohygr.value === "") {
    alert("Indiquer une température et une hygrométrie à l'entrée et la sortie de la batterie");
    return;
  }

  // Affichage zone résultat
  $("#gridP").show();

  // Entrées
  var ipvs = air.getPvs(itemp);
  var ipv = air.getPv(ihygr, ipvs);
  var ix = air.getX(patm, ipv);
  var ih = air.getH(itemp, ix);
  var iv = air.getV(itemp, patm, ix);

  //Sorties
  var opvs = air.getPvs(otemp);
  var opv = air.getPv(ohygr, opvs);
  var ox = air.getX(patm, opv);
  var oh = air.getH(otemp, ox);
  var ov = air.getV(otemp, patm, ox);

  // Calcul puissances
  var tP = Math.abs(ih - oh) * q / (3600 * iv) * 1000; // Puissance totale en W
  if ($('#ohygr').is(':visible')) {
    var bh = air.getH(itemp, ox); // Enthalpie point intermédiaire
    var lP = Math.abs(ih - bh) * q / (3600 * iv) * 1000; // Puissance latente en W
    var sP = Math.abs(bh - oh) * q / (3600 * iv) * 1000; // Puissance sensible en W
  }
  else {
    var sP = tP;
    var lP = 0;
  }

  tP = roundNumber(tP, 0);
  sP = roundNumber(sP, 0);
  lP = roundNumber(lP, 0);

  document.getElementById("input").textContent = itemp.toString() + " °C / " + ihygr.toString() + " %";
  document.getElementById("output").textContent = otemp.toString() + " °C / " + ohygr.toString() + " %";
  document.getElementById("tP").textContent = tP.toString() + " W";
  document.getElementById("sP").textContent = sP.toString() + " W";
  document.getElementById("lP").textContent = lP.toString() + " W";
}

// Calcul de l'air humide
function calculM() {

  // Récupération des données d'entrée
  var primT = parseInt(document.getElementById("primT").value, 10);
  var primH = parseInt(document.getElementById("primH").value, 10);
  var primQ = parseInt(document.getElementById("primQ").value, 10);
  var secT = parseInt(document.getElementById("secT").value, 10);
  var secH = parseInt(document.getElementById("secH").value, 10);
  var secQ = parseInt(document.getElementById("secQ").value, 10);
  var patm = parseInt(document.getElementById("patm").value, 10);

  // Si pas de valeurs
  if (document.getElementById("primT").value === "" || document.getElementById("primH").value === "" || document.getElementById("primQ").value === "" || document.getElementById("secT").value === "" || document.getElementById("secH").value === "" || document.getElementById("secQ").value === "") {
    alert("Toutes les entrées sont nécessaires");
    return;
  }
  if (document.getElementById("patm").value === "") {
    patm = 101300;
  }

  // Affichage zone résultat
  $("#gridM").show();

  // Calcul des grandeurs air primaire
  var primPvs = air.getPvs(primT);
  var primPv = air.getPv(primH, primPvs);
  var primX = air.getX(patm, primPv);
  var primH = air.getH(primT, primX);
  var primV = air.getV(primT, patm, primX);

  // Calcul des grandeurs air secondaire
  var secPvs = air.getPvs(secT);
  var secPv = air.getPv(secH, secPvs);
  var secX = air.getX(patm, secPv);
  var secH = air.getH(secT, secX);
  var secV = air.getV(secT, patm, secX);

  // Calcul enthalpie et humidité spécifique du mélange
  var x = (primQ / (primQ + secQ)) * primX + (secQ / (primQ + secQ)) * secX;
  var h = (primQ / (primQ + secQ)) * primH + (secQ / (primQ + secQ)) * secH;

  // Calcul des caractéristiques du mélange
  var temp = (h - 2501 * x) / (1.006 + 1.83 * x);
  var pvs = air.getPvs(temp);
  var pv = (x * patm) / (0.622 + x);
  var hygro = pv / pvs * 100;
  var v = air.getV(temp, patm, x);
  var tr = air.getTr(temp, hygro);

  // Calcul du débit mélange
  var qv = (primQ / primV + secQ / secV) * v;

  // Arrondissement des valeurs
  qv = roundNumber(qv, 0);
  temp = roundNumber(temp, 1);
  hygro = roundNumber(hygro, 0);
  pvs = roundNumber(pvs, 0);
  pv = roundNumber(pv, 0);
  x = roundNumber(x, 5);
  h = roundNumber(h, 1);
  v = roundNumber(v, 3);
  tr = roundNumber(tr, 1);


  // Inscription des résultats dans le tableau
  document.getElementById("mixResultQv").textContent = qv.toString() + " m3/h";
  document.getElementById("mixResultTemp").textContent = temp.toString() + " °C";
  document.getElementById("mixResultHygro").textContent = hygro.toString() + " %";
  document.getElementById("mixResultPvs").textContent = pvs.toString() + " Pa";
  document.getElementById("mixResultPv").textContent = pv.toString() + " Pa";
  document.getElementById("mixResultX").textContent = x.toString() + " kgeau/kgair";
  document.getElementById("mixResultH").textContent = h.toString() + " kj/kgair";
  document.getElementById("mixResultV").textContent = v.toString() + " m3/kg";
  document.getElementById("mixResultTr").textContent = tr.toString() + " °C";
}
(function () {
  // === constantes ===
  const MAX_QTE = 9;
  const produitId = "produit";
  const achatId = "achat";
  const inputId = "qte";

  // references vers les elements du DOM
  const divBoutique = document.getElementById("boutique");
  const inputFiltre = document.getElementById("filtre");
  const divAchats = document.getElementById("achats");
  const spanMontant = document.getElementById("montant");

  // le cout total des produits du panier
  let total = 0;
  // tableau de booleens (displayed/not displayed) 
  // pour prendre en compte le filtre
  let tabProduitsFiltres = new Array(catalogue.length);
  tabProduitsFiltres.fill(true);
  // tableau des quantites de produits dans le panier
  let quantites = new Array(catalogue.length);
  quantites.fill(0);

  // initialisation du contenu de la boutique
  afficherBoutique();

  /*
  * ajoute les elements produits a l'element div#boutique 
  * en fonction du contenu du catalogueue
  * A MODIFIER en tenant compte du contenu tableau 
  * tabProduitsFiltres
  */
  function afficherBoutique() {
    for (let i = 0; i < catalogue.length; i++) {
      if(tabProduitsFiltres[i]){
        divBoutique.appendChild(creerDivProduit(i));
      }
    }
  }

  inputFiltre.addEventListener("input",function(){
    for(let i=0;i<tabProduitsFiltres.length;i++){
      if(catalogue[i].nom.includes(inputFiltre.value)){
        tabProduitsFiltres[i] = true;
        console.log("true");
      }
      else{
        tabProduitsFiltres[i] = false;
      }
    }
    divBoutique.innerHTML='';
    afficherBoutique();
  });

  /*
  * creation d'une div produit avec comme id 
  * index-product  
  * @param index  = index dans le tableau catalogue
  * @return product = reference de l'element HTML
  */
  function creerDivProduit(index) {
    // creation de la div de classe produit
    let produit = document.createElement("div");
    produit.className = "produit";
    // donne un id au produit
    produit.id = index + "-" + produitId;
    produit.image = "images/";
    produit.innerHTML = `
<h2>${catalogue[index].nom}</h2>
<figure>
  <img 
    src="${catalogue[index].image}" 
    alt="${catalogue[index].description}"
  />
</figure>
<div class="description">
  ${catalogue[index].description}
</div>
<div class="prix">
  ${catalogue[index].prix}
</div>`;
    // ajoute les elements de formulaire pour l'ajout au panier
    produit.appendChild(creerControleProduit(index));
    // la div product est retournee
    return produit;
  }

  function creerDivAchat(index){
      let newDivAchat = document.createElement("div");
      newDivAchat.setAttribute("id",index);
      let newDivNom = document.createElement("div");
      newDivNom.setAttribute("id",index+"-nom");
      newDivNom.textContent = catalogue[index].nom;
      let newDivQuantite = document.createElement("div");
      newDivQuantite.setAttribute("id",index+"-quantite");
      let quantite = quantites[index];
      newDivQuantite.textContent = quantite;
      newDivAchat.appendChild(newDivQuantite);
      newDivAchat.appendChild(newDivNom);
      let boutonSupprProduit = document.createElement("button");
      boutonSupprProduit.setAttribute("id",index+"-suppr");
      boutonSupprProduit.textContent="Supprimer";
      newDivAchat.appendChild(boutonSupprProduit);
      boutonSupprProduit.addEventListener('click', function() {
        boutonSupprProduit.parentElement.remove();
        let montant = document.getElementById("montant");
        let old = parseInt(montant.textContent);
        let newval = old - parseInt(catalogue[index].prix)*parseInt(quantites[index]);
        montant.textContent = newval.toString();
        quantites[index]=0;
      });
      divAchats.appendChild(newDivAchat);
      return newDivAchat;
  }

  function mettreAJourPanier(index){
    let divMontant = document.getElementById("montant");
    let valeurMontant = parseInt(divMontant.textContent);
    let quantiteItem = parseInt(quantites[index]);
    let prixItem = parseInt(catalogue[index].prix);
    let qte = parseInt(quantites[index]);
    let existant = document.getElementById(index+"-quantite");
    let nouveaumontant=0;
    if(qte > 0 && existant !== null ){
      for(let i=0;i<quantites.length;i++){
        nouveaumontant+=parseInt(quantites[i])*parseInt(catalogue[i].prix);
      }
      montant.textContent = nouveaumontant.toString();
      existant.textContent = quantites[index];
    }
    else{
      nouveaumontant = valeurMontant + quantiteItem * prixItem;
      let nouvelleDivProduit = creerDivAchat(index);
      let newDivQuantiteExistante = nouvelleDivProduit.firstChild;
      newDivQuantiteExistante.textContent = quantites[index];
    }
    montant.textContent=nouveaumontant;
  }

  /*
  * ajoute les elements de formulaire pour l'ajout au panier
  * @param index = l'index du produit dans catalogueue
  *
  * AJOUTER les listeners pour rendre l'input et le bouton
  * fonctionnels
  */
  function creerControleProduit(index) {
    let controle = document.createElement("div");
    controle.className = "controle";

    // creation de l'input pour la quantite
    let input = document.createElement("input");
    input.id = index + '-' + inputId;
    input.type = "number";
    input.step = "1";
    input.value = "0";
    input.min = "0";
    input.max = MAX_QTE.toString();
    controle.appendChild(input);

    input.addEventListener('input', function() {
      var iv = parseInt(input.value);
      if(iv < input.min || iv > input.max || isNaN(iv) === true ){
        input.value = 0;
        button.disabled = true;
      }
      button.disabled = iv > 0 ? false : true; 
    });

    // creation du bouton pour ajouter au panier
    let button = document.createElement("button");
    button.className = 'commander';
    button.id = index + "-" + achatId;
    // inactif tant que la valeur de l'input quantite est 0
    button.disabled = true;
    controle.appendChild(button);

    button.addEventListener('click', function() {
      var iv = parseInt(input.value);
      if( button.disabled === false){
        quantites[index]=iv;
        mettreAJourPanier(index);
        button.disabled = true;
        input.value="0";
      }
      else{
        button.disabled = false;
      }
    });

    // la div de controlee est retournee
    return controle;
  }
})();
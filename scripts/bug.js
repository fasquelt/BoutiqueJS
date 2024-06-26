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
        divBoutique.appendChild(creerDivProduit(i));
      }
    }
  
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
      produit.image = "images/"
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
        let acheté = document.createElement("div");
        acheté.setAttribute("id",index);
        let name = document.createElement("div");
        name.setAttribute("id",index+"-nom");
        name.textContent = catalogue[index].nom;
        let qt = document.createElement("div");
        qt.setAttribute("id",index+"-quantite");
        let quantite = quantites[index];
        qt.textContent = quantite;
        acheté.appendChild(qt);
        acheté.appendChild(name);
        let img = document.createElement("div");
        img.innerHTML = 
        <figure>
        <img 
            src="${catalogue[index].image}" 
            alt="${catalogue[index].description}"
          />
        </figure>
        acheté.appendChild(img);
        let rm = document.createElement("button");
        rm.setAttribute("id",index+"-suppr");
        rm.textContent="Supprimer";
        acheté.appendChild(rm);
        rm.addEventListener('click', function() {
          rm.parentElement.remove();
          let montant = document.getElementById("montant");
          let newval = parseInt(montant.textContent) - parseInt(catalogue[index].prix)*parseInt(quantites[index]);
          montant.textContent = newval.toString();
          quantites[index]=0;
        })
        return acheté;
    }
  
    function mettreAJourPanier(index){
      let liste = document.getElementById("achats");
      let montant = document.getElementById("montant");
      var existant = document.getElementById(index.toString()+"-quantite");
      let qte = parseInt(quantites[index]);
      let montantactuel = parseInt(montant.textContent);
      let nouveaumontant;
      if(qte !== 0 && existant !== null){
        nouveaumontant = quantites[index] * parseInt(catalogue[index].prix);
        existant.textContent = quantites[index];
      }
      else{
        nouveaumontant = montantactuel + parseInt(quantites[index]) * parseInt(catalogue[index].prix);
        liste.appendChild(creerDivAchat(index));
      }
      montant.textContent=nouveaumontant.toString();
  
  
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
          button.disabled === true;
        }
        iv > 0 ? button.disabled = false : button.disabled = true; 
      })
  
      // creation du bouton pour ajouter au panier
      let button = document.createElement("button");
      button.className = 'commander';
      button.id = index + "-" + achatId;
      // inactif tant que la valeur de l'input quantite est 0
      button.disabled = true;
      controle.appendChild(button);
  
      button.addEventListener('click', function() {
        var iv = parseInt(input.value);
        if( button.disabled === false ){
          quantites[index]+=iv
          mettreAJourPanier(index);
          button.disabled = true;
          input.value="0";
        }
      })
  
      // la div de controlee est retournee
      return controle;
    }
  })();
  
var i = 0;
var letter = 'a';
var obj_details = {};

// var new_detail_div = document.createElement("div");
// var main_div = document.createElement("div");
// var detailsProduct = document.getElementById("detailsProduct");
// var list_div = document.createElement("div");
// var label_selectdetails = document.createElement("label");
// var detail = document.createElement("div");
// var span_detail = document.createElement("span");
// var button_detail = document.createElement("span");

function addCaracteristique() {
    letter = String.fromCharCode(letter.charCodeAt() + 1);

    if (document.getElementById("button_ajouter")) {
        var button_ajouter = document.getElementById("button_ajouter");
        button_ajouter.remove();
    }
    // récupère le checkbox pour voir si il est checked ou pas
    var checkbox = document.getElementById("variantions");

    if (checkbox.checked) {
        addInput();
    }

    // supprime tous les éléments crées
    if (!checkbox.checked) {
        var main_div = document.getElementById("main_div");
        main_div.remove();
        // var input = document.getElementById("input_detail");
        // input.remove();
        // var select = document.getElementById("selectdetails");
        // select.remove();
        // var span_detail = document.getElementById("span_detail");
        // span_detail.remove();
        // var button_detail = document.getElementById("button_detail");
        // button_detail.remove();
    }
}

//  ajoute un détail ex: une taille, une couleur ou autre
function addDetail(event) {
    event.preventDefault();
    // i sert à construire un id unique pour chaque nouveau détail
    i++;
    // récupère la value de l'input qui sert à entrer un nouveau détail
    let val = document.getElementById("input_detail").value;

    // création de la div detail qui contient span_detail et button_detail
    var detail = document.createElement("div");
    detail.setAttribute("id", "detail" + i);
    detail.className = "detail";
    new_detail_div.appendChild(detail);
    // création d'un span qui affiche le nouveau détail
    var span_detail = document.createElement("span");
    span_detail.setAttribute("id", "span_detail");
    span_detail.innerHTML = val;
    detail.appendChild(span_detail);
    // crée un button qui sert à supp le span_detail
    var button_detail = document.createElement("span");
    button_detail.setAttribute("id", "button_detail");
    button_detail.setAttribute("value", 'detail' + i);
    button_detail.setAttribute("onclick", "deletFromList(" + i + ");");
    button_detail.innerHTML = "X";
    detail.appendChild(button_detail);
    // efface ce qu'il y a dans l'input qui sert à entrer un nouveau détail
    document.getElementById("input_detail").value = '';
    // ajoute dans l'objet un id unique et la value de l'input qui sert à entrer un nouveau détail
    obj_details['detail' + i] = val;

    for (const [key, value] of Object.entries(obj_details)) {
        console.log(`${key}: ${value}`);
    }
}

function deletFromList(id) {
    // on concatène 'detail' et i pour obtenir l'id car la concatenation ne fonctionne pas dans le onclick du setAttribute
    var detail_to_delete = document.getElementById('detail' + id);
    detail_to_delete.remove();
    let element = 'detail' + id;
    delete obj_details[element];

    for (const [key, value] of Object.entries(obj_details)) {
        console.log(`${key}: ${value}`);
    }
}

function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", document.getElementById("name").value);
    formData.append("price", document.getElementById("price").value);
    formData.append("taxe", document.getElementById("taxe").value);
    formData.append("collection", document.getElementById("collection").value);
    formData.append("image", document.getElementById("image").value);
    formData.append("description", document.getElementById("description").value);
    formData.append("caracteristique", document.getElementById("selectdetails").value);
    // transformation de l'objet en string JSON
    var obj = JSON.stringify(obj_details);
    formData.append("obj", obj);
    const imagefile = document.querySelector('#image');
    formData.append("image", imagefile.files[0]);
    axios.post(`http://127.0.0.1:8000/products`, formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(res => {
            console.log('res.data  --->  ok');
        });

    // document.getElementById("newProductForm").submit();
}

function addInput() {

    // création du parent dans la div principale detailsProduct
    var main_div = document.createElement("div");
    main_div.setAttribute("id", "main_div");
    main_div.className = "main_div";
    var detailsProduct = document.getElementById("detailsProduct");
    detailsProduct.appendChild(main_div);
    // crée une div qui contient le select et son label
    var list_div = document.createElement("div");
    list_div.setAttribute("id", "list_div");
    list_div.className = "p-2 bd-highlight";
    main_div.appendChild(list_div);
    // crée le label pour le select
    var label_selectdetails = document.createElement("label");
    label_selectdetails.setAttribute("id", "label_selectdetails");
    label_selectdetails.setAttribute("for", "selectdetails");
    list_div.appendChild(label_selectdetails);

    // récupére les types de détails et les met dans un select
    axios.get(`http://127.0.0.1:8000/listtype`)
        .then(res => {
            // création du select pour choisir le type d'option
            var select = document.createElement("select");
            select.setAttribute("id", "selectdetails");
            // on boucle pour remplir le select
            res.data.map(detail => {
                var option = document.createElement("option");
                option.setAttribute("value", detail['id']);
                option.innerHTML = detail['name'];
                select.appendChild(option);
            })
            list_div.appendChild(select);
        }).catch(function (error) {
            console.log('error:   ' + error);
        });

    // div qui contien la div detail - sert pour le positionnement
    var new_detail_div = document.createElement("div");
    new_detail_div.setAttribute("id", "new_detail_div");
    new_detail_div.className = "new_detail_div";
    main_div.appendChild(new_detail_div);
    // crée un input pour entrer le nouveau détail. Le onchange l'insert dans un objet
    var input = document.createElement("input");
    input.setAttribute('type', 'text');
    input.className = "input_detail";
    input.setAttribute("id", "input_detail");
    input.setAttribute("onchange", "addDetail(event)");
    main_div.appendChild(input);
    // crée un button qui sert à Ajouter une autre option donc qui recrée tous les éléments pour la création d'une nouvelle caractèristique
    var button_ajouter = document.createElement("span");
    button_ajouter.setAttribute("id", "button_ajouter");
    button_ajouter.setAttribute("onclick", "addCaracteristique();");
    button_ajouter.innerHTML = "Ajouter une autre option";
    detailsProduct.appendChild(button_ajouter);

}

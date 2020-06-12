//Module Pattern
(function () {

    //user interface
    var ui = {
        fields: document.querySelectorAll("input"),
        button: document.querySelector(".pure-button"),
        table: document.querySelector(".pure-table tbody")
    };


    // actions 
    var validate = function (e) {

        e.preventDefault();

        var contact = {};
        var erros = 0;

        ui.fields.forEach(function (field) {

            if (field.value.trim().length > 0) {
                field.classList.remove("error");
                contact[field.id] = field.value.trim();
            } else {
                field.classList.add("error");
                erros++;
            }

        });

        if (erros > 0) {
            document.querySelector(".error").focus();
        } else {
            addContact(contact);
        }

    };


    var addContact = function (contact) {
        var endpoint = "http://localhost:5000/contacts";
        var config = {
            method: "POST",
            body: JSON.stringify(contact),
            headers: new Headers({
                "Content-type": "application/json"
            })
        };

        fetch(endpoint, config)  //Conexão async.
            .then(clearFields.bind(null, getContacts)) //Sucesso
            .catch(genericError); //Falha
    };


    var clearFields = function (callback) {

        ui.fields.forEach(function (field) {
            field.value = "";
        })

        ui.fields[0].focus();

        if (callback && typeof callback === "function") {
            //Implementação de callback
            callback();
        }

    };


    var genericError = function () {
        console.error("Serviço indisponível ===> FALHA");
    };


    var getContacts = function () {
        var endpoint = "http://localhost:5000/contacts";
        var config = {
            method: "GET",
            headers: new Headers({
                "Content-type": "application/json"
            })
        };

        fetch(endpoint, config)  //Conexão async.
            .then(function (response) { return response.json(); })
            .then(getContactsSuccess)
            .catch(genericError);
    };


    var getContactsSuccess = function (contacts) {

        var htmlList = contacts.map(function (contact) {
            return `
            <tr>
                <td>${contact.id}</td>
                <td>${contact.name}</td>
                <td>${contact.email}</td>
                <td>${contact.phone}</td>
                <td> <img src='img/excluir.png' width='20' height='20' data-id='${contact.id}' data-action='delete'> </td>
            </tr>`;
        }).join("");

        if (htmlList.length === 0) {
            htmlList = `<tr> <td colspan="5">Não existem dados registrados!</td> </tr>`;
        }

        ui.table.innerHTML = htmlList;

    }


    var removeContact = function (e) {
        e.preventDefault();
        var { id, action } = e.target.dataset; //Destructuring

        if (id && action === "delete") {
            var endpoint = `http://localhost:5000/contacts/${id}`;
            var config = {
                method: "DELETE",
                headers: new Headers({
                    "Content-type": "application/json"
                })
            };

            fetch(endpoint, config)
                .then(getContacts)
                .catch(genericError);

        }
    };


    var init = function () {
        ui.button.onclick = validate;
        ui.table.addEventListener("click", removeContact);

        getContacts();

    }();


})(); //i.i.f.e. ou função imediata
window.addEventListener("load", () => {
    setCurrentTime();

    setup();

    loadData();
});

function setup() {
    settingsSetup();

    addItemSetup();

    templateSetup();
}

function templateSetup() {
    const formTemplate = document.getElementById("form-templates");
    const templateText = document.getElementById("template-text");
    const templateList = document.getElementById("template-text-options");
    const templateAdd = document.getElementById("template-add");
    const templateRemove = document.getElementById("template-remove");

    formTemplate.addEventListener("submit", (event) => {
        event.preventDefault();

        const text = templateText.value;

        if (text) {
            const option = document.createElement("option");
            option.value = text;
            option.innerText = text;
            templateList.appendChild(option);
            templateText.value = "";
        }
        else {
            alert("Wypełnij wszystkie pola!");
            return;
        }
        saveData();
    });

    templateRemove.addEventListener("click", () => {
        const selectedOption = templateList.options[0].value;
        if (selectedOption !== -1) {
            templateList.removeChild(templateList.options[0]);
            templateText.value = "";
        }
        else {
            alert("Nie wybrano opcji do usunięcia!");
            return;
        }
        saveData();
    });
}

function addItemSetup() {
    const formAddItem = document.getElementById("form-add-item");
    const inputTime = document.getElementById("input-time");
    const inputText = document.getElementById("input-text");

    const itemsList = document.getElementById("items-list");

    formAddItem.addEventListener("submit", (event) => {
        event.preventDefault();

        const time = inputTime.value;
        const text = inputText.value;

        if (time && text) {
            const item = createItem(time, text);
            itemsList.appendChild(item);
            inputText.value = "";
        }
        else {
            alert("Wypełnij wszystkie pola!");
            return;
        }
        saveData();
    });
}

function settingsSetup() {

    const buttonSend = document.getElementById("send-button");
    buttonSend.addEventListener("click", () => {

        var link =
            "mailto:your@email.com" +
            "?cc=" +
            "&subject=" +
            encodeURIComponent("Imię Nazwisko - Dzienniczek - Data") +
            "&body=" +
            encodeURIComponent(getText());
        window.location.href = link;
    });


    const buttonCopy = document.getElementById("copy-button");
    buttonCopy.addEventListener("click", () => {
        navigator.clipboard.writeText(getText()).then(() => {
            alert("Skopiowano do schowka!")
        });
    });

    const buttonSettings = document.getElementById("settings-button");
    const containerSettings = document.getElementById("settings-container");

    buttonSettings.addEventListener("click", (e) => {
        e.preventDefault();

        if (containerSettings.style.display === "none") {
            containerSettings.style.display = "block";
        }
        else {
            containerSettings.style.display = "none";
        }
    });

    const buttonClear = document.getElementById("clear-button");
    const formSummary = document.getElementById("form-summary");

    buttonClear.addEventListener("click", (e) => {
        const formItems = formSummary.children;
        for (let formItem of formItems) {
            if (formItem.tagName === "INPUT") {
                formItem.value = "";
            }
        }
        const itemsList = document.getElementById("items-list");
        itemsList.innerHTML = "";

        saveData();
    });

    formSummary.addEventListener("input", (event) => {
        saveData();
    });
}

function getText() {
    const itemsList = document.getElementById("items-list");
    const items = itemsList.children;
    let temp = "";

    for (let item of items) {
        const time = item.children[0].value;
        const text = item.children[1].value;
        temp += `${time} - ${text}\n`;
    }

    const summaryLiquids = document.getElementById("summary-liquids");
    const summaryScreen = document.getElementById("summary-screen");
    const summaryAches = document.getElementById("summary-aches");
    const summaryExercises = document.getElementById("summary-exercises");
    const summaryText = document.getElementById("summary-text");

    temp += `\n\nPłyny: ${summaryLiquids.value}\nIlość godzin przed ekranem: ${summaryScreen.value}\nBóle: ${summaryAches.value}\nĆwiczenia: ${summaryExercises.value}\nPodsumowanie: ${summaryText.value}`;

    return temp;
}

function currentTime() {
    const localTime = new Date().toLocaleTimeString("pl-PL", {hour12: false}).slice(0, 5).toString();
    return localTime;
}

function setCurrentTime() {
    const inputTime = document.getElementById("input-time");
    inputTime.value = currentTime();
}

function createItem(time, text) {
    const item = document.createElement("div");
    item.classList.add("item");

    const itemTime = document.createElement("input");
    itemTime.type = "time";
    itemTime.value = time;
    itemTime.readOnly = true;
    itemTime.classList.add("item-time");

    const itemText = document.createElement("input");
    itemText.type = "text";
    itemText.value = text;
    itemText.readOnly = true;
    itemText.classList.add("item-text");

    const buttons = document.createElement("section");
    buttons.classList.add("item-buttons");
    
    const itemEdit = document.createElement("input");
    itemEdit.type = "image";
    itemEdit.src = "images/pen-to-square-regular.svg";
    itemEdit.classList.add("item-edit");

    const itemDelete = document.createElement("input");
    itemDelete.type = "image";
    itemDelete.src = "images/trash-can-regular.svg";
    itemDelete.classList.add("item-delete");
    
    item.appendChild(itemTime);
    item.appendChild(itemText);
    buttons.appendChild(itemEdit);
    buttons.appendChild(itemDelete);
    item.appendChild(buttons);

    itemEdit.addEventListener("click", () => {
        if (itemText.readOnly || itemTime.readOnly) {
            itemText.readOnly = false;
            itemTime.readOnly = false;
            itemEdit.src = "images/floppy-disk-regular.svg";
            saveData();
        }
        else {
            itemText.readOnly = true;
            itemTime.readOnly = true;
            itemEdit.src = "images/pen-to-square-regular.svg";
            saveData();
        }
    });

    itemDelete.addEventListener("click", () => {
        item.remove();
        saveData();
    });

    return item;
}

function saveData() {
    const itemsList = document.getElementById("items-list");
    const items = itemsList.children;

    const itemsData = [];

    for (let item of items) {
        const time = item.children[0].value;
        const text = item.children[1].value;
        itemsData.push({time, text});
    }

    const templateList = document.getElementById("template-text-options");
    const templateOptions = templateList.children;

    const templateData = [];

    for (let option of templateOptions) {
        const text = option.value;
        templateData.push({text});
    }

    localStorage.setItem("templates", JSON.stringify(templateData));
    localStorage.setItem("items", JSON.stringify(itemsData));

    const summaryLiquids = document.getElementById("summary-liquids");
    const summaryScreen = document.getElementById("summary-screen");
    const summaryAches = document.getElementById("summary-aches");
    const summaryExercises = document.getElementById("summary-exercises");
    const summaryText = document.getElementById("summary-text");

    const summaryData = {
        liquids: summaryLiquids.value,
        screen: summaryScreen.value,
        aches: summaryAches.value,
        exercises: summaryExercises.value,
        text: summaryText.value
    };

    localStorage.setItem("summary", JSON.stringify(summaryData));

}

function loadData() {
    const itemsList = document.getElementById("items-list");
    const itemsData = JSON.parse(localStorage.getItem("items"));

    if (itemsData) {
        for (let itemData of itemsData) {
            const item = createItem(itemData.time, itemData.text);
            itemsList.appendChild(item);
        }
    }

    const templateList = document.getElementById("template-text-options");
    const templateData = JSON.parse(localStorage.getItem("templates"));

    if (templateData) {
        for (let template of templateData) {
            const option = document.createElement("option");
            option.value = template.text;
            option.innerText = template.text;
            templateList.appendChild(option);
        }
    }

    const summaryLiquids = document.getElementById("summary-liquids");
    const summaryScreen = document.getElementById("summary-screen");
    const summaryAches = document.getElementById("summary-aches");
    const summaryExercises = document.getElementById("summary-exercises");
    const summaryText = document.getElementById("summary-text");
    const summaryData = JSON.parse(localStorage.getItem("summary"));

    if (summaryData) {
        summaryLiquids.value = summaryData.liquids;
        summaryScreen.value = summaryData.screen;
        summaryAches.value = summaryData.aches;
        summaryExercises.value = summaryData.exercises;
        summaryText.value = summaryData.text;
    }
}
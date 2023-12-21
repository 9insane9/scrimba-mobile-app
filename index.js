import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from 
"https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

import { clearInputFieldEl, clearShoppingListEl } from "./functions.js"

const appSettings = {
    databaseURL : "https://realtime-database-e6102-default-rtdb.europe-west1.firebasedatabase.app/"
}

//because all functions use parameters, shorten their names to simplify
//needs to run in live server for it to work, cannot import functions otherwise
const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.querySelector("#input-field")
const addBtnEl = document.querySelector("#add-button")
const shoppingListEl = document.querySelector("#shopping-list")

onValue(shoppingListInDB, function (snapshot) {

    if (snapshot.exists()) {
        let shoppingListArray = Object.entries(snapshot.val());

        clearShoppingListEl(shoppingListEl)

        shoppingListArray.forEach(item => {
            let currentItemID = item[0]
            let currentItemValue = item[1]

            appendItemToShoppingListEl(item, shoppingListEl)
        })
    } else {
        shoppingListEl.textContent = "No items here... yet"
    }
})


addBtnEl.addEventListener("click", ()=> {
    let inputValue = inputFieldEl.value
    clearInputFieldEl(inputFieldEl)
    push(shoppingListInDB, inputValue)
})

function appendItemToShoppingListEl (item, listEl) {
    let itemID = item[0];
    let itemValue = item[1];

    const li = document.createElement("li");
    li.textContent = itemValue;

    li.addEventListener("dblclick", () => {
        console.log(itemID)
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        remove (exactLocationOfItemInDB);
    })

    listEl.appendChild(li);
}
import { initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-1e6b0-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const groceriesInDB = ref(database, "groceries")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

//get the values from the database, runs whenever the database is changed
onValue(groceriesInDB, function(snapshot) {

    if (snapshot.exists()) {
        let groceriesArray = Object.entries(snapshot.val())
        clearShoppingListEl()
        for (let i = 0; i < groceriesArray.length; i++){
            let currentGrocery = groceriesArray[i]
    
            let currentGroceryID = currentGrocery[0]
            let currentGroceryValue = currentGrocery[1]
            appendItemToShoppingListEl(currentGrocery)
        }

    } else {
        shoppingListEl.innerHTML = "No items here yet..."
    }

})


addButtonEl.addEventListener("click", function(){
    let inputValue = inputFieldEl.value

    push(groceriesInDB, inputValue)
    clearInputFieldEl()  
    
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    // shoppingListEl.innerHTML += `<li>${itemValue}</li>`

    let itemID = item[0]
    let itemValue = item[1]
    let newEl = document.createElement("li")
    newEl.textContent = itemValue

    newEl.addEventListener("dblclick", function() {
        let exactLocationOfGroceryInDB = ref(database, `groceries/${itemID}`)
        remove(exactLocationOfGroceryInDB)

    })
    shoppingListEl.append(newEl)
}
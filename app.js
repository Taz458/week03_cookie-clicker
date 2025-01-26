//put my global variables at the top to make it easier to reference
let cookies = 0
let cps = 1
const cookieImageElem = document.getElementById("cookieImage")
const cookiesElem = document.getElementById("cookiesDisplay")
const cpsDisplayElem = document.getElementById("cpsDisplay")

// Function to load saved values from local storage, if they are in local storage
function loadGameData() {
    const savedCookies = localStorage.getItem("cookies");
    const savedCPS = localStorage.getItem("cps");

    // Parse and update variables if values exist
    if (savedCookies) {
        cookies = parseInt(savedCookies, 10);
        cookiesElem.textContent = cookies;
    }
    if (savedCPS) {
        cps = parseInt(savedCPS, 10);
        cpsDisplayElem.textContent = cps;
    }
}

// Function to save current game data to local storage
function saveGameData() {
    localStorage.setItem("cookies", cookies);
    localStorage.setItem("cps", cps);
}



//add event listener to image, when clicked increases cookies by 1 and changes content on the html.
cookieImageElem.addEventListener("click", () => {
    cookies += 1
    cookiesElem.textContent=(cookies)
    saveGameData() //saves game data after each click of the image.
})

//Increments cokie count every second
function cookieIncrementer() {
    setInterval(() => {
        cookies += cps
        cookiesElem.textContent=(cookies)
        saveGameData() //saves cookies and cps after each increment.
    },1000)
}

//runs the function
loadGameData()
cookieIncrementer()
fetchShopDataThenCreateShop()
createResetButton()


// retrieves the data from the JSON about the shop 
async function fetchShopDataThenCreateShop() {
    const response = await fetch("https://cookie-upgrade-api.vercel.app/api/upgrades") //fetches data from api
    const upgrades = await response.json() //now data is essentially an array, where i call each term using data[i].nameofattribute
    createShop(upgrades)
}

async function createShop(upgrades) {
    upgrades.forEach((upgrade) => {
        //create elements we want in the DOM/HTML, for each upgrade in JSON.
        const upgradeContainerElem=document.createElement("div")
        upgradeContainerElem.classList.add("upgradeContainer")

        const upgradeName=document.createElement("p")
        const upgradeCost=document.createElement("p")
        const upgradeCPS=document.createElement("p")

        //Put the info we need in them
        upgradeName.textContent=upgrade.name
        upgradeCost.textContent=`Cost: ${upgrade.cost} cookies`
        upgradeCPS.textContent=`CPS: +${upgrade.increase}`

        //append the info to the container tag
        upgradeContainerElem.appendChild(upgradeName)
        upgradeContainerElem.appendChild(upgradeCost)
        upgradeContainerElem.appendChild(upgradeCPS)

        //Create buy button for each upgrade, and append it to DOM
        const buyButton = document.createElement("button")
        buyButton.textContent=("Buy upgrade")
        upgradeContainerElem.appendChild(buyButton)
        
        //listen for a click, if theres enough cookies buy the item, if not, alert the user.
        buyButton.addEventListener ("click", () => {
            if (cookies >= upgrade.cost) {
                cookies = cookies - upgrade.cost
                cps += upgrade.increase
                cpsDisplayElem.textContent = cps
                saveGameData() //saves game data after each upgrade is bought.
            } else {
                alert("You do not have enough cookies to buy this upgrade!")
            }           
        })       

        const shopContainerElem=document.getElementById("shop") //get the div tag with id shop
        shopContainerElem.appendChild(upgradeContainerElem) //put the div in the shop div
    })
}

//create the resetButton 
function createResetButton() {
    const resetButton = document.getElementById("resetButton")
    resetButton.addEventListener("click", () => {
        localStorage.removeItem("cookies", cookies)
        localStorage.removeItem("cps", cps)
        cookies=0
        cps=1
        cookiesElem.textContent = cookies;
        cpsDisplayElem.textContent = cps;
    })
}




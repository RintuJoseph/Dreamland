/* ****************
   * function declaration
   **************** */

function show(anchor) {
    const selectedClassName = "submenu-selected";
    if (anchor.className.indexOf(selectedClassName) != -1) {
        // the tab clicked is already selected!
        return;
    }

    const wrapper = document.querySelector(".wrapper");
    // change color as the selected tab
    wrapper.className = `wrapper ${anchor.className}`;

    // update submenu to stand out the selected tab
    let a = anchor.parentElement.firstElementChild;
    do {
        if (a == anchor) {
            a.className += ` ${selectedClassName}`;
        } else {
            a.className = a.className.replace(selectedClassName, "").trim();
        }
        a = a.nextElementSibling;
    } while (a != null);

    // show only the section of selected tab
    const targetTab = anchor.id.replace("-tab", "");
    for (let elem of document.querySelectorAll(".tab-content")) {
        elem.style.display = `${targetTab}-content` === elem.id ? "unset" : "none";
    }

    switch (targetTab) {
        case "souvenir":
            updateSouvenir();
            break;
        case "hotel":
            updateCalendar();
            break;
        case "ticket":
            break;
    }
}

function updateSouvenir() {
    for (let i = 0; i < souvenirListElem.childElementCount; i++) {
        const liElem = souvenirListElem.children[i];
        liElem.children[0].style.backgroundImage = `url(images/${souvenirImgSrc[i].imgSrc})`;
        liElem.children[1].innerHTML = `${souvenirImgSrc[i].name} @$${souvenirImgSrc[i].unitPrice}`;
        liElem.children[2].innerHTML = 
            `<span id="souvenir-add-${souvenirImgSrc[i].code}" class="material-icons-outlined md-18">`
                + "add_circle_outline"
            + "</span>"
            + `<span id="souvenir-minus-${souvenirImgSrc[i].code}" class="material-icons-outlined md-18">`
                + "remove_circle_outline"
            + "</span>";
    }
}

function updateCalendar(deltaMonth = 0) {
    const monthSpan = document.querySelector("#hotel-content > table > caption > span");

    let startDate = new Date(Date.parse(startDateElem.value));
    let endDate = new Date(Date.parse(endDateElem.value));
    
    let today = new Date();
    // to change that to a UTC date with date same as today
    today = new Date(Date.parse(`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`));

    let targetMonth = new Date(today.valueOf());
    targetMonth.setUTCDate(1);
    if (monthSpan.innerHTML !== "") {
        targetMonth = new Date(Date.parse(monthSpan.innerHTML.replace(" ", " 1, ")));
        targetMonth = new Date(Date.UTC(targetMonth.getFullYear(), targetMonth.getMonth() + deltaMonth, 1));
    }

    // update caption span
    monthSpan.innerHTML = `${targetMonth.toLocaleString('default', { month: 'long', timeZone: 'UTC' })} ${targetMonth.getUTCFullYear()}`;

    // update dates
    const tbody = document.querySelector("#hotel-content > table > tbody");
    let currDay = targetMonth.getUTCDay();
    // identify last day of the month
    targetMonth.setUTCMonth(targetMonth.getUTCMonth() + 1);
    targetMonth.setUTCDate(0);
    const lastDateCurrMonth = targetMonth.getUTCDate();
    targetMonth.setUTCDate(0);
    const lastDateLastMonth = targetMonth.getUTCDate();
    let currDate = (lastDateLastMonth - currDay) % lastDateLastMonth + 1;
    let monthNum = currDate == 1 ? 0 : -1;
    targetMonth.setUTCDate(currDate == 1 ? (targetMonth.getUTCDate() + 1) : currDate);
    const minOfDays = (startDate.valueOf() - targetMonth.valueOf())/24/60/60/1000;
    const maxOfDays = (endDate.valueOf() - targetMonth.valueOf())/24/60/60/1000;

    for (let currWeek = 0; currWeek < tbody.children.length; currWeek++) {
        for (let d = 0; d < 7; d++) {
            tbody.children[currWeek].children[d].innerHTML = currDate;
            // star booked dates
            const numOfDays = currWeek * 7 + d;
            if (numOfDays >= minOfDays && numOfDays <= maxOfDays) {
                tbody.children[currWeek].children[d].style.backgroundImage = "url(images/star.png)";
                tbody.children[currWeek].children[d].style.backgroundSize = "3vw";
                tbody.children[currWeek].children[d].style.backgroundRepeat = "no-repeat";
                tbody.children[currWeek].children[d].style.backgroundPosition = "center";
                tbody.children[currWeek].children[d].style.boxShadow = "inset 5px 5px 10px white, inset -5px -5px 10px white";
            } else {
                tbody.children[currWeek].children[d].style.backgroundImage = "none";
                tbody.children[currWeek].children[d].style.boxShadow = "none";
            }
            // dimmed it if not current month
            tbody.children[currWeek].children[d].style.backgroundColor = monthNum != 0 ? "rgba(0, 0, 0, 0.25)" : "transparent";
            // date + 1
            currDate = currDate % (monthNum < 0 ? lastDateLastMonth : lastDateCurrMonth) + 1;
            monthNum += currDate == 1 ? 1 : 0;
        }
    }

    // update hotel-charge
    const hotelChargeDaysElem = document.querySelector("#hotel-day-quantity");
    const hotelChargeTotalElem = document.querySelector("#hotel-total");
    const hotelChargeDays = maxOfDays - minOfDays + 1;
    if (isNaN(hotelChargeDays)) {
        hotelChargeDaysElem.innerHTML = "0 day";
        hotelChargeTotalElem.innerHTML = "0";
    } else {
        hotelChargeDaysElem.innerHTML = `${hotelChargeDays} day${hotelChargeDays > 1 ? "s" : ""}`;
        hotelChargeTotalElem.innerHTML = `${100 * hotelChargeDays}`;

    }
}

function checkHotelDates(allowBlank = true) {
    let startDate = new Date(Date.parse(startDateElem.value));
    let endDate = new Date(Date.parse(endDateElem.value));    
    let today = new Date();
    // to change that to a UTC date with date same as today
    today = new Date(Date.parse(`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`));

    const warning = document.querySelector("#hotel-input-problem");
    warning.innerHTML = "";

    let hasErrorStart = false;
    if (startDateElem.value.trim() === "" && !allowBlank) {
        warning.innerHTML += `${warning.innerHTML === "" ? "" : "<br>"}Please specify the start date`; 
        hasErrorStart = true;
    }
    if (startDateElem.value.trim() !== "" && isNaN(startDate)) {
        warning.innerHTML += `${warning.innerHTML === "" ? "" : "<br>"}Start date specified cannot be recognised`; 
        hasErrorStart = true;
    }
    if (startDate.valueOf() < today.valueOf()) {
        warning.innerHTML += `${warning.innerHTML === "" ? "" : "<br>"}Start date should not be earlier than today`; 
        hasErrorStart = true;
    }
    if (startDate.getUTCFullYear() > today.getUTCFullYear() + 3) {
        warning.innerHTML += `${warning.innerHTML === "" ? "" : "<br>"}Start date of almost 3 years later is not ready for booking.`;
        hasErrorStart = true;
    }
    startDateElem.style.backgroundColor = hasErrorStart ? "pink" : "white";

    let hasErrorEnd = false;
    if (endDateElem.value.trim() === "" && !allowBlank) {
        warning.innerHTML += `${warning.innerHTML === "" ? "" : "<br>"}Please specify the end date`; 
        hasErrorEnd = true;
    }
    if (endDateElem.value.trim() !== "" && isNaN(endDate)) {
        warning.innerHTML += `${warning.innerHTML === "" ? "" : "<br>"}End date specified cannot be recognised`; 
        hasErrorEnd = true;
    }
    if (endDate.valueOf() < today.valueOf()) {
        warning.innerHTML += `${warning.innerHTML === "" ? "" : "<br>"}End date should not be earlier than today`; 
        hasErrorEnd = true;
    }
    if (endDate.valueOf() < startDate.valueOf()) {
        warning.innerHTML += `${warning.innerHTML === "" ? "" : "<br>"}End date should not be earlier than start date`; 
        hasErrorEnd = true;
    }
    if (endDate.valueOf() - startDate.valueOf() > 60*24*60*60*1000) {
        warning.innerHTML += `${warning.innerHTML === "" ? "" : "<br>"}Period over 60 days is not ready for booking. Please contact our service hotline for assistance if necessary.`;
        hasErrorStart = true;
    }
    endDateElem.style.backgroundColor = hasErrorEnd ? "pink" : "white";
    
    updateCalendar(0);

    return warning.innerHTML === "";
}

function addHotelReservation() {
    if (!checkHotelDates(false)) return;

    // identifies inputs
    // already defined during start
    
    const startDate = new Date(Date.parse(startDateElem.value));
    const endDate = new Date(Date.parse(endDateElem.value));

    // prepare values for item and invoice
    const unitPrice = parseInt(hotelDayUnitPriceSpan.innerHTML);
    const quantity = (endDate.valueOf() - startDate.valueOf()) / 24 / 60 / 60 / 1000 + 1;
    const itemName = `${startDateElem.value}=${endDateElem.value}`;
    const invoiceDescription = `${startDateElem.value} to<br>${endDateElem.value}`;
    
    // add entry to invoice
    addItemAndInvoice("Hotel", "hotel-item", "h", unitPrice, quantity, itemName, invoiceDescription);

    // clear the inputs
    startDateElem.value = "";
    endDateElem.value = "";
}

function checkTicket(allowAllBlank = true) {
    // define helper function
    const getNumericValue = (x) => (isNaN(x) ? 0 : x);

    const adultTicket = parseInt(adultTicketInputElem.value);
    const childTicket = parseInt(childTicketInputElem.value);
    const adultYearPass = parseInt(adultYearPassInputElem.value);
    const childYearPass = parseInt(childYearPassInputElem.value);

    const warning = document.querySelector("#ticket-input-problem");
    warning.innerHTML = "";

    let hasError = false;
    if (adultTicket < 0 || adultTicket > 99) {
        warning.innerHTML += `${warning.innerHTML === "" ? "" : "<br>"}Adult Ticket count has to be between 0 and 99.`;
        adultTicketInputElem.style.backgroundColor = "pink"
        hasError = true;
    } else {
        adultTicketInputElem.style.backgroundColor = "white"
    }
    if (childTicket < 0 || childTicket > 99) {
        warning.innerHTML += `${warning.innerHTML === "" ? "" : "<br>"}Child Ticket count has to be between 0 and 99.`;
        childTicketInputElem.style.backgroundColor = "pink"
        hasError = true;
    } else {
        childTicketInputElem.style.backgroundColor = "white"
    }
    if (adultYearPass < 0 || adultYearPass > 99) {
        warning.innerHTML += `${warning.innerHTML === "" ? "" : "<br>"}Adult Year Pass count has to be between 0 and 99.`;
        adultYearPassInputElem.style.backgroundColor = "pink"
        hasError = true;
    } else {
        adultYearPassInputElem.style.backgroundColor = "white"
    }
    if (childYearPass < 0 || childYearPass > 99) {
        warning.innerHTML += `${warning.innerHTML === "" ? "" : "<br>"}Child Year Pass count has to be between 0 and 99.`;
        childYearPassInputElem.style.backgroundColor = "pink"
        hasError = true;
    } else {
        childYearPassInputElem.style.backgroundColor = "white"
    }

    // update ticket-charge
    let qty = 0;
    let ticketTotal = 0;
    let ticketGrandTotal = 0;

    qty = getNumericValue(adultTicket);
    ticketTotal = qty * parseInt(adultTicketUnitPriceSpan.innerHTML);
    document.querySelector("#adult-ticket-quantity").innerHTML = qty;
    document.querySelector("#adult-ticket-total").innerHTML = ticketTotal;
    ticketGrandTotal += ticketTotal;
    
    qty = getNumericValue(childTicket);
    ticketTotal = qty * parseInt(childTicketUnitPriceSpan.innerHTML);
    document.querySelector("#child-ticket-quantity").innerHTML = qty;
    document.querySelector("#child-ticket-total").innerHTML = ticketTotal;
    ticketGrandTotal += ticketTotal;
    
    qty = getNumericValue(adultYearPass);
    ticketTotal = qty * parseInt(adultYearPassUnitPriceSpan.innerHTML);
    document.querySelector("#adult-year-pass-quantity").innerHTML = qty;
    document.querySelector("#adult-year-pass-total").innerHTML = ticketTotal;
    ticketGrandTotal += ticketTotal;
    
    qty = getNumericValue(childYearPass);
    ticketTotal = qty * parseInt(childYearPassUnitPriceSpan.innerHTML);
    document.querySelector("#child-year-pass-quantity").innerHTML = qty;
    document.querySelector("#child-year-pass-total").innerHTML = ticketTotal;
    ticketGrandTotal += ticketTotal;

    document.querySelector("#ticket-grand-total").innerHTML = ticketGrandTotal;

    if (!allowAllBlank && ticketGrandTotal == 0) {
        warning.innerHTML += `${
            warning.innerHTML === "" ? "" : "<br>"
        }Unable to proceed with no ticket nor year pass to purchase.`;
        hasError = true;
    }

    return !hasError;
}

function addTicket() {
    if (!checkTicket(false)) return;

    // identifies inputs
    // already defined during start
    
    // prepare values for item and invoice
    const adultTicket = parseInt(adultTicketInputElem.value);
    const childTicket = parseInt(childTicketInputElem.value);
    const adultYearPass = parseInt(adultYearPassInputElem.value);
    const childYearPass = parseInt(childYearPassInputElem.value);
    const adultTicketUnitPrice = parseInt(adultTicketUnitPriceSpan.innerHTML);
    const childTicketUnitPrice = parseInt(childTicketUnitPriceSpan.innerHTML);
    const adultYearPassUnitPrice = parseInt(adultYearPassUnitPriceSpan.innerHTML);
    const childYearPassUnitPrice = parseInt(childYearPassUnitPriceSpan.innerHTML);

    // add entry to item and invoice
    if (!isNaN(adultTicket)) {
        addItemAndInvoice("Ticket", "ticket-item", "t", adultTicketUnitPrice, adultTicket, "AD", "Adult Ticket", true);
    }
    if (!isNaN(childTicket)) {
        addItemAndInvoice("Ticket", "ticket-item", "t", childTicketUnitPrice, childTicket, "CD", "Child Ticket", true);
    }
    if (!isNaN(adultYearPass)) {
        addItemAndInvoice("Ticket", "ticket-item", "t", adultYearPassUnitPrice, adultYearPass, "AY", "Adult Year Pass", true);
    }
    if (!isNaN(childYearPass)) {
        addItemAndInvoice("Ticket", "ticket-item", "t", childYearPassUnitPrice, childYearPass, "CY", "Child Year Pass", true);
    }

    // clear the inputs
    adultTicketInputElem.value = "";
    childTicketInputElem.value = "";
    adultYearPassInputElem.value = "";
    childYearPassInputElem.value = "";
}

function addItemAndInvoice(ulKeyword, itemClass, itemIdPrefix, unitPrice, quantity, itemName, invoiceDescription, consolidateByItemName = false) {
    // identifies invoice item
    const existingItems = document.querySelectorAll(`form .${itemClass}`);

    let itemInputElem = null;
    if (consolidateByItemName) {
        // try locate if item already added once
        for (let existingItem of document.querySelectorAll(`.${itemClass}`)) {
            if (existingItem.value.indexOf(`${itemName}$${unitPrice}x`) == 0) {
                itemInputElem = existingItem;
                break;
            }
        }
    }

    if (itemInputElem) {
        const removeButtonElem = document.querySelector(`#remove-${itemInputElem.id}`);

        // determine new quantity
        const newQty = quantity + parseInt(
            itemInputElem.value.substr(`${itemName}$${unitPrice}x`.length)
        );

        if (newQty == 0) {
            // remove item!
            removeButtonElem.click();
            // exit as if control has passed to removeButtonElem.click();
            return;
        }
        
        // update quantity of existing item
        itemInputElem.value = `${itemName}$${unitPrice}x${newQty}`;

        // update invoice entry with new quantity and total
        removeButtonElem.previousSibling.textContent = `${unitPrice * newQty}`;
        removeButtonElem.parentElement.previousSibling.textContent = `@$${unitPrice} x${newQty}`;

        // update total
        invoice.lastElementChild.innerHTML = parseInt(invoice.lastElementChild.innerHTML) + unitPrice * quantity;
        form["checkout"].disabled = false;
    } else if (quantity > 0) {
        // add entry to form
        itemInputElem = document.createElement("input");
        itemInputElem.type = "hidden";
        itemInputElem.id = `item-${itemIdPrefix}${existingItems.length}`;
        itemInputElem.name = `item-${itemIdPrefix}${existingItems.length}`;
        itemInputElem.className = itemClass;
        itemInputElem.value = `${itemName}$${unitPrice}x${quantity}`;
        form.appendChild(itemInputElem);
        
        // identifies list for this keyword
        let targetList;
        for (targetList of document.querySelectorAll("#shopping-content > ul")) {
            if (targetList.previousSibling.textContent.trim() === `${ulKeyword}:`) break;
            targetList = null;
        }
        if (targetList == null) {
            // add the ul for the keyword
            targetList = document.createElement("ul");
            invoice.insertBefore(document.createTextNode(`${ulKeyword}:`), invoice.lastElementChild.previousSibling);
            invoice.insertBefore(targetList, invoice.lastElementChild.previousSibling);
            invoice.insertBefore(document.createElement("br"), invoice.lastElementChild.previousSibling);
        }

        // add li to list
        let newItemLiElem = document.createElement("li");
        newItemLiElem.innerHTML = 
            `${invoiceDescription}<br>`
            + `@$${unitPrice} x${quantity}`
            + '<div class="float-right">'
                + `${unitPrice * quantity}`
                + `<button id="remove-${itemInputElem.id}" class="remove-item">`
                    + '<span class="material-icons-outlined md-18">'
                        + "remove_circle"
                    + "</span>"
                + "</button>"
            + "</div>";
        targetList.appendChild(newItemLiElem);

        // update total
        invoice.lastElementChild.innerHTML = parseInt(invoice.lastElementChild.innerHTML) + unitPrice * quantity;
        form["checkout"].disabled = false;
    }
}



/* ***********************************
   *
   *
   * start execution from here onwards
   * 
   * 
   *********************************** */

window.addEventListener("load", () => {
    // initialize screen for current tab as souvenir tabe
    show(document.querySelector(".submenu > .souvenir-background"));
})

const form = document.querySelector("form");
const invoice = document.querySelector("#shopping-content");
// for souvenir
const souvenirListElem = document.querySelector("ul#souvenir-list");
// for hotel
const startDateElem = document.querySelector("#start-date");
const endDateElem = document.querySelector("#end-date");
const hotelDayUnitPriceSpan = document.querySelector("#hotel-unit-price");
// for ticket
const adultTicketInputElem = document.querySelector("#adult-ticket");
const childTicketInputElem = document.querySelector("#child-ticket");
const adultYearPassInputElem = document.querySelector("#adult-year-pass");
const childYearPassInputElem = document.querySelector("#child-year-pass");
const adultTicketUnitPriceSpan = document.querySelector("#adult-ticket-unit-price");
const childTicketUnitPriceSpan = document.querySelector("#child-ticket-unit-price");
const adultYearPassUnitPriceSpan = document.querySelector("#adult-year-pass-unit-price");
const childYearPassUnitPriceSpan = document.querySelector("#child-year-pass-unit-price");

// remove invoice entry function
invoice.addEventListener("click", (event) => {
    if (event.target.className === "remove-item" || event.target.innerHTML.trim() === "remove_circle") {
        // identify the li
        const buttonClicked = event.target.className === "remove-item" 
            ? event.target
            : event.target.parentElement; 
        const liToBeDelete = buttonClicked.parentElement.parentElement;
        const ulElem = liToBeDelete.parentElement;
        // remove hidden input item in form
        form.removeChild(form[buttonClicked.id.substr("remove-".length)]);
        // identify the amount to be deduct
        const deductAmount = parseInt(liToBeDelete.lastElementChild.firstChild.textContent.trim());
        // remove the li
        ulElem.removeChild(liToBeDelete);
        // check if ul still has li
        if (ulElem.childElementCount == 0) {
            // remove next element sibling, ie, br 
            ulElem.parentElement.removeChild(ulElem.nextElementSibling);
            // remove previous sibling, ie, the text node with ul keyword
            ulElem.parentElement.removeChild(ulElem.previousSibling);
            // remove the ul
            ulElem.parentElement.removeChild(ulElem);
        }
        // update total
        invoice.lastElementChild.innerHTML = parseInt(invoice.lastElementChild.innerHTML) - deductAmount;

        form["checkout"].disabled = form.length == 1;
    }
});

// add/remove souvenir to/from invoice
souvenirListElem.addEventListener("click", (event) => {
    let souvenirCode = null;
    let actionClicked = null;
    let isAdd = true;
    if (event.target.id.indexOf("souvenir-add-") == 0) {
        // add
        actionClicked = event.target;
        souvenirCode = event.target.id.substr("souvenir-add-".length);
    } else if (event.target.id.indexOf("souvenir-minus-") == 0) {
        // minus
        actionClicked = event.target;
        souvenirCode = event.target.id.substr("souvenir-minus-".length);
        isAdd = false;
    } else {
        return;
    }

    const nameUnitPriceSeparationIndex = actionClicked.parentElement.previousElementSibling.innerHTML.lastIndexOf(" @$");
    const souvenirName = actionClicked.parentElement.previousElementSibling.innerHTML
        .substr(0, nameUnitPriceSeparationIndex).trim();
    const souvenirUnitPrice = parseInt(
        actionClicked.parentElement.previousElementSibling.innerHTML
        .substr(nameUnitPriceSeparationIndex+3).trim()
    );

    addItemAndInvoice("Souvenir", "souvenir-item", "s", souvenirUnitPrice, isAdd ? 1 : -1, souvenirCode, souvenirName, true);
})
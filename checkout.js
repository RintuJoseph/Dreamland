const queryString = document.location.href.substring(document.location.href.indexOf("?")+1);
let total = 0;
const requestJSON = queryString.split("&").reduce((acc, data) => {
    const dataPair = data.split("=");
    const key = decodeURIComponent(dataPair[0]);
    const value = decodeURIComponent(dataPair[1]);

    // key must be item-?# where ? is S, H or T
    if (key.indexOf("item-") != 0) return acc;

    // value must be name$#x## where # is unit price and ## is qty
    const obj = {
        name: value.substring(0, value.lastIndexOf("$")),
        unitPrice: parseInt(value.substring(value.lastIndexOf("$") + 1, value.lastIndexOf("x"))),
        qty: parseInt(value.substring(value.lastIndexOf("x")+1))
    };

    // push obj to suitable array
    const mapper = { s: "souvenir", h: "hotel", t: "ticket" };
    if (mapper[key.charAt(5)])
        acc[mapper[key.charAt(5)]].push(obj);

    total += obj.unitPrice * obj.qty;

    return acc;
}, {souvenir:[], hotel:[], ticket:[]});

const itemsDiv = document.querySelector("#items");


let itemsContent = "";
if (requestJSON.souvenir.length > 0) {
    // souvenir: <code>
    itemsContent += `Souvenir(s) as follows:<ul>${
        requestJSON.souvenir.reduce((acc, curr) => 
            `${acc}<li>${curr.qty} ${
                souvenirImgSrc.find((x) => x.code === curr.name).name
            } (item code: ${curr.name}) for $${curr.unitPrice} each, ie, $${curr.unitPrice * curr.qty}</li>`
        , "")
    }</ul><br>`;
} else {
    document.querySelector("#souvenir").style.display = "none";
}

if (requestJSON.hotel.length > 0) {
    // hotel: <from date>=<to date>
    itemsContent += `Hotel room(s) as follows:<ul>${
        requestJSON.hotel.reduce((acc, curr) => 
            `${acc}<li>${curr.qty} day(s) from ${curr.name.substring(0, curr.name.indexOf("="))} to ${curr.name.substring(curr.name.indexOf("=")+1)} for $${curr.unitPrice} each day, ie, $${curr.unitPrice * curr.qty}</li>`
        , "")
    }</ul><br>`;
} else {
    document.querySelector("#hotel").style.display = "none";
}

if (requestJSON.ticket.length > 0) {
    // ticket: <A/C><D/Y>
    itemsContent += `Ticket(s) as follows:<ul>${
        requestJSON.ticket.reduce((acc, curr) => 
            `${acc}<li>${curr.qty} ${curr.name.charAt(0) === "A" ? "Adult" : "Child"} ${curr.name.charAt(1) === "D" ? "Ticket" : "Year Pass"} for $${curr.unitPrice} each, ie, $${curr.unitPrice * curr.qty}</li>`
        , "")
    }</ul><br>`;
} else {
    document.querySelector("#ticket").style.display = "none";
}



itemsDiv.innerHTML = `${itemsContent}Total $${total}`;
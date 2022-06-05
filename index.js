function headerOpacityControl() {
    const headerBanner = document.getElementById("header-banner");
    if (window.innerWidth <= 450) {
        // no opacity animation and let @media to manage it
        headerBanner.style.opacity = 1;
        return;
    }

    const container = document.querySelector(".container");
    const header = document.getElementsByTagName("header")[0];
    const headerBillboard = document.getElementById("header-billboard");

    const scrollTop = container.scrollTop;

    // event.target.scrollTop: 0 to 400 => 0 to 1
    headerBillboard.style.opacity = scrollTop >= 100 ? 0 : (1 - scrollTop / 100);
    headerBanner.style.opacity = scrollTop >= 150 ? 1 : scrollTop / 150;
    header.style.zIndex = headerBillboard.style.opacity == 0 ? 20 : 5;
}

function castlePositionControl() {
    // parameter of castle from the png
    const castleWidth = 2649;
    const castleHeight = 5723;
    const castleDoorWidth = 920;
    const castleDoorRightEdge = 1625; // castle door right edge at 1625 px from left

    const castle = document.querySelector("#castle");

    const clearLayer = document.querySelectorAll(".clear-layer");
    const expectedHeight = clearLayer[clearLayer.length-1].offsetTop + clearLayer[clearLayer.length-1].scrollHeight;
    const screenWidth = clearLayer[0].scrollWidth;

    //castle.style.top = 200;
    castle.height = expectedHeight - 200;
    let ratio = (expectedHeight - 200) / castleHeight;

    if (screenWidth >= 2000) {
        castle.style.left = `${(screenWidth - 2000)/2 + 2000 - ratio * (castleDoorRightEdge)}px`;
    } else if (screenWidth > ratio * castleDoorWidth) {
        // screen width > width of castle door
        castle.style.left = `${screenWidth - ratio * (castleDoorRightEdge)}px`;
    } else {
        // screen width <= width of castle door
        castle.style.left = `${screenWidth/2 - ratio * (castleDoorRightEdge - castleDoorWidth/2)}px`;
    }
}

function backgroundControl() {
    const cloudsVerticalMirrorWidth = 554;
    const container = document.querySelector(".container");
    console.log(container.style.backgroundSize);
    if (container.scrollWidth <= cloudsVerticalMirrorWidth) {
        container.style.backgroundSize = "contain";
    } else {
        container.style.backgroundSize = "cover";
    }
}

function updateLook(event) {  
    headerOpacityControl();
    castlePositionControl();
    backgroundControl();
}

window.addEventListener('resize', updateLook);
window.addEventListener('load', updateLook);
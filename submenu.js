const subNavs = document.querySelectorAll(".sub-nav");
for (let currSubNav of subNavs) {
    // let handler = null;
    currSubNav.parentElement.parentElement.addEventListener("click", (event) => {
        console.log(`subNav ${currSubNav.parentElement.previousSibling.textContent.trim()} onclick triggered`);
        // if (handler != null) {
        //     clearInterval(handler);
        //     handler = null;
        //     subNav.style.opacity = 1;
        // }
        for (let subNav of subNavs) {
            if (subNav == currSubNav) {
                subNav.style.display = subNav.style.display === "flex" ? "none" : "flex";
            } else {
                subNav.style.display = "none";
            }
        }
        event.stopPropagation();
    });
    // subNav.parentElement.parentElement.addEventListener("mouseleave", (event) => {
    //     handler = setInterval(() => {
    //         // subNav.style.display = "none";
    //         // handler = null;
    //         let currOpacity = parseFloat(subNav.style.opacity === "" ? 1 : subNav.style.opacity);
    //         subNav.style.opacity = currOpacity - 0.1;
    //         if (currOpacity - 0.1 < 0.1) {
    //             subNav.style.display = "none";
    //             clearInterval(handler);
    //             handler = null;
    //             subNav.style.opacity = 1;
    //         }
    //     }, 100);
    // });
}

window.addEventListener("click", (event) => {
    console.log("window onclick triggered");
    for (let subNav of subNavs) {
        if (subNav.style.display === "flex" && event.target != subNav) {
            console.log(`close subNav ${subNav.parentElement.previousSibling.textContent.trim()}`);
            subNav.style.display = "none";
        }
    }
})
let colorArray=[
  "#FF1493", "#0000FF", "#00FF7F", "#00BFFF", "#7FFFD4", "#FF4500",
  "#DC143C", "#FFFF00",
];

colortext=document.getElementById("colorChange");
  let changeColor=setInterval(()=>{
   
    let rand=Math.floor(Math.random()*colorArray.length);
    console.log(rand);
    colortext.style.color=colorArray[rand];
    
  },1000);


function openContent(evt, contentTab) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(contentTab).style.display = "block";
    evt.currentTarget.className += " active";
  }

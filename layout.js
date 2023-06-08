var cc = document.getElementById("carouselDarkVariant")
var W = window.innerWidth
var H = window.innerHeight
var jsondata;
var ii=0

function preload(){
  jsondata=loadJSON('json/data.json')
}
function setup(){
  jsondata.data.forEach((p)=>{
    // console.log(p)
    if (p.type=='L'||p.type=='R'){
      addCarouselItem(ii,p.img,p.nameEN,p.topicEN,p.descEN)
      ii+=1
    }
  })
  
}

function draw(){
  if (cc.offsetHeight){
    if (W>cc.offsetWidth){
      cc.style.height = H*0.8
      cc.style.width = 'auto'
      cc.style.top=H*0.5-cc.offsetHeight*0.5+'px'
    }else{
      cc.style.top=H*0.5-cc.offsetHeight*0.5+'px'
    }
    
  }
}
function aboutclick(){
  cc.style.display='none'
}
function teamsclick(){
  console.log(cc.style.display)
  cc.style.display=''
}

function addCarouselItem(item,url,name='name',topic='topic',desc='desc'){
  let ne = document.createElement('div')
  ne.classList.add("carousel-item","hover-overlay","ripple", "shadow-5");
  if (item==0) ne.classList.add("active");
  ne.id = 'carsoule_'+item
    let nmask = document.createElement('div');
    nmask.classList.add("mask");
    nmask.style.background = 'linear-gradient(45deg, hsla(168, 85%, 52%, 0.7), hsla(263, 88%, 45%, 0.7) 100%)';
    
  
  ne.innerHTML = '<img src="'+url+'" class="d-block w-100" alt="name"/>'+
                   '<div class="mask" style=" background: linear-gradient( 45deg, hsla(168, 85%, 52%, 0.7),hsla(263, 88%, 45%, 0.7) 100%);">'+
                    '<div class="row d-flex justify-content-center align-items-center flex-column h-100 text-white">'+
                      '<div class="col-2"></div>'+
                      '<div class="col-8">'+
                          '<div class="row d-flex fs-4 fw-bold justify-content-center align-items-center">'+topic+'</div>'+
                          '<div class="row d-flex fs-5 justify-content-center align-items-center">'+name+'</div>'+
                          '<div class="row d-flex fs-6 fw-light justify-content-center align-items-center">'+desc+'</div>'+
                      '</div>'+
                    '</div>'+
                 '</div>';
  

  // 置入 點擊後事件
  ne.addEventListener('click', (e)=>{
    window.open('https://mediaplusarchi.github.io/cfrlab/', '_blank');
  });
  let eparent = document.getElementsByClassName('carousel-inner')
  eparent[0].appendChild(ne)
}

// Resize
window.addEventListener("resize", ()=> {
    W = window.innerWidth
    H = window.innerHeight
    
    cc.style.top=H*0.5-cc.offsetHeight*0.5+'px'
    
});
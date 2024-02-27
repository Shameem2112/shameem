 var tl = gsap.timeline()
 tl.from("#intro h1, #place h3, #nav h3,#place h2",{
     y:-100,
    duration:1.5,
    delay:1,
    opacity:0,
    stagger:0.5,



})
tl.from("#hero-img",{
    scale:0,
    opacity:0,
    duration:1.5,
})
tl.to("#place h2",{
    y:40,
    repeat:-1,
    duration:1,
    yoyo:true,

})

var tl = gsap.timeline()

tl.from("#nav h3, #intro h4, #intro h1, #hero-content p, #place", {
    y: -50,
    duration: 1,
    delay: 0.5,
    opacity: 0,
    stagger: 0.2
})

tl.from("#hero-img", {
    scale: 0,
    opacity: 0,
    duration: 1,
    ease: "back.out(1.7)"
})

tl.to("#place h2", {
    y: 10,
    repeat: -1,
    duration: 1,
    yoyo: true
})

gsap.from("#technical h3", {
    x: -20,
    repeat: -1,
    duration: 1.5,
    yoyo: true
})

gsap.from("#education h3", {
    x: -20,
    repeat: -1,
    duration: 1.5,
    yoyo: true
})

// Additional animations for the new design
gsap.from(".work-item", {
    scrollTrigger: {
        trigger: ".work-item",
        start: "top 85%",
        end: "bottom 60%",
        toggleActions: "play none none none"
    },
    opacity: 0,
    y: 50,
    stagger: 0.2,
    duration: 1
})

gsap.from(".education-item", {
    scrollTrigger: {
        trigger: ".education-item",
        start: "top 85%",
        end: "bottom 60%",
        toggleActions: "play none none none"
    },
    opacity: 0,
    y: 30,
    stagger: 0.2,
    duration: 1
})
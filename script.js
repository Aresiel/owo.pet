let animals = ['🐱', '🐶', '🐯', '🐰', '🐹', '🦁', '🦊', '🐻‍❄️']

document.getElementById("paw_button").addEventListener("click", e => {

    let projectile = document.createElement("div");
    projectile.innerHTML = animals[Math.floor(Math.random()*animals.length)]
    projectile.classList.add("projectile")

    document.body.append(projectile)

    let angle = Math.random()*2*Math.PI
    let lifespan = 1+Math.random()*2
    let inv_speed = 30 + Math.random()*0.4

    let x_offset = Math.cos(angle)
    let y_offset = Math.sin(angle)
    
    //transition: transform 0.1s ease-in;
    projectile.style.setProperty("transition", `transform ${inv_speed}s ease-in, opacity ${lifespan}s ease-in`)
    projectile.style.setProperty("transform", `translate(${x_offset*2}rem, ${y_offset*2}rem)`)

    setTimeout(() => {
        projectile.style.setProperty("transform", `translate(${x_offset*10000}rem, ${y_offset*10000}rem)`)
        projectile.style.setProperty("opacity", "0")
    }, 10)

    setTimeout(() => {
        projectile.remove()
    }, lifespan*1000)
})
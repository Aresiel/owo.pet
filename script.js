'use strict';

let count = BigInt(localStorage.getItem('count') ?? 1);
let volume = +(localStorage.getItem('volume_slider') ?? 7.5);

const animals = ['🐱', '🐶', '🐯', '🐰', '🐹', '🦁', '🦊', '🐻‍❄️']

const paw_button = document.getElementById('paw_button');
const count_display = document.getElementById('count_display');
const sound_effect = document.getElementById('sound_effect');
const volume_slider = document.getElementById('volume_slider');
const reset_button = document.getElementById('reset_button');

const audioContext = new AudioContext();

function setCount(new_count) {
    count = new_count;
    localStorage.setItem('count', count);
    count_display.innerText = count > 0 ? count : '';
    reset_button.style.display = count > 0 ? 'block' : 'none';
}

function setVolume(new_volume) {
    if(new_volume < 0 || new_volume > 75) {
        throw new Error('Volume must be between 0 and 75');
    }
    volume = new_volume;
    localStorage.setItem('volume_slider', volume);
    volume_slider.value = volume;
    console.log(volume);
}

setCount(count);
setVolume(volume);

paw_button.addEventListener("click", e => {

    // Spawn projectile
    let projectile = document.createElement("div");
    projectile.innerHTML = animals[Math.floor(Math.random()*animals.length)]
    projectile.classList.add("projectile")

    paw_button.parentElement.append(projectile)

    let angle = Math.random()*2*Math.PI
    let lifespan = 1+Math.random()*2
    let inv_speed = 30 + Math.random()*0.4

    let x_offset = Math.cos(angle)
    let y_offset = Math.sin(angle)
    
    //transition: transform 0.1s ease-in;
    projectile.style.transition = `transform ${inv_speed}s ease-in, opacity ${lifespan}s ease-in`
    projectile.style.transform = `translate(${x_offset*2}rem, ${y_offset*2}rem)`

    setTimeout(() => {
        projectile.style.transform = `translate(${x_offset*10000}rem, ${y_offset*10000}rem)`
        projectile.style.opacity = "0"
    }, 10)

    setTimeout(() => {
        projectile.remove()
    }, lifespan*1000)

    // Increment and display count
    setCount(count + 1n);

    // Play sound
    let track = audioContext.createMediaElementSource(sound_effect);
    track.connect(audioContext.destination);
    sound_effect.currentTime = 0;
    let volume_slider_value = volume_slider.value / 100;
    sound_effect.volume = volume_slider_value + Math.random() * volume_slider_value/3;
    sound_effect.play();
})

reset_button.addEventListener("click", e => {
    setCount(0n);
})

volume_slider.addEventListener("change", e => {
    setVolume(+volume_slider.value);
})
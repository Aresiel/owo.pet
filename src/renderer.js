// @ts-check

/**
 * Drawn an image to a canvas 2d context
 * @param ctx {CanvasRenderingContext2D}
 * @param image {HTMLImageElement}
 * @param x {number}
 * @param y {number}
 * @param scale {number}
 */
function drawnImage(ctx, image, x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale / 2, scale / 2);
    ctx.drawImage(
        image,
        -image.width / 2,
        -image.height / 2,
        image.width,
        image.height,
    );
    ctx.restore();
}

/**
 * @param min {number}
 * @param max {number}
 * @return {number}
 */
function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * @param min {number}
 * @param max {number}
 * @return {number}
 */
function randomInt(min, max) {
    return Math.floor(randomFloat(min, max));
}

class Projectile {
    constructor() {
        // everything is initialized on init method not here but we still assign everything to something here
        // to both make the language server happy and because JS engines don't like objects changing in shape
        // so by initializing everything in the constructor they won't change in shape

        // ugly hack to give proper typings to the image
        // cant cast undefined to HTMLImageElement but can cast HTMLElement to it
        this.image = /** @type {HTMLImageElement} */ (document.body);
        this.active = false;

        this.angle = 0;

        this.x = 0;
        this.y = 0;
        this.xDir = 0;
        this.yDir = 0;
        this.speed = 0;

        this.alpha = 0;
        this.alphaFade = 0;
    }

    /**
     * Actual initialization of a projectile
     * Since projectiles can be reused to make the GC happy
     * we need to initialize somewhere else that can be done multiple times so not the constructor
     * @param image {HTMLImageElement}
     */
    init(image) {
        this.image = image;

        this.active = true;

        this.angle = randomFloat(0, Math.PI * 2);

        this.x = 0;
        this.y = 0;
        this.xDir = Math.cos(this.angle);
        this.yDir = Math.sin(this.angle);

        this.speed = randomFloat(400, 1500);

        this.alpha = 1;
        this.alphaFade = randomFloat(1, 1.2);
    }

    /**
     * @param deltaTime {number} Time elapsed in seconds since last frame
     * @param ctx {CanvasRenderingContext2D}
     */
    render(deltaTime, ctx) {
        // update physics
        const multiplier = deltaTime * this.speed / window.devicePixelRatio
        this.x += this.xDir * multiplier;
        this.y += this.yDir * multiplier;

        this.speed = this.speed * 1 / (1 + deltaTime * 2);

        this.alpha -= deltaTime * this.alphaFade;
        // Math.max has performance issues on v8
        // so use ternary instead
        this.alpha = this.alpha < 0 ? 0 : this.alpha;

        if (this.alpha <= 0) {
            this.active = false;
        }

        // render to canvas
        ctx.save();
        ctx.globalAlpha = this.alpha;
        drawnImage(
            ctx,
            this.image,
            this.x,
            this.y,
            0.2 / window.devicePixelRatio,
        );
        ctx.restore();
    }
}

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas"));

// make the canvas always be fullscreen
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext("2d"));

/**
 * Pool of projectiles
 * Since resizing arrays and creating new objects is slow
 * We avoid this by only deleting dead projectiles from the array
 * When it gets really big
 * @type {Projectile[]}
 */
let projectiles = [];

let now = Date.now();
function render() {
    window.requestAnimationFrame(render);

    const nNow = Date.now();
    const deltaTime = (nNow - now) / 1000;
    now = nNow;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    // translate the canvas so all drawings are relative to screen center
    ctx.translate(canvas.width / 2, canvas.height / 2);
    // scale to the device pixel ratio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    let aliveCount = 0;
    // render active projectiles
    // `for (const item of array)` loops are way slower!
    // so we use regular good old ones ;)
    for (let i = 0; i < projectiles.length; i++) {
        const projectile = projectiles[i];
        if (projectile.active) {
            projectile.render(deltaTime, ctx);
            aliveCount++;
        }
    }

    // clear the projectile pool if needed
    if (projectiles.length > 128 && aliveCount < projectiles.length / 2) {
        projectiles = projectiles.filter((p) => {
            return p.active;
        });
    }
    ctx.restore();
}

window.requestAnimationFrame(render);

/** @param images {HTMLImageElement[]} */
export function addProjectile(images) {

    /** @type {Projectile | undefined} */
    let projectile = undefined;

    // try to find an inactive one in the pool
    for (let i = 0; i < projectiles.length; i++) {
        if (!projectiles[i].active) {
            projectile = projectiles[i];
            break;
        }
    }

    // if theres no free projectile in the pool create a new one
    if (!projectile) {
        projectile = new Projectile();
        projectiles.push(projectile);
    }

    projectile.init(images[randomInt(0, images.length)]);
}

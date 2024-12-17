// @ts-check

/** @param emojis {string[]} */
export async function getImageCache(emojis) {
    // cache of emoji images to avoid drawing text every frame

    /** @type {HTMLImageElement[]} */
    const cache = [];

    const canvasOptions = /** @type {ElementCreationOptions} */ ({
        willReadFrequently: true,
    });

    // temporary canvas to render the emojis to
    const canvas = /** @type {HTMLCanvasElement} */ (document.createElement("canvas", canvasOptions));
    const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext("2d"));

    canvas.width = 512;
    canvas.height = 512;

    ctx.font = "300px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (const emoji of emojis) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillText(emoji, canvas.width / 2, canvas.height / 2);

        // i hate promises...
        const blob = await (new Promise((resolve) => {
            canvas.toBlob((img) => {
                resolve(img);
            }, "image/png");
        }));

        const image = document.createElement("img");
        image.src = URL.createObjectURL(blob);

        cache.push(image);
    }

    return cache;
}

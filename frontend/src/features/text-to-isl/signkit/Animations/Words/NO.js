export const NO = (ref) => {
    let animations = [];

    // Shake Left
    animations = [];
    animations.push(["mixamorigNeck", "rotation", "y", Math.PI / 4, "+"]);
    ref.animations.push(animations);

    // Shake Right
    animations = [];
    animations.push(["mixamorigNeck", "rotation", "y", -Math.PI / 4, "-"]);
    ref.animations.push(animations);

    // Shake Left
    animations = [];
    animations.push(["mixamorigNeck", "rotation", "y", Math.PI / 4, "+"]);
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigNeck", "rotation", "y", 0, "-"]);
    ref.animations.push(animations);

    if (ref.pending === false) {
        ref.pending = true;
        ref.animate();
    }
}

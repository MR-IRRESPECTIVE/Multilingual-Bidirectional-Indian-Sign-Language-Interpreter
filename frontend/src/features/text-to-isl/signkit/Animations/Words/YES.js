export const YES = (ref) => {
    let animations = [];

    // Nod Down
    animations = [];
    animations.push(["mixamorigNeck", "rotation", "x", Math.PI / 4, "+"]);
    ref.animations.push(animations);

    // Nod Up (Neutral)
    animations = [];
    animations.push(["mixamorigNeck", "rotation", "x", 0, "-"]);
    ref.animations.push(animations);

    // Nod Down again
    animations = [];
    animations.push(["mixamorigNeck", "rotation", "x", Math.PI / 4, "+"]);
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigNeck", "rotation", "x", Math.PI / 12, "-"]); // Reset to default pose (approx)
    ref.animations.push(animations);

    if (ref.pending === false) {
        ref.pending = true;
        ref.animate();
    }
}

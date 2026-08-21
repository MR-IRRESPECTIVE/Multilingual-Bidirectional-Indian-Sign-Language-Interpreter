export const PLEASE = (ref) => {
    let animations = [];

    // Step 1: Move right hand to chest
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 4, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "y", -Math.PI / 6, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "y", Math.PI / 4, "-"]);
    ref.animations.push(animations);

    // Step 2: Circular motion (Up-Right)
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 3, "-"]);
    ref.animations.push(animations);

    // Step 3: Circular motion (Down-Left)
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 4, "+"]);
    ref.animations.push(animations);

    // Step 4: Reset
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "y", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "y", Math.PI / 1.5, "+"]);
    ref.animations.push(animations);

    if (ref.pending === false) {
        ref.pending = true;
        ref.animate();
    }
}

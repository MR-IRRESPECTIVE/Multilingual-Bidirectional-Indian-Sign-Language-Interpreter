export const THANKYOU = (ref) => {
    let animations = [];

    // Step 1: Touch chin with right fingertips
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 3, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "y", Math.PI / 4, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 2, "+"]);
    ref.animations.push(animations);

    // Step 2: Move hand out and down away from face
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 6, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 3, "-"]);
    ref.animations.push(animations);

    // Step 3: Reset
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "y", Math.PI / 1.5, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    ref.animations.push(animations);

    if (ref.pending === false) {
        ref.pending = true;
        ref.animate();
    }
}

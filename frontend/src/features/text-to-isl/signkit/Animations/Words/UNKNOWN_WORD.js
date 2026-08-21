export const UNKNOWN_WORD = (ref) => {
    let animations = [];

    // Simple generic forward-leaning gesture with palms slightly open
    // This indicates "some word" without fingerspelling it
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 6, "-"]);
    animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI / 6, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "y", Math.PI / 3, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "y", -Math.PI / 3, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "x", Math.PI / 8, "+"]);
    animations.push(["mixamorigLeftHand", "rotation", "x", Math.PI / 8, "+"]);
    ref.animations.push(animations);

    // Hold and reset
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigLeftArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI / 3, "+"]);
    animations.push(["mixamorigLeftArm", "rotation", "z", -Math.PI / 3, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "y", Math.PI / 1.5, "+"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "y", -Math.PI / 1.5, "-"]);
    ref.animations.push(animations);

    if (ref.pending === false) {
        ref.pending = true;
        ref.animate();
    }
}

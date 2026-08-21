export const GENERIC = (ref) => {
    let animations = [];

    // Simple open-palm gesture (both hands move slightly forward)
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 6, "-"]);
    animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI / 6, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 6, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", -Math.PI / 6, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "x", -Math.PI / 4, "-"]);
    animations.push(["mixamorigLeftHand", "rotation", "x", -Math.PI / 4, "-"]);
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigLeftArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigLeftHand", "rotation", "x", 0, "+"]);
    ref.animations.push(animations);

    if (ref.pending === false) {
        ref.pending = true;
        ref.animate();
    }
}

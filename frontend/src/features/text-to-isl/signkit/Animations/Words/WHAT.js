export const WHAT = (ref) => {
    let animations = [];

    // STEP 1: Raise hands and tilt palms up
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 3, "-"]);
    animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI / 3, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI / 6, "-"]);
    animations.push(["mixamorigLeftArm", "rotation", "z", -Math.PI / 6, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "x", Math.PI / 4, "+"]);
    animations.push(["mixamorigLeftHand", "rotation", "x", Math.PI / 4, "+"]);
    ref.animations.push(animations);

    // STEP 2: Slight outward movement (The "What" gesture)
    animations = [];
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 8, "+"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", -Math.PI / 8, "-"]);
    ref.animations.push(animations);

    // STEP 3: Reset to EXACT Default Pose
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigLeftArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI / 3, "+"]);
    animations.push(["mixamorigLeftArm", "rotation", "z", -Math.PI / 3, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "y", Math.PI / 1.5, "+"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "y", -Math.PI / 1.5, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "x", 0, "-"]);
    animations.push(["mixamorigLeftHand", "rotation", "x", 0, "-"]);
    ref.animations.push(animations);

    if (ref.pending === false) {
        ref.pending = true;
        ref.animate();
    }
}

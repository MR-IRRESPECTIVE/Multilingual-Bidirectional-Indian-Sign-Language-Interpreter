export const SORRY = (ref) => {
    let animations = [];

    // Step 1: Raise right fist to chest
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 4, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "y", Math.PI / 4, "-"]);
    // Fist (curl all fingers)
    animations.push(["mixamorigRightHandThumb1", "rotation", "z", Math.PI / 2, "+"]);
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", Math.PI / 2, "+"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", Math.PI / 2, "+"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", Math.PI / 2, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", Math.PI / 2, "+"]);
    ref.animations.push(animations);

    // Step 2: Small circular motion
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI / 20, "+"]);
    ref.animations.push(animations);

    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "z", 0, "-"]);
    ref.animations.push(animations);

    // Step 3: Reset
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "y", Math.PI / 1.5, "+"]);
    // Uncurl fingers
    animations.push(["mixamorigRightHandThumb1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "-"]);
    ref.animations.push(animations);

    if (ref.pending === false) {
        ref.pending = true;
        ref.animate();
    }
}

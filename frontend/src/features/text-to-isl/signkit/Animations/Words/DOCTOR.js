export const DOCTOR = (ref) => {
    let animations = [];

    // Step 1: Raise both arms (Preparation)
    animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI / 4, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", -Math.PI / 6, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 3, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 6, "+"]);
    ref.animations.push(animations);

    // Step 2: The "Pulse Tap" (Action)
    animations = [];
    animations.push(["mixamorigRightForeArm", "rotation", "x", Math.PI / 10, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "z", -Math.PI / 8, "-"]);
    ref.animations.push(animations);

    // Step 3: RETURN TO DEFAULT POSE (Reset)
    animations = [];
    // 1. Reset all modified axes to 0 if they're not part of default pose
    animations.push(["mixamorigLeftArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "x", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "z", 0, "+"]);

    // 2. Set all default pose values (Source: defaultPose.js)
    animations.push(["mixamorigNeck", "rotation", "x", Math.PI / 12, "+"]);
    animations.push(["mixamorigLeftArm", "rotation", "z", -Math.PI / 3, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "y", -Math.PI / 1.5, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI / 3, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "y", Math.PI / 1.5, "+"]);

    ref.animations.push(animations);

    if (ref.pending === false) {
        ref.pending = true;
        ref.animate();
    }
}

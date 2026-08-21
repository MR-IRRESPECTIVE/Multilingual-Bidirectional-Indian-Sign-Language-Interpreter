export const THINK = (ref) => {
    let animations = [];

    // Step 1: Lift right arm and point index finger (Preparation)
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2.5, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI / 10, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 4, "+"]);

    // Finger pointing (Right Index)
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", Math.PI / 2, "+"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", Math.PI / 2, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", Math.PI / 2, "+"]);
    ref.animations.push(animations);

    // Step 2: Touch temple (Action)
    animations = [];
    animations.push(["mixamorigRightForeArm", "rotation", "y", Math.PI / 4, "+"]);
    animations.push(["mixamorigHead", "rotation", "y", Math.PI / 12, "+"]);
    ref.animations.push(animations);

    // Step 3: Hold for a moment
    animations = [];
    animations.push(["mixamorigRightHand", "rotation", "x", Math.PI / 20, "+"]);
    ref.animations.push(animations);

    // Step 4: RETURN TO DEFAULT POSE (Reset)
    animations = [];
    // 1. Reset all modified axes to 0 if they're not part of default pose
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "z", 0, "-"]); // Explicitly reset this before default pose override
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "x", 0, "-"]);
    animations.push(["mixamorigHead", "rotation", "y", 0, "-"]);

    // Reset fingers
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "-"]);

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

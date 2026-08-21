export const NAME = (ref) => {
    let animations = [];

    // STEP 1: Raise both hands in front (H-handshape position)
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 3, "-"]);
    animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI / 3, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "y", Math.PI / 4, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "y", -Math.PI / 4, "+"]);
    // Extend index and middle fingers (H-handshape approximation)
    animations.push(["mixamorigRightHandRing1", "rotation", "z", Math.PI / 2, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", Math.PI / 2, "+"]);
    animations.push(["mixamorigLeftHandRing1", "rotation", "z", -Math.PI / 2, "-"]);
    animations.push(["mixamorigLeftHandPinky1", "rotation", "z", -Math.PI / 2, "+"]);
    ref.animations.push(animations);

    // STEP 2: Tap hands together (Symbolic tapping)
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI / 8, "-"]);
    animations.push(["mixamorigLeftArm", "rotation", "z", -Math.PI / 8, "+"]);
    ref.animations.push(animations);

    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI / 6, "+"]);
    animations.push(["mixamorigLeftArm", "rotation", "z", -Math.PI / 6, "-"]);
    ref.animations.push(animations);

    // STEP 3: Reset to EXACT Default Pose
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigLeftArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI / 3, "+"]);
    animations.push(["mixamorigLeftArm", "rotation", "z", -Math.PI / 3, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "y", Math.PI / 1.5, "+"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "y", -Math.PI / 1.5, "-"]);
    // Reset fingers
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigLeftHandRing1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigLeftHandPinky1", "rotation", "z", 0, "-"]);
    ref.animations.push(animations);

    if (ref.pending === false) {
        ref.pending = true;
        ref.animate();
    }
}

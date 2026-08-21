export const BAD = (ref) => {
    let animations = [];

    // Thumbs Down (Right Hand) - Similar to GOOD but wrist rotated differently

    // 1. Raise Arm
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 1.5, "+"]);

    // 2. Make Fist
    const fingers = ["mixamorigRightHandIndex", "mixamorigRightHandMiddle", "mixamorigRightHandRing", "mixamorigRightHandPinky"];
    fingers.forEach(finger => {
        animations.push([finger + "1", "rotation", "z", Math.PI / 2, "+"]);
        animations.push([finger + "2", "rotation", "z", Math.PI / 2, "+"]);
        animations.push([finger + "3", "rotation", "z", Math.PI / 2, "+"]);
    });

    // 3. Rotate Wrist Down
    animations.push(["mixamorigRightHand", "rotation", "y", Math.PI / 2, "+"]); // Opposite rotation to GOOD
    ref.animations.push(animations);

    // Hold
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2, "-"]);
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "y", 0, "-"]);
    fingers.forEach(finger => {
        animations.push([finger + "1", "rotation", "z", 0, "-"]);
        animations.push([finger + "2", "rotation", "z", 0, "-"]);
        animations.push([finger + "3", "rotation", "z", 0, "-"]);
    });
    ref.animations.push(animations);

    if (ref.pending === false) {
        ref.pending = true;
        ref.animate();
    }
}

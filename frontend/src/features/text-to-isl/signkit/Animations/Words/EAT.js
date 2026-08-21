export const EAT = (ref) => {
    let animations = [];

    // Hand to Mouth (Right Hand)
    // 1. Bring hand up
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 1.5, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 1.2, "+"]); // Bend Elbow fully

    // 2. Bunch fingers (Eating gesture)
    animations.push(["mixamorigRightHand", "rotation", "z", Math.PI / 6, "+"]); // Tilt hand towards mouth
    const fingers = ["mixamorigRightHandIndex", "mixamorigRightHandMiddle", "mixamorigRightHandRing", "mixamorigRightHandPinky", "mixamorigRightHandThumb"];
    fingers.forEach(finger => {
        // Bend tips to meet thumb
        if (!finger.includes("Thumb")) {
            animations.push([finger + "1", "rotation", "z", Math.PI / 2.5, "+"]);
        } else {
            animations.push([finger + "2", "rotation", "y", Math.PI / 4, "+"]);
        }
    });
    ref.animations.push(animations);

    // Quick repetitive motion (optional) - just doing hold for now

    // Reset
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "z", 0, "-"]);
    fingers.forEach(finger => {
        if (!finger.includes("Thumb")) {
            animations.push([finger + "1", "rotation", "z", 0, "-"]);
        } else {
            animations.push([finger + "2", "rotation", "y", 0, "-"]);
        }
    });
    ref.animations.push(animations);

    if (ref.pending === false) {
        ref.pending = true;
        ref.animate();
    }
}

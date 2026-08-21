export const Eight = (ref) => {
    let animations = [];

    // Right Hand: Eight (ASL Style: Middle touches Thumb)
    // Index, Ring, Pinky Straight
    const straightFingers = ["mixamorigRightHandIndex", "mixamorigRightHandRing", "mixamorigRightHandPinky"];
    straightFingers.forEach(finger => {
        animations.push([finger + "1", "rotation", "z", 0, "-"]);
        animations.push([finger + "2", "rotation", "z", 0, "-"]);
        animations.push([finger + "3", "rotation", "z", 0, "-"]);
    });

    // Middle: Curled to meet Thumb
    const middle = "mixamorigRightHandMiddle";
    animations.push([middle + "1", "rotation", "z", Math.PI / 2, "+"]);
    animations.push([middle + "2", "rotation", "z", Math.PI / 3, "+"]);
    animations.push([middle + "3", "rotation", "z", Math.PI / 4, "+"]);

    // Thumb: Curled to meet Middle
    animations.push(["mixamorigRightHandThumb2", "rotation", "y", -Math.PI / 4, "-"]);
    animations.push(["mixamorigRightHandThumb3", "rotation", "y", -Math.PI / 4, "-"]);

    // Left Hand: Closed (Fist)
    const leftFingers = ["mixamorigLeftHandIndex", "mixamorigLeftHandMiddle", "mixamorigLeftHandRing", "mixamorigLeftHandPinky"];
    leftFingers.forEach(finger => {
        animations.push([finger + "1", "rotation", "z", Math.PI / 2, "+"]);
        animations.push([finger + "2", "rotation", "z", Math.PI / 2, "+"]);
        animations.push([finger + "3", "rotation", "z", Math.PI / 2, "+"]);
    });
    // Thumb: Touch index (Curled in)
    animations.push(["mixamorigLeftHandThumb2", "rotation", "y", Math.PI / 4, "+"]);
    animations.push(["mixamorigLeftHandThumb3", "rotation", "y", Math.PI / 4, "+"]);

    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push([middle + "1", "rotation", "z", 0, "-"]);
    animations.push([middle + "2", "rotation", "z", 0, "-"]);
    animations.push([middle + "3", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandThumb2", "rotation", "y", 0, "+"]);
    animations.push(["mixamorigRightHandThumb3", "rotation", "y", 0, "+"]);

    leftFingers.forEach(finger => {
        animations.push([finger + "1", "rotation", "z", 0, "-"]);
        animations.push([finger + "2", "rotation", "z", 0, "-"]);
        animations.push([finger + "3", "rotation", "z", 0, "-"]);
    });
    animations.push(["mixamorigLeftHandThumb2", "rotation", "y", 0, "-"]);
    animations.push(["mixamorigLeftHandThumb3", "rotation", "y", 0, "-"]);

    ref.animations.push(animations);

    if (ref.pending === false) {
        ref.pending = true;
        ref.animate();
    }
}

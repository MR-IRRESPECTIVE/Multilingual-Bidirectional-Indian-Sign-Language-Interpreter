export const One = (ref) => {
    let animations = [];

    // Right Hand: Index Up (1)
    // Index Straight, others curled
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandIndex2", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandIndex3", "rotation", "z", 0, "-"]);

    const curledFingers = ["mixamorigRightHandMiddle", "mixamorigRightHandRing", "mixamorigRightHandPinky"];
    curledFingers.forEach(finger => {
        animations.push([finger + "1", "rotation", "z", Math.PI / 2, "+"]);
        animations.push([finger + "2", "rotation", "z", Math.PI / 2, "+"]);
        animations.push([finger + "3", "rotation", "z", Math.PI / 2, "+"]);
    });

    // Thumb: Tucked
    animations.push(["mixamorigRightHandThumb2", "rotation", "y", -Math.PI / 2, "-"]);
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
    curledFingers.forEach(finger => {
        animations.push([finger + "1", "rotation", "z", 0, "-"]);
        animations.push([finger + "2", "rotation", "z", 0, "-"]);
        animations.push([finger + "3", "rotation", "z", 0, "-"]);
    });
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

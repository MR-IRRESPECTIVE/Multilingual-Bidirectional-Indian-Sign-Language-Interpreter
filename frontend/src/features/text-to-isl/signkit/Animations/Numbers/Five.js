export const Five = (ref) => {
    let animations = [];

    // Right Hand: 5 Fingers Up (All Straight, Open Palm)
    const straightFingers = ["mixamorigRightHandIndex", "mixamorigRightHandMiddle", "mixamorigRightHandRing", "mixamorigRightHandPinky"];
    straightFingers.forEach(finger => {
        animations.push([finger + "1", "rotation", "z", 0, "-"]);
        animations.push([finger + "2", "rotation", "z", 0, "-"]);
        animations.push([finger + "3", "rotation", "z", 0, "-"]);
    });

    // Thumb: Straight / Extended (Open)
    animations.push(["mixamorigRightHandThumb2", "rotation", "y", 0, "-"]); // Reset to neutral/open
    animations.push(["mixamorigRightHandThumb3", "rotation", "y", 0, "-"]);

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

    // Reset (Not much to do if already straight, but good practice)
    animations = [];
    // ...

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

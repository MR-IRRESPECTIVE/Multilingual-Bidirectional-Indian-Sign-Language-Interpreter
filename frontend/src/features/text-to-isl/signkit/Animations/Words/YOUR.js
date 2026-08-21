export const YOUR = (ref) => {
    let animations = [];

    // STEP 1: Raise right hand, flat palm facing out
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 3, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "y", Math.PI / 4, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "x", -Math.PI / 4, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "y", Math.PI / 6, "+"]);
    ref.animations.push(animations);

    // STEP 2: Push forward slightly
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2.2, "-"]);
    ref.animations.push(animations);

    // STEP 3: Reset to EXACT Default Pose
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI / 3, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "y", Math.PI / 1.5, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "y", 0, "-"]);
    ref.animations.push(animations);

    if (ref.pending === false) {
        ref.pending = true;
        ref.animate();
    }
}

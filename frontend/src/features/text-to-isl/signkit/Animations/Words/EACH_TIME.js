export const DAY = (ref) => {
    let animations = [];
    // Full arm arc (Sunrise to Sunset)

    // 1. Horizon Left (Sunrise)
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 1.2, "+"]); // Rest on left arm (implied)
    ref.animations.push(animations);

    // 2. High Noon (Up)
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI, "-"]); // Up
    ref.animations.push(animations);

    // 3. Sunset (Down Left - actually should be creating an arc, but linear interpolation works ok)
    // We will just do Up-Down for simplcity of "Day" being "Sun Up" basically.
    // Or Open arm arc. Let's do Open Arm Arc.

    // Start Left
    // Move to Right
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "y", -Math.PI / 2, "-"]); // Swing out to right side
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "y", 0, "+"]);
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

export const WEEK = (ref) => {
    let animations = [];
    // Index finger slides across palm (Left palm flat, Right index slides)

    // 1. Setup
    animations = [];
    animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", -Math.PI / 1.5, "-"]);
    animations.push(["mixamorigLeftHand", "rotation", "y", -Math.PI / 2, "-"]); // Palm Up/Flat

    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 2, "+"]);
    // Right Index
    ["Middle", "Ring", "Pinky", "Thumb"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", Math.PI / 2, "+"]);
    });
    ref.animations.push(animations);

    // 2. Slide across
    animations = [];
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 3, "-"]); // Move Right
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigLeftArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigLeftHand", "rotation", "y", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    ["Middle", "Ring", "Pinky", "Thumb"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", 0, "-"]);
    });
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

export const MONTH = (ref) => {
    let animations = [];
    // Index finger slides down other index finger (Left index up, Right index slides down back of it)

    // 1. Left Index Up
    animations = [];
    animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", -Math.PI / 2, "-"]); // Vertical
    ["Middle", "Ring", "Pinky", "Thumb"].forEach(f => {
        animations.push(["mixamorigLeftHand" + f + "1", "rotation", "z", Math.PI / 2, "+"]);
    });

    // Right Index
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 2, "+"]); // Horizontal-ish at top
    ["Middle", "Ring", "Pinky", "Thumb"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", Math.PI / 2, "+"]);
    });
    ref.animations.push(animations);

    // 2. Slide Down
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 3, "+"]); // Down
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigLeftArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    ["Middle", "Ring", "Pinky", "Thumb"].forEach(f => {
        animations.push(["mixamorigLeftHand" + f + "1", "rotation", "z", 0, "-"]);
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", 0, "-"]);
    });
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

export const YEAR = (ref) => {
    let animations = [];
    // Fists rotating around each other (S-hands, circle)

    // 1. Fists Stacked
    animations = [];
    ["Left", "Right"].forEach(side => {
        animations.push(["mixamorig" + side + "Arm", "rotation", "x", -Math.PI / 2, "-"]);
        const sign = side === "Right" ? 1 : -1;
        animations.push(["mixamorig" + side + "ForeArm", "rotation", "z", sign * Math.PI / 2, "+"]);
        ["Index", "Middle", "Ring", "Pinky", "Thumb"].forEach(f => {
            animations.push(["mixamorig" + side + "Hand" + f + "1", "rotation", "z", Math.PI / 2, "+"]);
        });
    });
    ref.animations.push(animations);

    // 2. Orbit (Right moves around left)
    // Simplified: Right Up, then Down/Forward
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 1.5, "-"]);
    ref.animations.push(animations);
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2, "+"]);
    ref.animations.push(animations);

    // Reset
    animations = [];
    ["Left", "Right"].forEach(side => {
        animations.push(["mixamorig" + side + "Arm", "rotation", "x", 0, "+"]);
        animations.push(["mixamorig" + side + "ForeArm", "rotation", "z", 0, "-"]);
        ["Index", "Middle", "Ring", "Pinky", "Thumb"].forEach(f => {
            animations.push(["mixamorig" + side + "Hand" + f + "1", "rotation", "z", 0, "-"]);
        });
    });
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

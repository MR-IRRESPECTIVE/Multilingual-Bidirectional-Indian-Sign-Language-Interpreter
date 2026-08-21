export const POINT_SELF = (ref) => {
    let animations = [];
    // Point to chest (I/Me)
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 3, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 1.2, "+"]);
    // Index Finger
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "-"]);
    // Others curled
    ["Middle", "Ring", "Pinky"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", Math.PI / 2, "+"]);
        animations.push(["mixamorigRightHand" + f + "2", "rotation", "z", Math.PI / 2, "+"]);
    });
    // Wrist bent to point IN
    animations.push(["mixamorigRightHand", "rotation", "y", -Math.PI / 2, "-"]);
    ref.animations.push(animations);

    // Touch chest check
    animations = [];
    animations.push(["mixamorigRightHand", "rotation", "x", -Math.PI / 10, "-"]);
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "y", 0, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "x", 0, "+"]);
    ["Middle", "Ring", "Pinky"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", 0, "-"]);
        animations.push(["mixamorigRightHand" + f + "2", "rotation", "z", 0, "-"]);
    });
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

export const MY = (ref) => {
    let animations = [];
    // Flat hand on chest (Possessive)
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 3, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 1.1, "+"]); // Closer flexion

    // Hand Flat (All fingers open together/slightly relaxed)
    // Wrist bent to palm touches chest
    animations.push(["mixamorigRightHand", "rotation", "y", -Math.PI / 2, "-"]);
    ref.animations.push(animations);

    // Pat Chest
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 3.2, "+"]);
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "y", 0, "+"]);
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

export const POINT_OUT = (ref) => {
    let animations = [];
    // Point forward (You/He/She/It)
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 3, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "x", -Math.PI / 6, "-"]);
    // Index Finger
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "-"]);
    // Others curled
    ["Middle", "Ring", "Pinky"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", Math.PI / 2, "+"]);
        animations.push(["mixamorigRightHand" + f + "2", "rotation", "z", Math.PI / 2, "+"]);
    });
    ref.animations.push(animations);

    // Pulse Point
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2.8, "+"]);
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "x", 0, "+"]);
    ["Middle", "Ring", "Pinky"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", 0, "-"]);
        animations.push(["mixamorigRightHand" + f + "2", "rotation", "z", 0, "-"]);
    });
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

export const POINT_SWEEP = (ref) => {
    let animations = [];
    // Sweep for We/They

    // Start Right
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 4, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "y", -Math.PI / 4, "-"]);
    // Index Finger only
    ["Middle", "Ring", "Pinky"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", Math.PI / 2, "+"]);
    });
    ref.animations.push(animations);

    // Sweep Left
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "y", Math.PI / 4, "+"]);
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "y", 0, "-"]); // Reset Y rotation depending on default
    ["Middle", "Ring", "Pinky"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", 0, "-"]);
    });
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

// Friend: Hooks
export const FRIEND = (ref) => {
    let animations = [];
    // Hook fingers

    // 1. Both hands Index hook
    animations = [];
    ["Left", "Right"].forEach(side => {
        animations.push(["mixamorig" + side + "Arm", "rotation", "x", -Math.PI / 2, "-"]);
        const sign = side === "Right" ? 1 : -1;
        animations.push(["mixamorig" + side + "ForeArm", "rotation", "z", sign * Math.PI / 2, "+"]);

        // Index Hook
        animations.push(["mixamorig" + side + "HandIndex1", "rotation", "z", Math.PI / 3, "+"]);

        // Others closed
        ["Middle", "Ring", "Pinky", "Thumb"].forEach(f => {
            animations.push(["mixamorig" + side + "Hand" + f + "1", "rotation", "z", Math.PI / 1.5, "+"]);
        });
    });
    // Move hands together (Overlap)
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 1.5, "+"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", -Math.PI / 1.5, "-"]);
    ref.animations.push(animations);

    // Pull (Bounce)
    animations = [];
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 1.8, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", -Math.PI / 1.8, "+"]);
    ref.animations.push(animations);
    animations = [];
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 1.5, "+"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", -Math.PI / 1.5, "-"]);
    ref.animations.push(animations);

    // Reset
    animations = [];
    ["Left", "Right"].forEach(side => {
        animations.push(["mixamorig" + side + "Arm", "rotation", "x", 0, "+"]);
        animations.push(["mixamorig" + side + "ForeArm", "rotation", "z", 0, "-"]);
        ["Index", "Middle", "Ring", "Pinky", "Thumb"].forEach(f => {
            animations.push(["mixamorig" + side + "Hand" + f + "1", "rotation", "z", 0, "-"]);
        });
        animations.push(["mixamorig" + side + "HandIndex1", "rotation", "z", 0, "-"]);
    });
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

export const STOP = (ref) => {
    let animations = [];
    // Palm Halt
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 2, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "x", -Math.PI / 2, "-"]); // Palm out
    ref.animations.push(animations);

    // Hold
    ref.animations.push([]);

    // Reset
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "x", 0, "+"]);
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

export const WAIT = (ref) => {
    let animations = [];
    // Jazz hands (Wiggle fingers)

    // 1. Hands Up
    animations = [];
    ["Left", "Right"].forEach(side => {
        animations.push(["mixamorig" + side + "Arm", "rotation", "x", -Math.PI / 2, "-"]);
        const sign = side === "Right" ? 1 : -1;
        animations.push(["mixamorig" + side + "ForeArm", "rotation", "z", sign * Math.PI / 2, "+"]);
        // Open hands
        animations.push(["mixamorig" + side + "Hand", "rotation", "x", -Math.PI / 2, "-"]);
    });
    ref.animations.push(animations);

    // Wiggle
    animations = [];
    ["Left", "Right"].forEach(side => {
        ["Index", "Middle", "Ring", "Pinky"].forEach(f => {
            animations.push(["mixamorig" + side + "Hand" + f + "1", "rotation", "z", Math.PI / 4, "+"]);
        });
    });
    ref.animations.push(animations);
    animations = [];
    ["Left", "Right"].forEach(side => {
        ["Index", "Middle", "Ring", "Pinky"].forEach(f => {
            animations.push(["mixamorig" + side + "Hand" + f + "1", "rotation", "z", 0, "-"]);
        });
    });
    ref.animations.push(animations);

    // Reset
    animations = [];
    ["Left", "Right"].forEach(side => {
        animations.push(["mixamorig" + side + "Arm", "rotation", "x", 0, "+"]);
        animations.push(["mixamorig" + side + "ForeArm", "rotation", "z", 0, "-"]);
        animations.push(["mixamorig" + side + "Hand", "rotation", "x", 0, "+"]);
    });
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}


export const COME = (ref) => {
    let animations = [];
    // Index finger beckon
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 2, "+"]);
    // Point up
    ["Middle", "Ring", "Pinky", "Thumb"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", Math.PI / 2, "+"]);
    });
    ref.animations.push(animations);

    // Beckon (Curl index)
    animations = [];
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", Math.PI / 2, "+"]);
    ref.animations.push(animations);

    // Uncurl
    animations = [];
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "-"]);
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    ["Middle", "Ring", "Pinky", "Thumb"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", 0, "-"]);
    });
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

export const GO = (ref) => {
    let animations = [];
    // Point Away briskly
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 4, "+"]);
    ["Middle", "Ring", "Pinky", "Thumb"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", Math.PI / 2, "+"]);
    });
    ref.animations.push(animations);

    // Thrust
    animations = [];
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "y", -Math.PI / 4, "-"]); // Side
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "y", 0, "+"]);
    ["Middle", "Ring", "Pinky", "Thumb"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", 0, "-"]);
    });
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

export const HELP = (ref) => {
    let animations = [];
    // Left palm flat, Right fist with thumb up on top, lift

    // 1. Setup
    animations = [];
    // Left palm flat up
    animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", -Math.PI / 2, "-"]);
    animations.push(["mixamorigLeftHand", "rotation", "y", -Math.PI / 2, "-"]); // Palm Up

    // Right Fist Thumb Up
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 2, "+"]);
    ["Index", "Middle", "Ring", "Pinky"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", Math.PI / 2, "+"]);
    });
    ref.animations.push(animations);

    // 2. Lift both
    animations = [];
    animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI / 1.5, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 1.5, "-"]);
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigLeftArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigLeftHand", "rotation", "y", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    ["Index", "Middle", "Ring", "Pinky"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", 0, "-"]);
    });
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

export const SEE = (ref) => {
    let animations = [];
    // V-hand at eyes moving out
    // 1. Setup V hand
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 1.1, "+"]); // Near face
    ["Ring", "Pinky", "Thumb"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", Math.PI / 2, "+"]);
    });
    // Spread Index/Middle? Default is okay.
    ref.animations.push(animations);

    // 2. Move out
    animations = [];
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 2, "-"]);
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    ["Ring", "Pinky", "Thumb"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", 0, "-"]);
    });
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

export const WATCH = (ref) => {
    // Similar to SEE but maybe two handed or slower?
    // Doing 2 handed V-out
    let animations = [];
    // 1. Setup V hand Both
    animations = [];
    ["Left", "Right"].forEach(side => {
        animations.push(["mixamorig" + side + "Arm", "rotation", "x", -Math.PI / 2, "-"]);
        const sign = side === "Right" ? 1 : -1;
        animations.push(["mixamorig" + side + "ForeArm", "rotation", "z", sign * Math.PI / 1.1, "+"]);
        ["Ring", "Pinky", "Thumb"].forEach(f => {
            animations.push(["mixamorig" + side + "Hand" + f + "1", "rotation", "z", Math.PI / 2, "+"]);
        });
    });
    ref.animations.push(animations);

    // 2. Move out
    animations = [];
    ["Left", "Right"].forEach(side => {
        const sign = side === "Right" ? 1 : -1;
        animations.push(["mixamorig" + side + "ForeArm", "rotation", "z", sign * Math.PI / 2, "-"]);
    });
    ref.animations.push(animations);

    // Reset
    animations = [];
    ["Left", "Right"].forEach(side => {
        animations.push(["mixamorig" + side + "Arm", "rotation", "x", 0, "+"]);
        animations.push(["mixamorig" + side + "ForeArm", "rotation", "z", 0, "-"]);
        ["Ring", "Pinky", "Thumb"].forEach(f => {
            animations.push(["mixamorig" + side + "Hand" + f + "1", "rotation", "z", 0, "-"]);
        });
    });
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

export const HEAR = (ref) => {
    let animations = [];
    // Index to ear

    // 1. Touch Ear
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 1.8, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 1.1, "+"]);
    // Index finger
    ["Middle", "Ring", "Pinky", "Thumb"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", Math.PI / 2, "+"]);
    });
    ref.animations.push(animations);

    // Hold
    ref.animations.push([]);

    // Reset
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    ["Middle", "Ring", "Pinky", "Thumb"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", 0, "-"]);
    });
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

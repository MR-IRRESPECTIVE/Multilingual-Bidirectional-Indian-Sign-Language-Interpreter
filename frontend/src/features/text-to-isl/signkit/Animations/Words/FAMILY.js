export const FATHER = (ref) => {
    let animations = [];
    // ISL: Moustache Sign (Index finger moves across upper lip)

    // 1. Hand to Upper Lip (Left side)
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 1.8, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 1.1, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "y", Math.PI / 4, "+"]); // Adjust to face

    // Index finger extended, others closed
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "-"]);
    ["Middle", "Ring", "Pinky", "Thumb"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", Math.PI / 1.5, "+"]);
        animations.push(["mixamorigRightHand" + f + "2", "rotation", "z", Math.PI / 1.5, "+"]);
    });
    ref.animations.push(animations);

    // 2. Move across lip (Right)
    animations = [];
    animations.push(["mixamorigRightHand", "rotation", "y", -Math.PI / 6, "-"]); // Wrist flick/move
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "y", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "y", 0, "+"]);
    ["Middle", "Ring", "Pinky", "Thumb"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", 0, "-"]);
        animations.push(["mixamorigRightHand" + f + "2", "rotation", "z", 0, "-"]);
    });
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

export const MOTHER = (ref) => {
    let animations = [];
    // ISL: Nose Ring Sign (Index finger touches right nostril/cheek)

    // 1. Hand to Right Cheek/Nose
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 1.1, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "y", -Math.PI / 6, "-"]); // Angle to cheek

    // Index finger extended
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "-"]);
    ["Middle", "Ring", "Pinky", "Thumb"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", Math.PI / 1.5, "+"]);
    });

    // Tap cheek
    ref.animations.push(animations);

    // 2. Rotational Twist (indicating ring) - Optional
    animations = [];
    animations.push(["mixamorigRightHand", "rotation", "z", Math.PI / 6, "+"]);
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "y", 0, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "z", 0, "-"]);
    ["Middle", "Ring", "Pinky", "Thumb"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", 0, "-"]);
    });
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

export const BROTHER = (ref) => {
    let animations = [];
    // ISL: Brother = Male Sign + Generic Move/Same
    // Simplified to "Brother" specific gesture:  Often "B" handshape on chest or "Knuckles rub"
    // Going with "Knuckles Rub" (Right fist rubs left fist)

    // 1. Fists together at chest
    animations = [];
    animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", -Math.PI / 2, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 2, "+"]);

    // Fists
    ["Left", "Right"].forEach(side => {
        ["Index", "Middle", "Ring", "Pinky", "Thumb"].forEach(f => {
            animations.push(["mixamorig" + side + "Hand" + f + "1", "rotation", "z", Math.PI / 2, "+"]);
        });
    });
    ref.animations.push(animations);

    // 2. Rub Up/Down
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "y", -Math.PI / 6, "-"]); // Move slightly
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
    animations.push(["mixamorigRightArm", "rotation", "y", 0, "+"]);
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

export const SISTER = (ref) => {
    let animations = [];
    // ISL: Sister = Female Sign + Same/Rub
    // "L" handshape on chin? Or "F" handshape on cheek?
    // Let's use: Index finger cheek (Mother/Female base) -> moved down to chest

    // 1. Cheek (Female base)
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 1.1, "+"]);
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "-"]);
    // Others closed
    ["Middle", "Ring", "Pinky", "Thumb"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", Math.PI / 1.5, "+"]);
    });
    ref.animations.push(animations);

    // 2. Move down to neutral space
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 4, "+"]); // Down
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

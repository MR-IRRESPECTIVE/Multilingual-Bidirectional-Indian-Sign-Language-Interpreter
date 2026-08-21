export const LOVE = (ref) => {
    let animations = [];
    // Cross arms over chest
    animations = [];

    // Right Arm
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 3, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "z", -Math.PI / 4, "-"]); // Cross inwards
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 1.5, "+"]); // Bend

    // Left Arm
    animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI / 3, "-"]);
    animations.push(["mixamorigLeftArm", "rotation", "z", Math.PI / 4, "+"]); // Cross inwards
    animations.push(["mixamorigLeftForeArm", "rotation", "z", -Math.PI / 1.5, "-"]); // Bend

    // Hands (Fists)
    ["Right", "Left"].forEach(side => {
        ["Index", "Middle", "Ring", "Pinky"].forEach(f => {
            animations.push(["mixamorig" + side + "Hand" + f + "1", "rotation", "z", Math.PI / 2, "+"]);
        });
    });

    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI / 3, "+"]); // Default A-pose adjustment
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);

    animations.push(["mixamorigLeftArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigLeftArm", "rotation", "z", -Math.PI / 3, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", 0, "+"]);

    ["Right", "Left"].forEach(side => {
        ["Index", "Middle", "Ring", "Pinky"].forEach(f => {
            animations.push(["mixamorig" + side + "Hand" + f + "1", "rotation", "z", 0, "-"]);
        });
    });
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

export const HAPPY = (ref) => {
    let animations = [];
    // Open hands padding chest
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2.5, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 1.2, "+"]);
    ref.animations.push(animations);

    // Pad Up
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2, "-"]);
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

export const SAD = (ref) => {
    let animations = [];
    // Droop head and hands down face
    animations = [];
    animations.push(["mixamorigNeck", "rotation", "x", Math.PI / 4, "+"]); // Head Down
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 4, "-"]); // Arms slightly up first
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 1.2, "+"]); // Hands near face
    ref.animations.push(animations);

    // Drag down
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]); // Arms down
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigNeck", "rotation", "x", 0, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

export const WANT = (ref) => {
    let animations = [];
    // "Claw" hands pulling towards body

    // 1. Reach out
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI / 2, "-"]);
    ref.animations.push(animations);

    // 2. Pull in + Claw Fingers
    animations = [];
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 2, "+"]); // Bend elbows
    animations.push(["mixamorigLeftForeArm", "rotation", "z", -Math.PI / 2, "-"]);

    ["Right", "Left"].forEach(side => {
        ["Index", "Middle", "Ring", "Pinky", "Thumb"].forEach(f => {
            animations.push(["mixamorig" + side + "Hand" + f + "1", "rotation", "z", Math.PI / 3, "+"]); // Curl
        });
    });
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigLeftArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", 0, "+"]);
    ["Right", "Left"].forEach(side => {
        ["Index", "Middle", "Ring", "Pinky", "Thumb"].forEach(f => {
            animations.push(["mixamorig" + side + "Hand" + f + "1", "rotation", "z", 0, "-"]);
        });
    });
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

export const ANGRY = (ref) => {
    let animations = [];
    // Claw hand at face

    // 1. Hand up
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 1.2, "+"]);
    // Claw
    ["Index", "Middle", "Ring", "Pinky", "Thumb"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", Math.PI / 2, "+"]);
    });
    ref.animations.push(animations);

    // Shake hand (Tremble)
    animations = [];
    animations.push(["mixamorigRightHand", "rotation", "z", Math.PI / 6, "+"]);
    ref.animations.push(animations);
    animations = [];
    animations.push(["mixamorigRightHand", "rotation", "z", -Math.PI / 6, "-"]);
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "z", 0, "+"]);
    ["Index", "Middle", "Ring", "Pinky", "Thumb"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", 0, "-"]);
    });
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

export const LIKE = (ref) => {
    let animations = [];
    // Thumb and Middle Finger pull thread from chest (8-hand)

    // 1. Hand to chest
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 3, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 1.2, "+"]);
    // Middle and Thumb pinched
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", Math.PI / 2, "+"]);
    animations.push(["mixamorigRightHandThumb2", "rotation", "y", Math.PI / 2, "+"]);
    // Others Open
    ref.animations.push(animations);

    // 2. Pull Out
    animations = [];
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]); // Extend arm
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandThumb2", "rotation", "y", 0, "-"]);
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

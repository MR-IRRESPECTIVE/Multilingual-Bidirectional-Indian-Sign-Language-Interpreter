export const WORK = (ref) => {
    let animations = [];
    // Fists tapping on wrists - OK for ISL

    // 1. Hands in front
    animations = [];
    // Left Fist
    animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", -Math.PI / 2, "-"]);
    ["Index", "Middle", "Ring", "Pinky", "Thumb"].forEach(f => {
        animations.push(["mixamorigLeftHand" + f + "1", "rotation", "z", Math.PI / 2, "+"]);
    });
    animations.push(["mixamorigLeftHand", "rotation", "y", -Math.PI / 2, "-"]);

    // Right Fist
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 2, "+"]);
    ["Index", "Middle", "Ring", "Pinky", "Thumb"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", Math.PI / 2, "+"]);
    });
    animations.push(["mixamorigRightHand", "rotation", "y", Math.PI / 2, "+"]);
    ref.animations.push(animations);

    // 2. Tap (Double tap)
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 1.8, "+"]); // Lift
    ref.animations.push(animations);
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2, "-"]); // Tap
    ref.animations.push(animations);

    // Repeat Tap
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 1.8, "+"]); // Lift
    ref.animations.push(animations);
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2, "-"]); // Tap
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigLeftArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigLeftHand", "rotation", "y", 0, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "y", 0, "-"]);
    ["Index", "Middle", "Ring", "Pinky", "Thumb"].forEach(f => {
        animations.push(["mixamorigLeftHand" + f + "1", "rotation", "z", 0, "-"]);
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", 0, "-"]);
    });
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

export const PLAY = (ref) => {
    let animations = [];
    // "Y" handshapes shaking - ISL is usually "Y" hands rotating

    // 1. Hands up "Y"
    animations = [];
    ["Left", "Right"].forEach(side => {
        const sign = side === "Right" ? 1 : -1;
        animations.push(["mixamorig" + side + "Arm", "rotation", "x", -Math.PI / 2, "-"]);
        animations.push(["mixamorig" + side + "ForeArm", "rotation", "z", sign * Math.PI / 2, "+"]);

        // Y-hand
        ["Index", "Middle", "Ring"].forEach(f => {
            animations.push(["mixamorig" + side + "Hand" + f + "1", "rotation", "z", Math.PI / 1.5, "+"]);
        });
    });
    ref.animations.push(animations);

    // 2. Shake (Twist)
    animations = [];
    animations.push(["mixamorigRightHand", "rotation", "z", Math.PI / 2, "+"]);
    animations.push(["mixamorigLeftHand", "rotation", "z", -Math.PI / 2, "-"]);
    ref.animations.push(animations);

    animations = [];
    animations.push(["mixamorigRightHand", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigLeftHand", "rotation", "z", 0, "+"]);
    ref.animations.push(animations);

    // Repeat Shake
    animations = [];
    animations.push(["mixamorigRightHand", "rotation", "z", Math.PI / 2, "+"]);
    animations.push(["mixamorigLeftHand", "rotation", "z", -Math.PI / 2, "-"]);
    ref.animations.push(animations);

    // Reset
    animations = [];
    ["Left", "Right"].forEach(side => {
        animations.push(["mixamorig" + side + "Arm", "rotation", "x", 0, "+"]);
        animations.push(["mixamorig" + side + "ForeArm", "rotation", "z", 0, "-"]);
        animations.push(["mixamorig" + side + "Hand", "rotation", "z", 0, "-"]);
        ["Index", "Middle", "Ring"].forEach(f => {
            animations.push(["mixamorig" + side + "Hand" + f + "1", "rotation", "z", 0, "-"]);
        });
    });
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

// Learn/Read/Write usually universal enough, keeping simple but adding animation range
export const LEARN = (ref) => {
    let animations = [];
    // Hand pulls from palm to forehead

    // 1. Left Palm Open Flat
    animations = [];
    animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", -Math.PI / 1.5, "-"]);
    animations.push(["mixamorigLeftHand", "rotation", "y", -Math.PI / 2, "-"]);
    ref.animations.push(animations);

    // 2. Right hand grabs from Left Palm
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 3, "+"]); // Near left hand
    ref.animations.push(animations);

    // 3. Move to Forehead & Close fingers (Absorb)
    animations = [];
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 1.1, "+"]); // Move to head
    ["Index", "Middle", "Ring", "Pinky", "Thumb"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", Math.PI / 3, "+"]); // Bunched
    });
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigLeftArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigLeftHand", "rotation", "y", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    ["Index", "Middle", "Ring", "Pinky", "Thumb"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", 0, "-"]);
    });
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

export const READ = (ref) => {
    let animations = [];
    // V-hand scanning Left Palm

    // 1. Left Palm Flat
    animations = [];
    animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", -Math.PI / 1.5, "-"]);
    animations.push(["mixamorigLeftHand", "rotation", "y", -Math.PI / 2, "-"]);
    // Right V-Hand
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 2, "+"]);
    ["Ring", "Pinky", "Thumb"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", Math.PI / 2, "+"]);
    });
    ref.animations.push(animations);

    // 2. Scan down
    animations = [];
    animations.push(["mixamorigRightHand", "rotation", "x", Math.PI / 6, "+"]);
    ref.animations.push(animations);

    // Scan up
    animations = [];
    animations.push(["mixamorigRightHand", "rotation", "x", -Math.PI / 6, "-"]);
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigLeftArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigLeftHand", "rotation", "y", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "x", 0, "-"]);
    ["Ring", "Pinky", "Thumb"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", 0, "-"]);
    });
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

export const WRITE = (ref) => {
    let animations = [];
    // Scribbling on palm

    // 1. Left Palm Flat
    animations = [];
    animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", -Math.PI / 1.5, "-"]);
    animations.push(["mixamorigLeftHand", "rotation", "y", -Math.PI / 2, "-"]);

    // 2. Right Hand Pinch (Holding pen)
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 2, "+"]);
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", Math.PI / 3, "+"]);
    animations.push(["mixamorigRightHandThumb2", "rotation", "y", Math.PI / 3, "+"]);
    ref.animations.push(animations);

    // 3. Wiggle (Write)
    animations = [];
    animations.push(["mixamorigRightHand", "rotation", "z", Math.PI / 6, "+"]);
    ref.animations.push(animations);
    animations = [];
    animations.push(["mixamorigRightHand", "rotation", "z", -Math.PI / 6, "-"]);
    ref.animations.push(animations);
    animations = [];
    animations.push(["mixamorigRightHand", "rotation", "z", Math.PI / 6, "+"]);
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigLeftArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigLeftHand", "rotation", "y", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandThumb2", "rotation", "y", 0, "-"]);
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

export const DRINK = (ref) => {
    let animations = [];
    // Cup to mouth (Universal/ISL) - No change needed, but ensuring thumb is "holding" properly
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 1.5, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 1.1, "+"]);

    // C-Handshape
    const fingers = ["Index", "Middle", "Ring", "Pinky"];
    fingers.forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", Math.PI / 3, "+"]); // Tighter grip
        animations.push(["mixamorigRightHand" + f + "2", "rotation", "z", Math.PI / 3, "+"]);
    });
    animations.push(["mixamorigRightHandThumb1", "rotation", "y", Math.PI / 4, "+"]);

    // Rotate wrist to "hold cup" orientation
    animations.push(["mixamorigRightHand", "rotation", "y", -Math.PI / 2, "-"]);
    ref.animations.push(animations);

    // Tilt head back slightly 
    animations = [];
    animations.push(["mixamorigNeck", "rotation", "x", -Math.PI / 6, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "x", -Math.PI / 6, "-"]); // Tilt cup
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "y", 0, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigNeck", "rotation", "x", 0, "+"]);
    fingers.forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", 0, "-"]);
        animations.push(["mixamorigRightHand" + f + "2", "rotation", "z", 0, "-"]);
    });
    animations.push(["mixamorigRightHandThumb1", "rotation", "y", 0, "-"]);
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

export const WATER = (ref) => {
    let animations = [];
    // ISL: Often Index finger to lips (Drinking from tap/generic) OR "Glass" to mouth
    // "W" on chin is ASL.
    // Changing to: Index finger touches lower lip (Generic "Thirst/Water")
    // OR "C" handshape inverted (pouring into mouth).
    // Let's go with "Index to Lip" as it's distinct from Drink (Cup).

    // 1. Hand to Lip
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 1.1, "+"]);

    // Point Index
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "-"]);
    ["Middle", "Ring", "Pinky", "Thumb"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", Math.PI, "+"]);
    });

    ref.animations.push(animations);

    // Tap Lip
    animations = [];
    animations.push(["mixamorigRightHand", "rotation", "x", -Math.PI / 6, "-"]);
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "x", 0, "+"]);
    ["Middle", "Ring", "Pinky", "Thumb"].forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", 0, "-"]);
    });
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

export const MILK = (ref) => {
    let animations = [];
    // ISL: Milking action (Fists squeezing up and down)

    // 1. Arms out
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 4, "+"]);
    animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI / 2, "-"]); // Use both hands for MILK usually
    animations.push(["mixamorigLeftForeArm", "rotation", "z", -Math.PI / 4, "-"]);
    ref.animations.push(animations);

    // 2. Squeeze Alternating? Or Together. Together is easier.
    // Open -> Close
    const fingers = ["Index", "Middle", "Ring", "Pinky"];
    fingers.forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", Math.PI / 1.5, "+"]);
        animations.push(["mixamorigLeftHand" + f + "1", "rotation", "z", Math.PI / 1.5, "+"]);
    });
    // Move hands down slightly (Milking)
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 1.8, "-"]);
    animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI / 1.8, "-"]);
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigLeftArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", 0, "+"]);
    fingers.forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", 0, "-"]);
        animations.push(["mixamorigLeftHand" + f + "1", "rotation", "z", 0, "-"]);
    });
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

export const FOOD = (ref) => {
    let animations = [];
    // Tapered hand to mouth repeated
    // ... Existing implementation is fine.

    // 1. Hand to mouth
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 1.5, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 1.1, "+"]);

    // Bunched fingers
    const fingers = ["Index", "Middle", "Ring", "Pinky"];
    fingers.forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", Math.PI / 2.2, "+"]);
    });
    animations.push(["mixamorigRightHandThumb2", "rotation", "y", Math.PI / 2, "+"]);

    // Tap mouth
    animations.push(["mixamorigRightHand", "rotation", "y", -Math.PI / 2, "-"]);
    ref.animations.push(animations);

    // Tap movement
    animations = [];
    animations.push(["mixamorigRightHand", "rotation", "z", -Math.PI / 10, "-"]);
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "y", 0, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "z", 0, "-"]);
    fingers.forEach(f => {
        animations.push(["mixamorigRightHand" + f + "1", "rotation", "z", 0, "-"]);
    });
    animations.push(["mixamorigRightHandThumb2", "rotation", "y", 0, "-"]);
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

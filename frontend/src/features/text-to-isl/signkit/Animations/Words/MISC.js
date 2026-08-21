export const MORNING = (ref) => {
    let animations = [];
    // Right arm rising (Sun) and Left arm flat as horizon

    // 1. Horizon
    animations = [];
    animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", -Math.PI / 2, "-"]);
    // Right arm tucked under
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 2, "+"]);
    ref.animations.push(animations);

    // 2. Rise
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI, "-"]); // Up
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigLeftArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

export const NIGHT = (ref) => {
    let animations = [];
    // Right hand curves over left flat arm (Sun setting)

    // 1. Horizon
    animations = [];
    animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", -Math.PI / 2, "-"]);
    // Right arm up
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI, "-"]);
    ref.animations.push(animations);

    // 2. Set (Curve over)
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 2, "+"]); // "Onto" left arm
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigLeftArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

export const BOOK = (ref) => {
    let animations = [];
    // Palms together then open

    // 1. Palms together
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 2, "+"]);
    animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", -Math.PI / 2, "-"]);
    // Palms face each other (Right palm L, Left palm R)
    animations.push(["mixamorigRightHand", "rotation", "y", -Math.PI / 2, "-"]);
    animations.push(["mixamorigLeftHand", "rotation", "y", Math.PI / 2, "+"]);
    ref.animations.push(animations);

    // 2. Open
    animations = [];
    animations.push(["mixamorigRightHand", "rotation", "y", 0, "+"]); // Palm Up (neutralish)
    animations.push(["mixamorigLeftHand", "rotation", "y", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "x", -Math.PI / 2, "-"]); // Flat
    animations.push(["mixamorigLeftHand", "rotation", "x", -Math.PI / 2, "-"]);
    ref.animations.push(animations);

    // Reset
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigLeftArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "y", 0, "+"]);
    animations.push(["mixamorigLeftHand", "rotation", "y", 0, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigLeftHand", "rotation", "x", 0, "+"]);
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

export const HOUSE = (ref) => {
    let animations = [];
    // Fingertips touch (Roof)

    // 1. Lift arms
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 3, "+"]);
    animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI / 2, "-"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", -Math.PI / 3, "-"]);

    // 2. Angle hands in
    animations.push(["mixamorigRightHand", "rotation", "z", Math.PI / 4, "+"]);
    animations.push(["mixamorigLeftHand", "rotation", "z", -Math.PI / 4, "-"]);
    ref.animations.push(animations);

    // Hold
    ref.animations.push([]);

    // Reset
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigLeftArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigLeftForeArm", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigLeftHand", "rotation", "z", 0, "+"]);
    ref.animations.push(animations);

    if (ref.pending === false) { ref.pending = true; ref.animate(); }
}

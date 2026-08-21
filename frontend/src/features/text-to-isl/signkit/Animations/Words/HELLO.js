export const HELLO = (ref) => {
    let animations = [];

    // STEP 1: Raise hand to the temple (The "Ready" Pose)
    // We move the arm up and the forearm toward the head
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI / 1.8, "-"]); // Raise upper arm
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI / 10, "+"]);   // Keep arm close to body
    animations.push(["mixamorigRightForeArm", "rotation", "y", Math.PI / 3, "-"]); // Bend elbow toward face
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 1.8, "+"]); // Adjust forearm angle
    
    // Flatten the hand (Palm facing forward/out)
    animations.push(["mixamorigRightHand", "rotation", "x", -Math.PI / 4, "-"]);
    ref.animations.push(animations);

    // STEP 2: The Salute Flick (Moving outward)
    // This is the actual "sign" - moving the hand away from the forehead
    animations = [];
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI / 2.5, "-"]); // Slight outward movement
    animations.push(["mixamorigRightHand", "rotation", "y", Math.PI / 6, "+"]);      // Tilt hand slightly out
    ref.animations.push(animations);

    // STEP 3: Hold for a brief second
    animations = [];
    animations.push(["mixamorigRightHand", "rotation", "y", Math.PI / 6, "+"]); 
    ref.animations.push(animations);

    // STEP 4: Reset to Default (Return to side)
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI / 3, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "y", Math.PI / 1.5, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "y", 0, "+"]);
    ref.animations.push(animations);

    if (ref.pending === false) {
        ref.pending = true;
        ref.animate();
    }
}
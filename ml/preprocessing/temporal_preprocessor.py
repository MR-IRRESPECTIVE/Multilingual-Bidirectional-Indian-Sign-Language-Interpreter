import math

def resample_sequence(frames, target_length=30):
    """
    Resamples a sequence of frames to a target length (exactly 30).
    Continuous features (0-83) are linearly interpolated.
    Binary/categorical features (84-85, hand presence) use nearest neighbor.
    
    Args:
        frames: list of lists of floats [N, 86]
        target_length: int, desired number of frames (default 30)
        
    Returns:
        resampled_frames: list of lists of floats [target_length, 86]
    """
    original_length = len(frames)
    
    if original_length < 15 or original_length > 30:
        raise ValueError(f"Sequence length {original_length} is out of bounds (15-30 expected).")
        
    if original_length == target_length:
        for f in frames:
            if len(f) != 86:
                raise ValueError("Feature dimension mismatch, expected 86.")
        return [list(frame) for frame in frames]
        
    resampled_frames = []
    
    for i in range(target_length):
        # Map target position to source timeline
        # target_length - 1 because we want to span exactly from index 0 to original_length - 1
        pos = i * (original_length - 1) / (target_length - 1)
        
        idx_lower = int(math.floor(pos))
        idx_upper = int(math.ceil(pos))
        weight = pos - idx_lower
        
        frame_lower = frames[idx_lower]
        frame_upper = frames[idx_upper]
        
        if len(frame_lower) != 86 or len(frame_upper) != 86:
            raise ValueError(f"Feature dimension mismatch, expected 86.")
            
        new_frame = []
        
        for j in range(86):
            val_lower = frame_lower[j]
            val_upper = frame_upper[j]
            
            if val_lower is None or math.isnan(val_lower) or math.isinf(val_lower) or \
               val_upper is None or math.isnan(val_upper) or math.isinf(val_upper):
                raise ValueError(f"Invalid value encountered at frame index {j}: NaN or Infinity")
                
            if j < 84:
                # Continuous landmark features: linear interpolation
                interpolated = val_lower * (1.0 - weight) + val_upper * weight
                new_frame.append(float(interpolated))
            else:
                # Hand presence indicators (84, 85): nearest neighbor to prevent fractional presence
                nearest = val_upper if weight >= 0.5 else val_lower
                new_frame.append(float(nearest))
                
        resampled_frames.append(new_frame)
        
    return resampled_frames

def validate_and_preprocess(frames, target_length=30):
    """
    Validates the input frames and preprocesses them temporally.
    Throws ValueError with clear messages if validation fails.
    """
    if not isinstance(frames, list) or len(frames) == 0:
        raise ValueError("Input frames must be a non-empty list.")
        
    return resample_sequence(frames, target_length)

import json
import sys
import math
from collections import Counter

def validate_dataset(filepath):
    try:
        with open(filepath, "r") as f:
            data = json.load(f)
    except Exception as e:
        print(f"FAIL: Could not read file {filepath}: {e}")
        return False
    
    if not isinstance(data, dict) or "dataset" not in data:
        print("FAIL: Missing 'dataset' key or root is not a dict.")
        return False
        
    global_feature_gen = data.get("metadata", {}).get("feature_generation", "unknown")
    
    samples = data["dataset"]
    total_samples = len(samples)
    
    signs = Counter()
    signers = Counter()
    invalid_samples = 0
    missing_fields = 0
    nan_infinity_count = 0
    requires_preprocessing = 0
    shape_errors = 0
    generation_mixing = 0
    
    sample_ids = set()
    duplicate_ids = 0
    
    sequences_seen = set()
    duplicate_sequences = 0
    
    signer_map = {}
    signer_conflicts = 0
    
    for sample in samples:
        if not all(k in sample for k in ["sample_id", "sign_id", "signer_id", "frames"]):
            missing_fields += 1
            invalid_samples += 1
            continue
        
        s_id = sample["sample_id"]
        if s_id in sample_ids:
            duplicate_ids += 1
            invalid_samples += 1
        sample_ids.add(s_id)
        
        sign_id = sample["sign_id"]
        signs[sign_id] += 1
        
        signer_id = sample["signer_id"]
        signers[signer_id] += 1
        
        signer_name = sample.get("signer_name")
        if signer_name:
            if signer_id in signer_map and signer_map[signer_id] != signer_name:
                signer_conflicts += 1
                invalid_samples += 1
            else:
                signer_map[signer_id] = signer_name
        
        # mixing generation?
        sample_gen = sample.get("feature_generation")
        if sample_gen and sample_gen != global_feature_gen:
            generation_mixing += 1
            invalid_samples += 1
        
        frames = sample["frames"]
        if not (15 <= len(frames) <= 30):
            shape_errors += 1
            invalid_samples += 1
        else:
            if len(frames) != 30:
                requires_preprocessing += 1
                
            wrong_dim = False
            has_nan = False
            for frame in frames:
                if len(frame) != 86:
                    wrong_dim = True
                for v in frame:
                    if v is None or math.isnan(v) or math.isinf(v):
                        has_nan = True
            if wrong_dim:
                shape_errors += 1
                invalid_samples += 1
            if has_nan:
                nan_infinity_count += 1
                invalid_samples += 1
            
            # Check duplicate sequence (by min_hashing or just tuple-izing a sample of frames)
            # Use safe indices for frames
            seq_hash = hash(tuple(frames[0] + frames[len(frames)//2] + frames[-1]))
            if seq_hash in sequences_seen:
                duplicate_sequences += 1
                # Not counted as strictly invalid here, but flagged
            else:
                sequences_seen.add(seq_hash)

    passed = (
        invalid_samples == 0 and 
        missing_fields == 0 and 
        shape_errors == 0 and 
        nan_infinity_count == 0 and 
        duplicate_ids == 0 and 
        signer_conflicts == 0 and 
        generation_mixing == 0 and
        global_feature_gen == "v2-86"
    )
    
    print("\nDATASET VALIDATION REPORT")
    print("-------------------------")
    print(f"Total samples: {total_samples}\n")
    
    print("Classes:")
    if not signs:
        print("  (None)")
    min_class = float('inf')
    max_class = 0
    for s, c in signs.most_common():
        print(f"  {s}: {c}")
        min_class = min(min_class, c)
        max_class = max(max_class, c)
    print(f"\n Class imbalance: min {min_class if signs else 0}, max {max_class}\n")
    
    print("Signers:")
    for s, c in signers.most_common():
        print(f"  {s}: {c}")
    print("")
    
    print(f"Feature generation: {global_feature_gen}\n")
    print(f"Canonical Target Frames: 30")
    print(f"Requires Temporal Preprocessing: {requires_preprocessing}\n")
    
    print(f"Invalid samples: {invalid_samples}")
    print(f"  - Missing fields: {missing_fields}")
    print(f"  - Wrong shape (not 15-30x86): {shape_errors}")
    print(f"  - NaN/Infinity: {nan_infinity_count}")
    print(f"  - Mixed 42/86 generation: {generation_mixing}")
    print(f"Duplicate sample IDs: {duplicate_ids}")
    print(f"Duplicate sequences: {duplicate_sequences}")
    print(f"Signer conflicts: {signer_conflicts}\n")
    
    print(f"Status: {'PASS' if passed else 'FAIL'}\n")
    
    return passed

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python dataset_validator.py <path-to-json>")
        sys.exit(1)
    filepath = sys.argv[1]
    passed = validate_dataset(filepath)
    sys.exit(0 if passed else 1)

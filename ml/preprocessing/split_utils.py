import numpy as np
from collections import defaultdict

def create_signer_aware_split(samples, val_ratio=0.1, test_ratio=0.1):
    """
    Creates train, val, and test splits ensuring that signers in test/val 
    are kept isolated from train if possible. If the dataset has too few signers,
    it attempts a best-effort split and logs warnings.
    
    Returns lists of samples for (train, val, test).
    """
    signer_samples = defaultdict(list)
    for sample in samples:
        signer_samples[sample['signer_id']].append(sample)
        
    signers = list(signer_samples.keys())
    # Sort signers by sample count ASCENDING for better bin packing without overshooting
    signers.sort(key=lambda s: len(signer_samples[s]))
    
    total_samples = len(samples)
    val_target = int(total_samples * val_ratio)
    test_target = int(total_samples * test_ratio)
    
    train_split, val_split, test_split = [], [], []
    val_count, test_count = 0, 0
    
    # We assign signers to test/val until they reach their targets.
    for signer in signers:
        group = signer_samples[signer]
        if test_count < test_target and len(signers) > 3:
            test_split.extend(group)
            test_count += len(group)
        elif val_count < val_target and len(signers) > 3:
            val_split.extend(group)
            val_count += len(group)
        else:
            train_split.extend(group)
            
    # Fallback if too few signers (signer leakage allowed)
    if len(signers) <= 3:
        print("WARNING: Too few signers for isolated splitting. Falling back to random splitting (signer leakage will occur).")
        np.random.seed(42)
        shuffled = list(samples)
        np.random.shuffle(shuffled)
        
        test_end = test_target
        val_end = test_end + val_target
        
        test_split = shuffled[:test_end]
        val_split = shuffled[test_end:val_end]
        train_split = shuffled[val_end:]
        
    return train_split, val_split, test_split

import os
import json
import glob
from datetime import datetime
from ml.preprocessing.temporal_preprocessor import validate_and_preprocess

def prepare_dataset(export_dir, output_dir, dry_run=False):
    json_files = glob.glob(os.path.join(export_dir, '*.json'))
    
    unique_samples = {}
    
    stats = {
        'raw_records': 0,
        'unique_records': 0,
        'accepted': 0,
        'rejected': 0,
        'resampled': 0,
        'already_30': 0,
        '29_frames': 0,
        '28_frames': 0,
        '20_27_frames': 0,
        'lt_15_frames': 0
    }
    
    manifest = []
    
    for jf in json_files:
        try:
            with open(jf, 'r') as f:
                data = json.load(f)
        except Exception:
            continue
            
        dataset = data.get('dataset', data) if isinstance(data, dict) else data
        if not isinstance(dataset, list):
            continue
            
        for sample in dataset:
            stats['raw_records'] += 1
            s_id = sample.get('sample_id')
            
            if sample.get('feature_generation') != "v2-86":
                stats['rejected'] += 1
                continue
                
            if not s_id or s_id in unique_samples:
                continue
                
            unique_samples[s_id] = sample
            stats['unique_records'] += 1
            
            frames = sample.get('frames', [])
            fc = len(frames)
            
            if fc == 30:
                stats['already_30'] += 1
            elif fc == 29:
                stats['29_frames'] += 1
            elif fc == 28:
                stats['28_frames'] += 1
            elif 20 <= fc <= 27:
                stats['20_27_frames'] += 1
            elif fc < 15:
                stats['lt_15_frames'] += 1
                
            try:
                processed_frames = validate_and_preprocess(frames, target_length=30)
                stats['accepted'] += 1
                if fc != 30:
                    stats['resampled'] += 1
                    
                sample['frames'] = processed_frames
                sample['frame_count'] = 30
                
                manifest.append({
                    "sample_id": s_id,
                    "sign_label": sample.get('sign_label'),
                    "signer_id": sample.get('signer_id'),
                    "original_frame_count": fc,
                    "processed_frame_count": 30,
                    "feature_dimension": 86,
                    "preprocessing": "temporal_linear_resampling_v1",
                    "status": "valid"
                })
                
            except ValueError as e:
                stats['rejected'] += 1
                manifest.append({
                    "sample_id": s_id,
                    "sign_label": sample.get('sign_label'),
                    "signer_id": sample.get('signer_id'),
                    "original_frame_count": fc,
                    "processed_frame_count": None,
                    "feature_dimension": len(frames[0]) if frames else 0,
                    "preprocessing": None,
                    "status": f"invalid: {e}"
                })

    print("--- DATASET PREPARATION REPORT ---")
    print(f"Raw records: {stats['raw_records']}")
    print(f"Unique records: {stats['unique_records']}")
    print(f"Records accepted: {stats['accepted']}")
    print(f"Records rejected: {stats['rejected']}")
    print(f"Records requiring temporal resampling: {stats['resampled']}")
    print(f"Already 30-frame records: {stats['already_30']}")
    print(f"29-frame records: {stats['29_frames']}")
    print(f"28-frame records: {stats['28_frames']}")
    print(f"20-27-frame records: {stats['20_27_frames']}")
    print(f"<15-frame records: {stats['lt_15_frames']}")
    
    if not dry_run:
        os.makedirs(output_dir, exist_ok=True)
        
        valid_samples = [unique_samples[m["sample_id"]] for m in manifest if m["status"] == "valid"]
        
        output_data = {
            "metadata": {
                "dataset_version": "1.1",
                "creation_time": datetime.utcnow().isoformat() + "Z",
                "feature_generation": "v2-86",
                "feature_dimension": 86,
                "frame_count": 30,
                "total_samples": len(valid_samples),
                "description": "Derived training dataset with 30-frame temporal resampling and deduplication."
            },
            "dataset": valid_samples
        }
        
        dataset_path = os.path.join(output_dir, "training_dataset.json")
        with open(dataset_path, "w") as f:
            json.dump(output_data, f, indent=2)
            
        manifest_path = os.path.join(output_dir, "preprocessing_manifest.json")
        with open(manifest_path, "w") as f:
            json.dump(manifest, f, indent=2)
            
        print(f"\nSaved derived dataset to {dataset_path}")
        print(f"Saved manifest to {manifest_path}")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--export-dir", default="datasets/pilot/exports")
    parser.add_argument("--output-dir", default="datasets/training")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    
    prepare_dataset(args.export_dir, args.output_dir, args.dry_run)

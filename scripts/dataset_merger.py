import json
import sys
import argparse
from dataset_validator import validate_dataset

def merge_datasets(input_files, output_file):
    all_samples = []
    seen_sample_ids = set()
    global_signer_map = {}
    global_feature_gen = "v2-86"
    
    for f in input_files:
        print(f"Validating {f}...")
        if not validate_dataset(f):
            print(f"\n[abort] {f} failed validation. All input datasets must be 100% valid.")
            sys.exit(1)
        
        with open(f, "r") as file:
            data = json.load(file)
            
        for sample in data["dataset"]:
            sample_id = sample["sample_id"]
            if sample_id in seen_sample_ids:
                print(f"\n[abort] Cross-dataset duplicate sample ID found: {sample_id}")
                sys.exit(1)
            seen_sample_ids.add(sample_id)
            
            signer_id = sample["signer_id"]
            signer_name = sample.get("signer_name")
            if signer_name:
                if signer_id in global_signer_map and global_signer_map[signer_id] != signer_name:
                    print(f"\n[abort] Cross-dataset signer conflict for {signer_id}: "
                          f"\"+{global_signer_map[signer_id]}\" vs \"+{signer_name}\"")
                    sys.exit(1)
                global_signer_map[signer_id] = signer_name
            
            all_samples.append(sample)
    
    output_data = {
        "metadata": {
            "feature_generation": global_feature_gen,
            "feature_dimension": 86,
            "frame_count": 30,
            "total_samples": len(all_samples)
        },
        "dataset": all_samples
    }
    
    with open(output_file, "w") as out_file:
        json.dump(output_data, out_file, indent=2)
        
    print(f"\n[SUCCESS] Merged {len(input_files)} dataset(s) into {output_file}.")
    print(f"Total samples: {len(all_samples)}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Merge multiple Isl datasets into one, validating each.")
    parser.add_argument("-i", "--input", nargs="+", required=True, help="One or more input JSON files")
    parser.add_argument("-o", "--output", required=True, help="Output JSON file")
    
    args = parser.parse_args()
    merge_datasets(args.input, args.output)

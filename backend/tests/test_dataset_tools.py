import os
import json
import tempfile
import sys

# Add scripts to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../scripts")))
from dataset_validator import validate_dataset

def create_valid_dataset():
    return {
        "metadata": {
            "feature_generation": "v2-86",
            "feature_dimension": 86,
            "frame_count": 30
        },
        "dataset": [
            {
                "sample_id": "s1",
                "sign_id": "hello",
                "signer_id": "u5",
                "signer_name": "User 5",
                "frames": [[0.0]*86 for _ in range(30)]
            }
        ]
    }

def test_valid_dataset():
    data = create_valid_dataset()
    with tempfile.NamedTemporaryFile(mode='w+', suffix=".json", delete=False) as f:
        json.dump(data, f)
        filepath = f.name
    
    try:
        assert validate_dataset(filepath) == True
    finally:
        os.unlink(filepath)

def test_invalid_shape():
    data = create_valid_dataset()
    data["dataset"][0]["frames"] = [[0.0]*85 for _ in range(30)]
    with tempfile.NamedTemporaryFile(mode='w+', suffix=".json", delete=False) as f:
        json.dump(data, f)
        filepath = f.name
    
    try:
        assert validate_dataset(filepath) == False
    finally:
        os.unlink(filepath)

def test_duplicate_id():
    data = create_valid_dataset()
    data["dataset"].append(data["dataset"][0])
    with tempfile.NamedTemporaryFile(mode='w+', suffix=".json", delete=False) as f:
        json.dump(data, f)
        filepath = f.name
    
    try:
        assert validate_dataset(filepath) == False
    finally:
        os.unlink(filepath)

import pytest
import math
from ml.preprocessing.temporal_preprocessor import validate_and_preprocess

def test_preprocess_30_frames():
    frames = [[0.0] * 86 for _ in range(30)]
    res = validate_and_preprocess(frames)
    assert len(res) == 30
    assert len(res[0]) == 86

def test_preprocess_29_frames():
    frames = [[1.0] * 86 for _ in range(29)]
    res = validate_and_preprocess(frames)
    assert len(res) == 30
    assert len(res[0]) == 86
    assert res[0][0] == 1.0

def test_preprocess_15_frames():
    frames = [[0.5] * 86 for _ in range(15)]
    res = validate_and_preprocess(frames)
    assert len(res) == 30

def test_preprocess_invalid_length_low():
    frames = [[0.0] * 86 for _ in range(14)]
    with pytest.raises(ValueError, match="bounds"):
        validate_and_preprocess(frames)

def test_preprocess_invalid_length_high():
    frames = [[0.0] * 86 for _ in range(31)]
    with pytest.raises(ValueError, match="bounds"):
        validate_and_preprocess(frames)

def test_preprocess_wrong_dimension():
    frames = [[0.0] * 85 for _ in range(29)]
    with pytest.raises(ValueError, match="dimension"):
        validate_and_preprocess(frames)

def test_preprocess_nan():
    frames = [[0.0] * 86 for _ in range(29)]
    frames[10][0] = math.nan
    with pytest.raises(ValueError, match="NaN"):
        validate_and_preprocess(frames)

def test_binary_hand_presence():
    frames = [[0.0] * 86 for _ in range(15)]
    for i in range(15):
        # alternate hand presence
        frames[i][84] = 1.0 if i % 2 == 0 else 0.0
    
    res = validate_and_preprocess(frames)
    assert len(res) == 30
    for i in range(30):
        # it should always be exactly 1.0 or 0.0, never fractional
        assert res[i][84] in (0.0, 1.0)

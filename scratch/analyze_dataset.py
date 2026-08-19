import csv
import numpy as np

def analyze_csv(path):
    rows = []
    with open(path, 'r') as f:
        reader = csv.reader(f)
        for row in reader:
            if row:
                rows.append([float(x) for x in row])
    data = np.array(rows)
    classes = data[:, 0].astype(int)
    features = data[:, 1:]
    
    unique_rows = np.unique(data, axis=0)
    duplicates = len(data) - len(unique_rows)
    
    unique_classes, counts = np.unique(classes, return_counts=True)
    class_balance = dict(zip(unique_classes, counts))
    
    return {
        'total': len(data),
        'duplicates': duplicates,
        'unique_total': len(unique_rows),
        'features_shape': features.shape,
        'features_min': float(np.min(features)),
        'features_max': float(np.max(features)),
        'class_balance': class_balance,
        'raw_data': data
    }

p1 = 'research/repository-audit/Bidirectional-Indian-Sign-Language-Translator/Indian-Sign-Language-to-Text/model/keypoint_classifier/keypoint.csv'
p2 = 'research/repository-audit/Bidirectional-Indian-Sign-Language-Translator/Indian-Sign-Language-to-Text/model/keypoint_classifier/keypoint_3.csv'
l_path = 'research/repository-audit/Bidirectional-Indian-Sign-Language-Translator/Indian-Sign-Language-to-Text/model/keypoint_classifier/keypoint_classifier_label.csv'

with open(l_path, 'r') as f:
    labels = [row[0] for row in csv.reader(f) if row]

print('=== LABEL MAP ===')
for i, l in enumerate(labels):
    print(f'{i}: {l}')

res1 = analyze_csv(p1)
res2 = analyze_csv(p2)

print('\n=== KEYPOINT.CSV ===')
print(f'Total rows: {res1["total"]}')
print(f'Unique rows: {res1["unique_total"]}')
print(f'Duplicates: {res1["duplicates"]}')
print(f'Features shape: {res1["features_shape"]}')
print(f'Feature min/max: {res1["features_min"]:.4f} / {res1["features_max"]:.4f}')
print(f'Class balance: {res1["class_balance"]}')

print('\n=== KEYPOINT_3.CSV ===')
print(f'Total rows: {res2["total"]}')
print(f'Unique rows: {res2["unique_total"]}')
print(f'Duplicates: {res2["duplicates"]}')
print(f'Features shape: {res2["features_shape"]}')
print(f'Feature min/max: {res2["features_min"]:.4f} / {res2["features_max"]:.4f}')
print(f'Class balance: {res2["class_balance"]}')

# Overlap analysis
set1 = set([tuple(row) for row in res1['raw_data']])
set2 = set([tuple(row) for row in res2['raw_data']])
overlap = set1.intersection(set2)
print(f'\n=== OVERLAP ===')
print(f'Exact matching rows between files: {len(overlap)}')

import json, zipfile

path = 'research/repository-audit/Bidirectional-Indian-Sign-Language-Translator/Indian-Sign-Language-to-Text/model/keypoint_classifier/keypoint_classifier (5).keras'
with zipfile.ZipFile(path, 'r') as z:
    config = json.loads(z.read('config.json'))
    layers = config['config']['layers']
    for i, layer in enumerate(layers):
        cls = layer['class_name']
        cfg = layer['config']
        if cls == 'Dense':
            units = cfg['units']
            activation = cfg['activation']
            print(f'Layer {i}: Dense units={units} activation={activation}')
        elif cls == 'Dropout':
            rate = cfg['rate']
            print(f'Layer {i}: Dropout rate={rate}')
        elif cls == 'InputLayer':
            shape = cfg.get('batch_shape', cfg.get('batch_input_shape'))
            print(f'Layer {i}: InputLayer shape={shape}')
        elif cls == 'BatchNormalization':
            print(f'Layer {i}: BatchNormalization')
        else:
            print(f'Layer {i}: {cls}')

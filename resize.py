import os
from PIL import Image

dir_name = '元画像'
new_dir_name = 'images'

# サポートされる画像ファイル形式の拡張子リスト
image_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.gif']

files = os.listdir(dir_name)

for file in files:
    # ファイルの拡張子をチェック
    if os.path.splitext(file)[1].lower() in image_extensions:
        img = Image.open(os.path.join(dir_name, file)) 
        img_resize = img.resize((480, 480 * img.height // img.width))
        
        # 新しいディレクトリが存在しない場合は作成
        if not os.path.exists(new_dir_name):
            os.makedirs(new_dir_name)

        img_resize.save(os.path.join(new_dir_name, file))

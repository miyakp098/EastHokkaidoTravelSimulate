import os
from PIL import Image

dir_name = '元画像'
new_dir_name = 'images'

files = os.listdir(dir_name)

for file in files:
    img = Image.open(os.path.join(dir_name, file)) 
    img_resize = img.resize((640, 640 * img.height // img.width))
    img_resize.save(os.path.join(new_dir_name, file))
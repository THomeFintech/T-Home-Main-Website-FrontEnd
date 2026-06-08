import os
import random
import json
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import glob

# Configuration
LOGOS_DIR = r"."
OUTPUT_DIR = r"..\bank_logo_dataset"
NUM_IMAGES = 4000
IMG_W, IMG_H = 640, 160 # Header area shape

# Ensure output structure
for split in ['train', 'val', 'test']:
    os.makedirs(os.path.join(OUTPUT_DIR, 'images', split), exist_ok=True)
    os.makedirs(os.path.join(OUTPUT_DIR, 'labels', split), exist_ok=True)

# Load logos and map classes
logo_files = glob.glob(os.path.join(LOGOS_DIR, "*.png")) + glob.glob(os.path.join(LOGOS_DIR, "*.jpg"))
# Exclude the script itself and the downloader
logo_files = [f for f in logo_files if "generate_dataset.py" not in f and "download_logos.py" not in f]

# Define bank name mapping from filename
def get_bank_name(filename):
    name = os.path.basename(filename).lower()
    mapping = {
        "axis": "Axis",
        "baroda": "BoB",
        "india": "BankOfIndia",
        "canara": "Canara",
        "central": "CentralBank",
        "city union": "CityUnion",
        "federal": "Federal",
        "hdfc": "HDFC",
        "idfc": "IDFCFirst",
        "indian bank": "IndianBank",
        "indusind": "IndusInd",
        "kotak": "Kotak",
        "punjab national": "PNB",
        "state bank": "SBI",
        "union bank": "Union",
        "bandhan": "Bandhan",
        "icici": "ICICI",
        "karur": "KarurVysya",
        "uco": "UCO",
        "punjab & sind": "PunjabSind",
        "yes": "YesBank",
        "south indian": "SouthIndian",
        "au small": "AU",
        "equitas": "Equitas",
        "ujjivan": "Ujjivan",
        "paytm": "Paytm",
        "airtel": "Airtel",
        "india post": "IndiaPost",
        "telanagana": "TelanaganaGremeena"
    }
    for key, val in mapping.items():
        if key in name:
            return val
    return "Unknown"

bank_to_logo = {}
for f in logo_files:
    name = get_bank_name(f)
    if name != "Unknown":
        bank_to_logo[name] = f

classes = sorted(list(bank_to_logo.keys()))
class_to_id = {name: i for i, name in enumerate(classes)}

# Save classes.txt
with open(os.path.join(OUTPUT_DIR, "classes.txt"), "w") as f:
    for cls in classes:
        f.write(f"{cls}\n")

# Synthetic data generation helpers
def add_noise(image):
    array = np.array(image).astype(np.float32)
    noise = np.random.normal(0, 5, array.shape)
    array = np.clip(array + noise, 0, 255).astype(np.uint8)
    return Image.fromarray(array)

def apply_blur(image):
    if random.random() < 0.3:
        return image.filter(ImageFilter.GaussianBlur(radius=random.uniform(0, 1)))
    return image

def apply_brightness(image):
    enhancer = ImageEnhance.Brightness(image)
    return enhancer.enhance(random.uniform(0.8, 1.2))

def generate_header_image(bank_name, logo_path):
    # Base white background
    bg = Image.new('RGB', (IMG_W, IMG_H), color=(255, 255, 255))
    draw = ImageDraw.Draw(bg)
    
    # Load and resize logo
    logo = Image.open(logo_path).convert("RGBA")
    
    # Randomly scale logo
    max_h = int(IMG_H * 0.7)
    scale = random.uniform(0.4, 0.8)
    new_h = int(max_h * scale)
    aspect = logo.width / logo.height
    new_w = int(new_h * aspect)
    logo = logo.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Positioning
    pos_types = ["left", "center", "right"]
    pos_type = random.choice(pos_types)
    
    if pos_type == "left":
        x = random.randint(10, 50)
    elif pos_type == "center":
        x = (IMG_W - new_w) // 2
    else:
        x = IMG_W - new_w - random.randint(10, 50)
        
    y = (IMG_H - new_h) // 2
    
    # Paste logo (using itself as mask for transparency)
    bg.paste(logo, (x, y), logo)
    
    # Bbox in YOLO format
    center_x = (x + new_w / 2) / IMG_W
    center_y = (y + new_h / 2) / IMG_H
    w = new_w / IMG_W
    h = new_h / IMG_H
    
    # Apply augmentations
    bg = apply_brightness(bg)
    bg = add_noise(bg)
    # bg = apply_blur(bg) # Skipping blur for speed/simplicity or use if needed
    
    return bg, [class_to_id[bank_name], center_x, center_y, w, h]

# Main loop
images_info = []
summary = {"Total Images": 0, "Classes": len(classes), "Splits": {"train": 0, "val": 0, "test": 0}}

print(f"Generating {NUM_IMAGES} images for {len(classes)} classes...")

for i in range(NUM_IMAGES):
    bank_name = random.choice(classes)
    logo_path = bank_to_logo[bank_name]
    
    img, label = generate_header_image(bank_name, logo_path)
    
    # Split
    rand = random.random()
    if rand < 0.7:
        split = "train"
    elif rand < 0.9:
        split = "val"
    else:
        split = "test"
        
    img_name = f"{bank_name.replace(' ', '_')}_{i:04d}.jpg"
    lbl_name = f"{bank_name.replace(' ', '_')}_{i:04d}.txt"
    
    img.save(os.path.join(OUTPUT_DIR, 'images', split, img_name))
    with open(os.path.join(OUTPUT_DIR, 'labels', split, lbl_name), "w") as f:
        f.write(f"{label[0]} {label[1]:.6f} {label[2]:.6f} {label[3]:.6f} {label[4]:.6f}\n")
        
    summary["Splits"][split] += 1
    summary["Total Images"] += 1
    
    if (i + 1) % 500 == 0:
        print(f"Generated {i+1} images...")

# Save dataset.yaml
yaml_content = f"""
path: ../
train: images/train
val: images/val
test: images/test

nc: {len(classes)}
names:
"""
for name in classes:
    yaml_content += f"  - {name}\n"

with open(os.path.join(OUTPUT_DIR, "dataset.yaml"), "w") as f:
    f.write(yaml_content)

# Save summary
with open(os.path.join(OUTPUT_DIR, "dataset_summary.json"), "w") as f:
    json.dump(summary, f, indent=2)

print("Done! Dataset generated in 'bank_logo_dataset' folder.")

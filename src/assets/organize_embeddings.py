import os
import shutil
import glob

# Configuration
LOGOS_DIR = r"."
EMBEDDINGS_DIR = r"..\logo_embeddings"

# Removed previous directories to avoid confusion if rerunning
if os.path.exists(EMBEDDINGS_DIR):
    shutil.rmtree(EMBEDDINGS_DIR)

# Precise Mapping (more specific keys first)
mapping = {
    "axis": "Axis",
    "bank of baroda": "BoB",
    "bank of india": "BankOfIndia",
    "canara": "Canara",
    "central bank of india": "CentralBank",
    "city union": "CityUnion",
    "federal": "Federal",
    "hdfc": "HDFC",
    "idfc": "IDFCFirst",
    "indian bank": "IndianBank",
    "indusind": "IndusInd",
    "kotak": "Kotak",
    "punjab national": "PNB",
    "state bank of india": "SBI",
    "union bank of india": "Union",
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

logo_files = glob.glob(os.path.join(LOGOS_DIR, "*.png")) + glob.glob(os.path.join(LOGOS_DIR, "*.jpg"))
logo_files = [f for f in logo_files if "generate_dataset.py" not in f and "download_logos.py" not in f and "organize_embeddings.py" not in f]

for f in logo_files:
    fname = os.path.basename(f).lower()
    bank_name = "Unknown"
    # Sort keys by length descending to match most specific first
    sorted_keys = sorted(mapping.keys(), key=len, reverse=True)
    for key in sorted_keys:
        if key in fname:
            bank_name = mapping[key]
            break
    
    if bank_name != "Unknown":
        target_dir = os.path.join(EMBEDDINGS_DIR, bank_name)
        os.makedirs(target_dir, exist_ok=True)
        shutil.copy(f, os.path.join(target_dir, os.path.basename(f)))
        print(f"Copied {f} to {target_dir}")

print("Logo embeddings folder organized correctly.")

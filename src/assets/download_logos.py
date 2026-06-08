import requests
import os

logos = {
    "UCO Bank logo.png": "https://assets.stickpng.com/images/627ccfc31b2e263b45696ac7.png",
    "Punjab & Sind Bank logo.png": "https://images.seeklogo.com/logo-png/30/1/punjab-sind-bank-logo-png_seeklogo-304223.png",
    "Yes Bank logo.png": "https://upload.wikimedia.org/wikipedia/commons/d/d1/Yes_Bank_Logo-01.png",
    "South Indian Bank logo.png": "https://upload.wikimedia.org/wikipedia/commons/8/8b/South_indian_bank_logo.png",
    "AU Small Finance Bank logo.png": "https://pnghdpro.com/wp-content/themes/pnghdpro/download/social-media-and-brands/au-small-finance-bank-logo.png",
    "Equitas Small Finance Bank logo.png": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Equitas-logo.png",
    "Ujjivan Small Finance Bank logo.png": "https://pnghdpro.com/wp-content/themes/pnghdpro/download/social-media-and-brands/ujjivan-small-finance-bank-logo.png",
    "Paytm Payments Bank logo.png": "https://images.seeklogo.com/logo-png/52/1/paytm-payments-bank-logo-png_seeklogo-523726.png",
    "Airtel Payments Bank logo.png": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Airtel_Payments_Bank_logo.svg/2560px-Airtel_Payments_Bank_logo.svg.png",
    "India Post Payments Bank logo.png": "https://pnghdpro.com/wp-content/themes/pnghdpro/download/social-media-and-brands/india-post-payments-bank-logo.png"
}

output_dir = r"."

for filename, url in logos.items():
    filepath = os.path.join(output_dir, filename)
    try:
        print(f"Downloading {filename}...")
        response = requests.get(url, stream=True, timeout=10, headers={'User-Agent': 'Mozilla/5.0'})
        if response.status_code == 200:
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            print(f"Saved {filename}")
        else:
            print(f"Failed to download {filename}: Status {response.status_code}")
    except Exception as e:
        print(f"Error downloading {filename}: {e}")

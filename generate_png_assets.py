import os
import math
from PIL import Image, ImageDraw, ImageFont

public_dir = "/Users/akash/freelance/SIH/frontend/public"
os.makedirs(public_dir, exist_ok=True)

def draw_shield(draw, cx, cy, w, h, bg_color=(37, 99, 235), border_color=(56, 189, 248), border_w=4):
    # Shield polygon points
    top_y = cy - h // 2
    bot_y = cy + h // 2
    left_x = cx - w // 2
    right_x = cx + w // 2
    mid_y = cy + int(h * 0.15)
    
    shield_pts = [
        (cx, top_y),
        (right_x, top_y + int(h * 0.1)),
        (right_x, mid_y),
        (cx, bot_y),
        (left_x, mid_y),
        (left_x, top_y + int(h * 0.1)),
    ]
    draw.polygon(shield_pts, fill=bg_color, outline=border_color, width=border_w)
    
    # Inner inset shield
    inset = max(3, int(w * 0.12))
    inner_pts = [
        (cx, top_y + inset),
        (right_x - inset, top_y + int(h * 0.1) + int(inset * 0.6)),
        (right_x - inset, mid_y - int(inset * 0.4)),
        (cx, bot_y - inset),
        (left_x + inset, mid_y - int(inset * 0.4)),
        (left_x + inset, top_y + int(h * 0.1) + int(inset * 0.6)),
    ]
    draw.polygon(inner_pts, fill=(11, 19, 43), outline=(56, 189, 248), width=max(1, border_w // 2))
    
    # Circuits
    draw.line([(cx, top_y + inset + 4), (cx, cy - 10)], fill=(96, 165, 250), width=max(2, border_w // 2))
    draw.line([(cx, cy + 10), (cx, bot_y - inset - 4)], fill=(96, 165, 250), width=max(2, border_w // 2))
    
    # Diamond Core
    d_size = int(w * 0.18)
    diamond = [
        (cx, cy - d_size),
        (cx + d_size, cy),
        (cx, cy + d_size),
        (cx - d_size, cy)
    ]
    draw.polygon(diamond, fill=(52, 211, 153), outline=(167, 243, 208), width=max(1, border_w // 2))
    
    # Eye circle
    r = max(2, int(w * 0.05))
    draw.ellipse([(cx - r, cy - r), (cx + r, cy + r)], fill=(255, 255, 255))

def generate_favicon(size, filename):
    img = Image.new("RGBA", (size, size), (15, 23, 42, 255))
    draw = ImageDraw.Draw(img)
    
    # Rounded container
    corner_r = int(size * 0.22)
    draw.rounded_rectangle([(0, 0), (size - 1, size - 1)], radius=corner_r, fill=(15, 23, 42, 255), outline=(30, 41, 59, 255), width=max(1, size // 32))
    
    # Shield
    cx, cy = size // 2, size // 2
    sw = int(size * 0.65)
    sh = int(size * 0.72)
    bw = max(1, size // 24)
    draw_shield(draw, cx, cy, sw, sh, bg_color=(29, 78, 216), border_color=(56, 189, 248), border_w=bw)
    
    img.save(os.path.join(public_dir, filename), "PNG")
    print(f"Generated {filename} ({size}x{size})")

def generate_logo_png():
    width, height = 840, 160
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw Emblem on the left
    cx, cy = 90, 80
    draw_shield(draw, cx, cy, 90, 100, bg_color=(37, 99, 235), border_color=(56, 189, 248), border_w=4)
    
    # Draw Text
    try:
        font_title = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 52)
        font_sub = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 17)
    except Exception:
        font_title = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        
    draw.text((165, 38), "AI GUARDIAN", fill=(15, 23, 42, 255), font=font_title)
    draw.text((168, 98), "CYBER RISK QUANTIFICATION & INVESTMENT OPTIMIZATION", fill=(100, 116, 139, 255), font=font_sub)
    
    # Version badge
    draw.rounded_rectangle([(730, 52), (810, 84)], radius=6, fill=(241, 245, 249, 255), outline=(203, 213, 225, 255), width=2)
    draw.text((752, 60), "v1.0", fill=(51, 65, 85, 255), font=font_sub)
    
    img.save(os.path.join(public_dir, "logo.png"), "PNG")
    print("Generated logo.png (840x160)")

generate_favicon(32, "favicon-32x32.png")
generate_favicon(64, "favicon.png")
generate_favicon(192, "android-chrome-192x192.png")
generate_favicon(512, "android-chrome-512x512.png")
generate_logo_png()

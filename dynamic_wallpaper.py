import ctypes
import os
import sys

directory = os.environ["USERPROFILE"] + "\\Pictures" # change to your wallpaper's directory
imagePath = directory + "wallpaper.jpg" # change to your wallpaper name

def changeBG(imagePath):
    SPI_SETDESKWALLPAPER = 20
    ctypes.windll.user32.SystemParametersInfoW(SPI_SETDESKWALLPAPER, 0, imagePath , 0)
    return;

if __name__ == "__main__":
    if len(sys.argv) != 2:
        img = imagePath or sys.argv[1]
        print("Invalid arguments")
        sys.exit(1)
    changeBG(imagePath)

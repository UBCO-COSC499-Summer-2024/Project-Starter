import cv2
import os
import numpy as np

def get_first_name_filled(image_path):
    # Check if the file exists
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Error: File '{image_path}' not found.")

    # Load the image
    image = cv2.imread(image_path)

    # Check if the image was loaded successfully
    if image is None:
        raise ValueError(f"Error: Unable to load image '{image_path}'.")

    # Get the image dimensions
    height, width, channels = image.shape

    # Crop the image to remove the top 1/5
    # cropped_image = image[int(height // 1.6):height, width // 6:(width - (width // 9))] Last name
    cropped_image = image[int(height // 3):int(height // 1.6), width // 7:(width - (width // 9))]

    # Convert to grayscale
    gray = cv2.cvtColor(cropped_image, cv2.COLOR_BGR2GRAY)

    # Apply Median Blur to reduce noise
    median_blurred = cv2.medianBlur(gray, 5)

    # Apply Bilateral Filtering to reduce noise while preserving edges
    bilateral_filtered = cv2.bilateralFilter(median_blurred, 9, 75, 75)

    # Apply thresholding
    _, contourThresh = cv2.threshold(bilateral_filtered, 170, 255, cv2.THRESH_BINARY_INV)

    # Apply Morphological operations to remove noise
    kernel = np.ones((3, 3), np.uint8)
    morphed = cv2.morphologyEx(contourThresh, cv2.MORPH_OPEN, kernel)

    # Find contours
    contours, _ = cv2.findContours(morphed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Filter contours
    bubbles = [cnt for cnt in contours if 300 < cv2.contourArea(cnt) < 700]

    # Extract bounding boxes for each detected bubble
    bounding_boxes = []
    for cnt in bubbles:
        x, y, w, h = cv2.boundingRect(cnt)
        bounding_boxes.append((x, y, w, h))
        cv2.rectangle(cropped_image, (x, y), (x + w, y + h), (0, 255, 0), 2)

    return bounding_boxes

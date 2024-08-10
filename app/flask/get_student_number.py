import cv2
import os
import numpy as np
from get_student_number_filled import get_student_number_filled

def process_stnum(file_path):
    def find_bubble_position(bbox, grid):
        x, y, w, h = bbox
        for col_index, column in enumerate(grid):
            for row_index, group in enumerate(column):
                for cnt in group:
                    bx, by, bw, bh = cv2.boundingRect(cnt)
                    if bx <= x <= bx + bw and by <= y <= by + bh:
                        return col_index, row_index
        return None, None

    # Check if the file exists
    if not os.path.exists(file_path):
        print(f"Error: File '{file_path}' not found.")
        return

    # Load the image
    image = cv2.imread(file_path)

    # Check if the image was loaded successfully
    if image is None:
        print(f"Error: Unable to load image '{file_path}'.")
        return

    # Get the image dimensions
    height, width, channels = image.shape

    # Calculate the height of the top 1/5 of the image
    cut_off_height = height // 3

    # Crop the image to remove the top 1/5
    cropped_image = image[height // 9:cut_off_height, int(width // 2.7):int(width/1.5)]

    # Convert to grayscale
    gray = cv2.cvtColor(cropped_image, cv2.COLOR_BGR2GRAY)

    # Apply bilateral filter
    bilateral_filtered = cv2.bilateralFilter(gray, 9, 75, 75)

    # Apply thresholding
    thresh = cv2.adaptiveThreshold(bilateral_filtered, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2)

    # Find contours
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Filter contours based on area to identify bubbles
    bubbles = [cnt for cnt in contours if 400 < cv2.contourArea(cnt) < 700]

    # Sort bubbles by x-coordinate
    bubbles = sorted(bubbles, key=lambda c: cv2.boundingRect(c)[0])

    # Group bubbles into columns based on x-coordinate
    column_threshold = 13  # Adjust this threshold based on your specific image
    columns = []
    current_column = []

    for cnt in bubbles:
        x, _, _, _ = cv2.boundingRect(cnt)
        if not current_column:
            current_column.append(cnt)
        else:
            last_x, _, _, _ = cv2.boundingRect(current_column[-1])
            if abs(x - last_x) < column_threshold:
                current_column.append(cnt)
            else:
                columns.append(current_column)
                current_column = [cnt]

    if current_column:
        columns.append(current_column)

    # Further group contours within each column into rows
    row_threshold = 5  # Adjust this value based on the spacing between rows
    grid = []

    for col_index, column in enumerate(columns):
        column_groups = []
        current_row = []

        for cnt in sorted(column, key=lambda c: cv2.boundingRect(c)[1]):
            if not current_row:
                current_row.append(cnt)
            else:
                _, y, _, _ = cv2.boundingRect(cnt)
                _, last_y, _, _ = cv2.boundingRect(current_row[-1])
                if abs(y - last_y) < row_threshold:
                    current_row.append(cnt)
                else:
                    column_groups.append(current_row)
                    current_row = [cnt]

        if current_row:
            column_groups.append(current_row)

        grid.append(column_groups)

    # Draw contours around each detected bubble and show column and row groups
    for col_index, column in enumerate(grid):
        for row_index, group in enumerate(column):
            color = (0, 255, 0) if row_index % 2 == 0 else (0, 0, 255)  # Alternate colors for visualization
            for cnt in group:
                x, y, w, h = cv2.boundingRect(cnt)
                cv2.drawContours(cropped_image, [cnt], -1, color, 2)
                cv2.putText(cropped_image, f"C{col_index}R{row_index}", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.4, color, 1)

    # Example usage of the find_bubble_position function
    values = get_student_number_filled(file_path)
    filled = []
    for bbox in values:  # Example bounding box position
        col_index, row_index = find_bubble_position(bbox, grid)
        if col_index is not None and row_index is not None:
            filled.append([col_index, row_index])
            # Draw a blue bounding box around the detected bubble
            x, y, w, h = bbox
            cv2.rectangle(cropped_image, (x, y), (x + w, y + h), (255, 0, 0), 2)

    filled_sorted = sorted(filled, key=lambda y: y[1])
    
    id=""

    for bubble in filled_sorted:
        id = id+str(bubble[0])


    print(id)

    # cv2.imshow("First Name", cropped_image)
    # cv2.waitKey(0)
    return id

# process_stnum('data_images/test_2_page_1.png')
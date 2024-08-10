import cv2
import os
import numpy as np
from get_responses_200_first import get_bubble_bounding_boxes_first
from get_responses_200_second import get_bubble_bounding_boxes_second

def process_first_page_bubbles(file_path):
    def find_bubble_position(bbox, grid, margin=1):
        x, y, w, h = bbox
        for col_index, column in enumerate(grid):
            for row_index, group in enumerate(column):
                for cnt in group:
                    bx, by, bw, bh = cv2.boundingRect(cnt)
                    if (bx - margin <= x <= bx + bw + margin) and (by - margin <= y <= by + bh + margin):
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
    cropped_image = image[cut_off_height:height, 0:width]
    cropped_image = cv2.resize(cropped_image, (2200,1440))
    #cv2.imshow("Original", image)
    #cv2.waitKey(0)

    #cv2.imshow("Resized", cropped_image)
    #cv2.waitKey(0)

    # Convert to grayscale
    gray = cv2.cvtColor(cropped_image, cv2.COLOR_BGR2GRAY)

    #cv2.imshow("Grayscale", gray)
    #cv2.waitKey(0)

    # blur
    blurred = cv2.medianBlur(gray, 5)

    #cv2.imshow("Blurred", blurred)
    #cv2.waitKey(0)

    # Apply bilateral filter
    bilateral_filtered = cv2.bilateralFilter(blurred, 9, 75, 75)

    #cv2.imshow("Bilateral Filtered", bilateral_filtered)
    #cv2.waitKey(0)

    # Apply thresholding
    thresh = cv2.adaptiveThreshold(bilateral_filtered, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2)

    #cv2.imshow("Thresholded", thresh)
    #cv2.waitKey(0)

    # Find contours
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Filter contours based on area to identify bubbles
    bubbles = [cnt for cnt in contours if 300 < cv2.contourArea(cnt) < 1500]

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

    # Example usage of the find_bubble_position function
    values = get_bubble_bounding_boxes_first(file_path)
    filled = []
    for bbox in values:  # Example bounding box position
        col_index, row_index = find_bubble_position(bbox, grid)
        if col_index is not None and row_index is not None:
            filled.append([col_index, row_index])
            # Draw a blue bounding box around the detected bubble
            x, y, w, h = bbox
            cv2.rectangle(cropped_image, (x - 5, y - 5), (x + w + 5, y + h + 5), (255, 170, 0), 2)

    filled_sorted = sorted(filled, key=lambda y: y[1])
    filled_sorted = sorted(filled_sorted, key=lambda x: x[0])

    
    bubble_coords = []
    bubble_options = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    questions_marked = set()
    
    for bubble in filled_sorted:
        question_marked = {}
        col, row = bubble[0], bubble[1]
    
        if col <= 4:
            question_number = row + 1
            letter_index = col
        elif col <= 9:
            question_number = row + 26
            letter_index = col - 5
        elif col <= 14:
            question_number = row + 51
            letter_index = col - 10
        elif col <= 19:
            question_number = row + 76
            letter_index = col - 15
    
        letter = bubble_options[letter_index]
    
        if question_number not in questions_marked:
            question_marked["Question"] = question_number
            question_marked["Letter"] = [letter]
            question_marked["LetterPos"] = [letter_index]
            bubble_coords.append(question_marked)
            questions_marked.add(question_number)
        else:
            for question in bubble_coords:
                if question["Question"] == question_number:
                    question["Letter"].append(letter)
                    question["LetterPos"].append(letter_index)
    
    bubble_coords = sorted(bubble_coords, key=lambda x: x['Question'])

    # Detect no answers or multiple answers
    no_answer_questions = []
    multiple_answer_questions = []
    answers = []
    for bubble in bubble_coords:
        question = bubble["Question"]

        # Check if the question is already in answers
        if question in answers:
            multiple_answer_questions.append(question)
        else:
            # Append the question to answers if it's not already there
            answers.append(question)

        # Sort answers to ensure proper order
        answers.sort()

    # Now check for missing answers by iterating over the sorted answers
    for i in range(1, len(answers)):
        if answers[i] != answers[i-1] + 1:
            no_answer_questions.extend(range(answers[i-1] + 1, answers[i]))
            
            
    #print(bubble_coords)
    #print("Questions with no answers:", no_answer_questions)
    #print("Questions with multiple answers:", multiple_answer_questions)#
    #cv2.imshow("Marked", cropped_image)
    #cv2.waitKey(0)
    cv2.imwrite('./data_images/output1.png', cropped_image)

    return bubble_coords, no_answer_questions, multiple_answer_questions

def process_second_page_bubbles(file_path):
    def find_bubble_position(bbox, grid, margin=1):
        x, y, w, h = bbox
        for col_index, column in enumerate(grid):
            for row_index, group in enumerate(column):
                for cnt in group:
                    bx, by, bw, bh = cv2.boundingRect(cnt)
                    if (bx - margin <= x <= bx + bw + margin) and (by - margin <= y <= by + bh + margin):
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
    cut_off_height = height // 8

    # Crop the image to remove the top 1/5
    cropped_image = image[cut_off_height:(height - height // 5), 0:width]
    cropped_image = cv2.resize(cropped_image, (2200,1440))

    #cv2.imshow("Original", image)
    #cv2.waitKey(0)

    #cv2.imshow("Resized", cropped_image)
    #cv2.waitKey(0)

    # Convert to grayscale
    gray = cv2.cvtColor(cropped_image, cv2.COLOR_BGR2GRAY)

    #cv2.imshow("Grayscale", gray)
    #cv2.waitKey(0)

    # blur
    blurred = cv2.medianBlur(gray, 5)

    #cv2.imshow("Blurred", blurred)
    #cv2.waitKey(0)

    # Apply bilateral filter
    bilateral_filtered = cv2.bilateralFilter(blurred, 9, 75, 75)

    #cv2.imshow("Bilateral Filtered", bilateral_filtered)
    #cv2.waitKey(0)

    # Apply thresholding
    thresh = cv2.adaptiveThreshold(bilateral_filtered, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2)

    #cv2.imshow("Thresholded", thresh)
    #cv2.waitKey(0)

    # Find contours
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Filter contours based on area to identify bubbles
    bubbles = [cnt for cnt in contours if 300 < cv2.contourArea(cnt) < 1500]

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

    # Example usage of the find_bubble_position function
    values = get_bubble_bounding_boxes_second(file_path)
    filled = []
    for bbox in values:  # Example bounding box position
        col_index, row_index = find_bubble_position(bbox, grid)
        if col_index is not None and row_index is not None:
            filled.append([col_index, row_index])
            # Draw a blue bounding box around the detected bubble
            x, y, w, h = bbox
            cv2.rectangle(cropped_image, (x - 5, y - 5), (x + w + 5, y + h + 5), (255, 170, 0), 2)

    filled_sorted = sorted(filled, key=lambda y: y[1])
    filled_sorted = sorted(filled_sorted, key=lambda x: x[0])

    
    bubble_coords = []
    bubble_options = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    questions_marked = set()
    
    for bubble in filled_sorted:
        question_marked = {}
        col, row = bubble[0], bubble[1]
    
        if col <= 4:
            question_number = row + 101
            letter_index = col
        elif col <= 9:
            question_number = row + 126
            letter_index = col - 5
        elif col <= 14:
            question_number = row + 151
            letter_index = col - 10
        elif col <= 19:
            question_number = row + 176
            letter_index = col - 15
    
        letter = bubble_options[letter_index]
    
        if question_number not in questions_marked:
            question_marked["Question"] = question_number
            question_marked["Letter"] = [letter]
            question_marked["LetterPos"] = [letter_index]
            bubble_coords.append(question_marked)
            questions_marked.add(question_number)
        else:
            for question in bubble_coords:
                if question["Question"] == question_number:
                    question["Letter"].append(letter)
                    question["LetterPos"].append(letter_index)
    
    bubble_coords = sorted(bubble_coords, key=lambda x: x['Question'])

    # Detect no answers or multiple answers
    checked_questions = []
    no_answer_questions = []
    multiple_answer_questions = []
    answers = []
    for bubble in bubble_coords:
        question = bubble["Question"]

        # Check if the question is already in answers
        if question in answers:
            multiple_answer_questions.append(question)
            

        else:
            # Append the question to answers if it's not already there
            answers.append(question)

        # Sort answers to ensure proper order
        answers.sort()

    # Now check for missing answers by iterating over the sorted answers
    for i in range(1, len(answers)):
        if answers[i] != answers[i-1] + 1:
            no_answer_questions.extend(range(answers[i-1] + 1, answers[i]))
            
            
    #print(bubble_coords)
    #print("Questions with no answers:", no_answer_questions)
    #print("Questions with multiple answers:", multiple_answer_questions)

    #cv2.imshow("Marked", cropped_image)
    #cv2.waitKey(0)

    cv2.imwrite('./data_images/output2.png', cropped_image)

    return bubble_coords, no_answer_questions, multiple_answer_questions

#process_first_page_bubbles('data/test_16_page_1 200.png')
#process_second_page_bubbles('data/test_16_page_2 200.png')
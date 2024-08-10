from flask import Flask, request, jsonify
import os
from pdf2image import convert_from_bytes
from PIL import Image
import io
import base64
from test_grader import process_bubbles
from get_first_name import process_first_name
from get_last_name import process_last_name
from get_student_number import process_stnum
from flask_cors import CORS
from test_grader2 import process_first_page_bubbles, process_second_page_bubbles
from get_student_number_200 import process_stnum200

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", "http://localhost:80"],
        "methods": ["GET", "POST", "PUT", "DELETE"]
    }
})

# Set the upload and output folder paths
UPLOAD_FOLDER = '/app/data'
OUTPUT_FOLDER = '/app/data_images'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

@app.route('/')
def hello():
    return 'I am alive'

@app.route('/upload', methods=['POST'])
def upload_file():
    data = request.data
    print(request.headers)
    
    if 'testid' not in request.headers:
        print('id not in headers')
        return jsonify({'error': 'form data not found'}), 400
    
    testid = request.headers.get('testid')
    numquestions = request.headers.get('numquestions')
    if testid == '':
        print('id null')
        return jsonify({'error': 'id is null'}),400
    
    try:
        # Read the PDF file
        pdf_bytes = data

        # Convert PDF to images (one image per page)
        images = convert_from_bytes(pdf_bytes)

        grades = {}
        fname = ""
        lname = ""
        stnum = int
        answers = []
        files_to_delete = []
        
        # Save each page as a PNG file
        for i, image in enumerate(images):
            png_path = os.path.join(OUTPUT_FOLDER, f'test_{testid}_page_{i + 1}.png')
            image.save(png_path, 'png')
            files_to_delete.append(png_path)  # Track files to delete

            # Convert the image to a byte array
            img_byte_arr = io.BytesIO()
            image.save(img_byte_arr, format='PNG')
            img_byte_arr = img_byte_arr.getvalue()
            encoded_image = base64.b64encode(img_byte_arr).decode('utf-8')
            
            if numquestions == "100":
                if (i+1) % 2 == 1:
                    fname = process_first_name(png_path)
                    lname = process_last_name(png_path)
                    stnum = process_stnum(png_path)
                    first_page = encoded_image
                    first_page_image = image
                if (i+1) % 2 == 0:
                    answers = process_bubbles(png_path)
                    second_page = encoded_image
                    second_page_image = Image.open('/app/data_images/output.png')
                    
                    # Combine the images vertically
                    aspect_ratio = second_page_image.height / second_page_image.width # Since the second page is wider than the first page, we need to get an aspect ratio to shrink the second page to fit the width of the first page
                    second_page_height = int(first_page_image.width * aspect_ratio) # Apply new aspect ratio
                    second_page_image = second_page_image.resize((first_page_image.width, second_page_height), Image.LANCZOS)
                    combined_height = first_page_image.height + second_page_height
                    combined_image = Image.new('RGB', (first_page_image.width, combined_height))
                    combined_image.paste(first_page_image, (0, 0))
                    combined_image.paste(second_page_image, (0, first_page_image.height))
                    
                    combined_image_path = os.path.join(OUTPUT_FOLDER, f'test_{testid}_combined_page_{(i + 1) // 2}.png')
                    combined_image.save(combined_image_path, 'png')
                    files_to_delete.append(combined_image_path)
                    
                    # Convert the combined image to a byte array
                    combined_img_byte_arr = io.BytesIO()
                    combined_image.save(combined_img_byte_arr, format='PNG')
                    combined_img_byte_arr = combined_img_byte_arr.getvalue()
                    combined_encoded_image = base64.b64encode(combined_img_byte_arr).decode('utf-8')
                    
                    grades[stnum] = {
                        "fname": fname,
                        "lname": lname,
                        "stnum": stnum,
                        "answers": answers,
                        "first_page": first_page,
                        "second_page": second_page,
                        "combined_page": combined_encoded_image,
                        "page": i
                    }
            elif numquestions == "200":
                if (i+1) % 2 == 1:
                    stnum = process_stnum200(png_path)
                    answers = process_first_page_bubbles(png_path)
                    first_page = encoded_image
                    first_page_stnum = Image.open('/app/data_images/stnum_output.png')
                    first_page_image = Image.open('/app/data_images/output1.png')
                if (i+1) % 2 == 0:
                    answers2 = process_second_page_bubbles(png_path)
                    second_page = encoded_image
                    second_page_image = Image.open('/app/data_images/output2.png')
                    
                    combined_answers = [[],[],[]]
                    combined_answers[0] = answers[0] + answers2[0]
                    combined_answers[1] = answers[1] + answers2[1]
                    combined_answers[2] = answers[2] + answers2[2]
                    
                    # Combine the images vertically
                    aspect_ratio = second_page_image.height / second_page_image.width # Since the second page is wider than the first page, we need to get an aspect ratio to shrink the second page to fit the width of the first page
                    second_page_height = int(first_page_image.width * aspect_ratio) # Apply new aspect ratio
                    second_page_image = second_page_image.resize((first_page_image.width, second_page_height), Image.LANCZOS)
                    combined_height = first_page_stnum.height + first_page_image.height + second_page_height
                    combined_image = Image.new('RGB', (first_page_image.width, combined_height))
                    combined_image.paste(first_page_stnum, (0, 0))
                    combined_image.paste(first_page_image, (0, first_page_stnum.height))
                    combined_image.paste(second_page_image, (0, first_page_stnum.height + first_page_image.height))
                    
                    combined_image_path = os.path.join(OUTPUT_FOLDER, f'test_{testid}_combined.png')
                    combined_image.save(combined_image_path, 'png')
                    files_to_delete.append(combined_image_path)
                    
                    # Convert the combined image to a byte array
                    combined_img_byte_arr = io.BytesIO()
                    combined_image.save(combined_img_byte_arr, format='PNG')
                    combined_img_byte_arr = combined_img_byte_arr.getvalue()
                    combined_encoded_image = base64.b64encode(combined_img_byte_arr).decode('utf-8')
                    
                    grades[stnum] = {
                        "fname": 'unknown',
                        "lname": 'unknown',
                        "stnum": stnum,
                        "answers": combined_answers,
                        "first_page": first_page,
                        "second_page": second_page,
                        "combined_page": combined_encoded_image,
                        "page": i
                    }
            else:
                print('Please enter valid test style: 100 or 200 questions')
        
        # Delete the PNG files after processing
        for file_path in files_to_delete:
            if os.path.exists(file_path):
                os.remove(file_path)
        
        return jsonify({'message': 'PDF converted to PNG successfully', 'data': grades}), 200
    except Exception as e:
        print('error: '+str(e))
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
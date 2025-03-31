#!/usr/bin/env python
# coding: utf-8

import sys
import json
import argparse
import cv2
import numpy as np
import easyocr
import google.generativeai as genai
from PIL import Image

# Set up argument parsing
parser = argparse.ArgumentParser(description='Process document images using OCR and Gemini AI')
parser.add_argument('--file_path', type=str, required=True, help='Path to the image file')
parser.add_argument('--doc_type', type=str, required=True, help='Type of document (bills, investment, spending)')
args = parser.parse_args()

# Initialize OCR reader
reader = easyocr.Reader(['en'], gpu=True)

def image_with_bb(image_to_edit, results):
    """Add bounding boxes to image based on OCR results"""
    for detection in results: 
        top_left = tuple(map(int, detection[0][1]))
        bottom_right = tuple(map(int, detection[0][3]))
        text = detection[1]
        cv2.rectangle(image_to_edit, top_left, bottom_right, (0, 255, 0), 2)
    return image_to_edit

def final_out(file_path):
    """Extract text from image using OCR"""
    image = cv2.imread(file_path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) 
    thresh2 = cv2.adaptiveThreshold(image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 199, 5)
    result = reader.readtext(image)
    extracted_text = ""
    for detections in result:
        extracted_text = extracted_text + " " + detections[1]
    extracted_image = image_with_bb(image, result)   
    return extracted_text, extracted_image

def load_image(image_input):
    """Convert OpenCV image to PIL Image for Gemini API"""
    # Convert OpenCV image (BGR) to RGB for compatibility with PIL
    image_rgb = cv2.cvtColor(image_input, cv2.COLOR_BGR2RGB)
    # Convert OpenCV image to PIL Image
    pil_image = Image.fromarray(image_rgb)
    return pil_image

def generate_prompt(ocr_text, doc_type):
    """Generate appropriate prompt based on document type"""
    base_prompt = f"""You are a financial document parser. You are given:
this is the OCR Extracted Text -> {ocr_text} along with it I have also uploaded the OCR extracted bounded box image.
Use both inputs to extract *only relevant financial details* useful for accounting, tax filing, or financial records. Match labels with values accurately using bounding positions to eliminate OCR misalignment or duplicates.

Extract the following fields"""

    if doc_type == 'bills':
        prompt = base_prompt + """ for each identified bill/invoice:
- Invoice/Bill Number
- Date (in ISO format if possible)
- Total Amount
- Vendor/Supplier Name
- Payment Due Date
- Payment Status (if available)
- Payment Method (if available)
- Tax Amount (if available)
Return the result as a JSON object. Do not include null values."""
    
    elif doc_type == 'investment':
        prompt = base_prompt + """ for each identified investment document:
- Investment Type (stock, bond, mutual fund, etc.)
- Ticker/Symbol (if applicable)
- Amount Invested
- Date of Investment
- Current Value (if available)
- Issuing Institution
- Account Number (partially masked if available)
Return the result as a JSON object. Do not include null values."""
    
    elif doc_type == 'spending':
        prompt = base_prompt + """ for each identified salary/payroll document:
- Gross Amount
- Net Amount
- Date (in ISO format if possible)
- Employer/Organization Name
- Employee Name
- Pay Period
- Tax Deductions (if available)
- Other Deductions (if available)
Return the result as a JSON object. Do not include null values."""
    
    return prompt

def process_document(file_path, doc_type):
    """Main function to process document and return extracted data"""
    # Extract text using OCR
    extracted_text, annotated_image = final_out(file_path=file_path)
    
    # Generate appropriate prompt based on document type
    prompt = generate_prompt(extracted_text, doc_type)
    
    # Convert annotated image to PIL format for Gemini
    image_final = load_image(annotated_image)
    
    # Configure Gemini API
    genai.configure(api_key="AIzaSyC7GK9bFtQ1tbAW6Ld97cqKJ48nblLDIgg")
    model = genai.GenerativeModel("gemini-1.5-flash")
    
    # Generate response from Gemini
    response = model.generate_content([prompt, image_final])
    
    # Extract JSON from the response
    response_text = response.text
    
    # Process the response text to extract valid JSON
    # First, try to find JSON between triple backticks
    if "```json" in response_text and "```" in response_text.split("```json")[1]:
        json_text = response_text.split("```json")[1].split("```")[0].strip()
    elif "```" in response_text and "```" in response_text.split("```")[1]:
        json_text = response_text.split("```")[1].split("```")[0].strip()
    else:
        # If no valid JSON format is found, just use the raw text
        json_text = response_text
    
    try:
        # Try to parse the extracted JSON
        result = json.loads(json_text)
        return result
    except json.JSONDecodeError:
        # If parsing fails, return the raw text
        return {"raw_response": response_text}

# Main execution
if __name__ == "__main__":
    try:
        file_path = args.file_path
        doc_type = args.doc_type
        
        # Process the document
        result = process_document(file_path, doc_type)
        
        # Print JSON result to stdout (will be captured by the Node.js script)
        print(json.dumps(result))
        
        # Exit successfully
        sys.exit(0)
    except Exception as e:
        # Print error and exit with failure code
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
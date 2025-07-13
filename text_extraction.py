# PURPOSE: with an inputted pdf full of medical records, create a text document containing all of the info

import pdf2image as p2i
import easyocr
import numpy as np
from PIL import Image

# Initialize EasyOCR reader (do this once to avoid reloading)
reader = easyocr.Reader(['en'])

def to_images(pdf, dpi=300):
	pages = p2i.convert_from_path(pdf, dpi)
	return pages

def extract_text_from_page(page):
	# Convert PIL image to numpy array for EasyOCR
	page_array = np.array(page)
	
	# Use EasyOCR to extract text
	result = reader.readtext(page_array)
	
	# Extract just the text from the results
	text = ' '.join([item[1] for item in result])
	return text

def extract_all_text(pdf, dpi=300):
	pages = to_images(pdf, dpi);
	text_pages = [extract_text_from_page(page) for page in pages]
	return "\nNEW PAGE\n\n".join(text_pages)




if __name__ == "__main__":
	# test saving of pages as images
	pdf_path = "/home/connor/personal/inbox/something.pdf"

	text = extract_all_text(pdf_path);
	print(text)


	"""
	pages = to_images(pdf_path)
	for i in range(5):
		pages[i].save("page"+str(i)+".jpg", "JPEG")
	"""





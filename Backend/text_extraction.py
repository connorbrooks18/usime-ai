# PURPOSE: with an inputted pdf full of medical records, create a text document containing all of the info

import pdf2image as p2i
import pytesseract
from PIL import Image

def to_images(pdf, dpi=300):
	pages = p2i.convert_from_path(pdf, dpi)
	return pages

def extract_text_from_page(page):
	# Use pytesseract to extract text from PIL image
	text = pytesseract.image_to_string(page)
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





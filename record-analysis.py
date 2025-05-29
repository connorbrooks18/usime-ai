# PURPOSE: with an inputted pdf full of medical records, create a text document containing all of the info

import pdf2image as p2i
import pytesseract as pyt



def to_images(pdf, dpi=300):
	pages = p2i.convert_from_path(pdf, dpi)
	return pages

def extract_text_from_page(page):
	return pyt.image_to_string(page);


if __name__ == "__main__":
	# test saving of pages as images
	pdf_path = "/home/connor/personal/inbox/something.pdf"
	pages = to_images(pdf_path)
	text = extract_text_from_page(pages[0])
	print(text)
	"""
	pages = to_images(pdf_path)
	for i in range(5):
		pages[i].save("page"+str(i)+".jpg", "JPEG")
	"""




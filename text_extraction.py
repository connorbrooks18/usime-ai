# PURPOSE: with an inputted pdf full of medical records, create a text document containing all of the info


import pdf2image as p2i
import base64
import io
from openai import AzureOpenAI

def to_images(pdf, dpi=300):
	pages = p2i.convert_from_path(pdf, dpi)
	return pages

def to_images(pdf, dpi=300):
	pages = p2i.convert_from_path(pdf, dpi)
	return pages


def extract_text_from_page(page, openai_client, model="gpt-4o-vision-preview"):
	# Convert PIL image to base64
	buffered = io.BytesIO()
	page.save(buffered, format="PNG")
	img_b64 = base64.b64encode(buffered.getvalue()).decode()

	# Call OpenAI Vision API for OCR
	response = openai_client.chat.completions.create(
		model=model,
		messages=[
			{"role": "system", "content": "You are an OCR assistant. Extract all readable text from the image as accurately as possible."},
			{"role": "user", "content": [
				{"type": "image_url", "image_url": {"url": f"data:image/png;base64,{img_b64}"}}
			]}
		],
		max_tokens=4096
	)
	return response.choices[0].message.content.strip()


def extract_all_text(pdf, endpoint=None, api_key=None, api_version="2025-04-01-preview", model="gpt-4o-vision-preview", dpi=300):
	"""
	Extracts all text from a PDF using OpenAI Vision API for OCR.
	Requires AzureOpenAI endpoint and api_key.
	"""
	if endpoint is None:
		import os
		endpoint = os.environ.get("AZURE_OPENAI_ENDPOINT")
	if api_key is None:
		import os
		api_key = os.environ.get("AZURE_OPENAI_API_KEY")
	client = AzureOpenAI(azure_endpoint=endpoint, api_key=api_key, api_version=api_version)
	pages = to_images(pdf, dpi)
	text_pages = [extract_text_from_page(page, client, model=model) for page in pages]
	return "\nNEW PAGE\n\n".join(text_pages)





if __name__ == "__main__":
	# Example usage
	pdf_path = "/home/connor/personal/inbox/something.pdf"
	text = extract_all_text(pdf_path)
	print(text)





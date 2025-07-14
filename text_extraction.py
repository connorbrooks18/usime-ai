# PURPOSE: with an inputted pdf full of medical records, create a text document containing all of the info




import base64
import io
from openai import AzureOpenAI
from pdf2image import convert_from_path



def encode_image_to_base64(pil_image):
	buffered = io.BytesIO()
	pil_image.save(buffered, format="PNG")
	return base64.b64encode(buffered.getvalue()).decode()




def extract_text_from_pdf(pdf_path, openai_client, model="gpt-4.1-mini"):
	pages = convert_from_path(pdf_path)
	all_text = []
	for idx, page in enumerate(pages):
		img_b64 = encode_image_to_base64(page)
		data_url = f"data:image/png;base64,{img_b64}"
		response = openai_client.chat.completions.create(
			model=model,
			messages=[
				{"role": "system", "content": f"You are an OCR assistant. Extract all readable text from this medical record page as accurately as possible. This is page {idx+1} of the PDF."},
				{"role": "user", "content": [
					{"type": "image_url", "image_url": {"url": data_url}}
				]}
			],
			max_tokens=4096
		)
		all_text.append(response.choices[0].message.content.strip())
	return "\nNEW PAGE\n\n".join(all_text)


#  something


def extract_all_text(pdf_path, endpoint=None, api_key=None, api_version="2025-04-01-preview", model="gpt-4.1-mini"):
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
	return extract_text_from_pdf(pdf_path, client, model=model)






if __name__ == "__main__":
	# Example usage
	pdf_path = "/home/connor/personal/inbox/something.pdf"
	text = extract_all_text(pdf_path)
	print(text)





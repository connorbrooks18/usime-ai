# PURPOSE: with an inputted pdf full of medical records, create a text document containing all of the info



import base64
from openai import AzureOpenAI


def encode_pdf_to_base64(pdf_path):
	with open(pdf_path, "rb") as f:
		return base64.b64encode(f.read()).decode()



def extract_text_from_pdf(pdf_path, openai_client, model="gpt-4.1-mini"):
	pdf_b64 = encode_pdf_to_base64(pdf_path)
	response = openai_client.chat.completions.create(
		model=model,
		messages=[
			{"role": "system", "content": "You are an OCR assistant. Extract all readable text from the PDF as accurately as possible."},
			{"role": "user", "content": [
				{"type": "image_url", "image_url": {"url": f"data:application/pdf;base64,{pdf_b64}"}}
			]}
		],
		max_tokens=4096
	)
	return response.choices[0].message.content.strip()


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





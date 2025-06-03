import text_extraction
import os
import sys
from openai import AzureOpenAI

class Summarizer:

	def __init__(self, endpoint, api_key):
		self.client = AzureOpenAI(
			azure_endpoint = endpoint,
			api_key = api_key,
			api_version="2025-04-01-preview"
		)

	def summarize_from_pdf(self, pdf): 
		text = text_extraction.extract_all_text(pdf)
		return self.summarize_from_text(text)
	def summarize_from_text(self, text):
		response = self.client.responses.create(
			model="o4-mini",
			input=[
				{"role": "developer", "content": "You are a medical assistant AI helping a multi-board-certified doctor write IMEs (Independent Medical Examinations) for the use in courts by lawyers for personal-injury cases. Your job is to summarize medical records in a consistent format that is useful for the doctor to create IMEs with. Input: Long text of all related medical records scanned in. Expect OCR errors. Output: JSON formatted information including fields for 'patient_name', 'chief_complaint', 'past-relevant-medical-history', 'current-medications', 'relevant-diagnostic-tests', 'assessment'"},
				{"role": "user", "content":text}
			],
			#max_completion_tokens = 10000,
		)
		return response.output_text 


if __name__ == "__main__":
	endpoint = os.environ["AZURE_OPENAI_ENDPOINT"]
	api_key = os.environ["AZURE_OPENAI_API_KEY"]


	if len(sys.argv) < 2 or sys.argv[1] == None or sys.argv[1] == "":
		print("Insert pdf name or path to pdf after summarize.py")
		exit()
	
	pdf_name = sys.argv[1]


	s = Summarizer(endpoint=endpoint, api_key=api_key)
	summary = s.summarize_from_pdf("./example.pdf")
	print(summary)

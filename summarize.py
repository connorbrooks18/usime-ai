import text_extraction
from openai import AzureOpenAI

class Summarizer:

	def __init__(self):
		self.client = AzureOpenAI(
			azure_endpoint = "https://mr-summary2.openai.azure.com",
			api_key="G3LPaVjFqSqpZDNjssA7Z9RPjoMeTWvDso2oFu2P5gDSNNAMQfD2JQQJ99BFACYeBjFXJ3w3AAABACOGaXUe",
			api_version="2025-04-1-preview"
			)

	def summarize_from_pdf(self, pdf): 
		text = text_extraction.extract_all_text(pdf)
		return self.summarize_from_text(text)
	def summarize_from_text(self, text):
		response = self.client.chat.completions.create(
			model="o4-mini",
			messages=[
				{"role": "developer", "content": "You are a medical assistant AI helping a multi-board-certified doctor write IMEs (Independent Medical Examinations) for the use in courts by lawyers for personal-injury cases. Your job is to summarize medical records in a consistent format that is useful for the doctor to create IMEs with. Input: Long text of all related medical records scanned in. Expect OCR errors. Output: JSON formatted information including fields for 'patient_name', 'chief_complaint', 'past-relevant-medical-history', 'current-medications', 'relevant-diagnostic-tests', 'assessment'"},
				{"role": "user", "content":text}
			],
			#max_completion_tokens = 10000,
			reasoning_effort = "low"
			)
		return response


if __name__ == "__main__":
	s = Summarizer()
	summary = s.summarize_from_pdf("./example.pdf")
	print(summary)

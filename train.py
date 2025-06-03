import text_extraction
import os
import sys
from openai import AzureOpenAI



# goal is to train a model on the IMEs created by dad
# recommended training size is at least 50 high quality examples
# doubline the dataset size increases model quality linear-ly

class Trainer:

	def __init__(self, endpoint, api_key):
		self.client = AzureOpenAI(
			azure_endpoint = endpoint,
			api_key = api_key,
			api_version="2025-04-01-preview"
		)
	
	def generate_training_file(self, n):
		training = []
		for i in range(n):
			messages = []
			messages.append({"role": "developer", "content": "You are a medical assistant AI helping a multi-board-certified doctor write IMEs (Independent Medical Examinations) for the use in courts by lawyers for personal-injury cases. Your job is to summarize medical records in a consistent format that is useful for the doctor to create IMEs with. Input: Long text of all related medical records scanned in. Expect OCR errors. Output: JSON formatted information including fields for 'patient_name', 'chief_complaint', 'past-relevant-medical-history', 'current-medications', 'relevant-diagnostic-tests', 'assessment'"})
			messages.append({"role": "user", "content": f"{i}"})
			messages.append({"role": "assistant", "content": f"{i} response"})
			training.append(messages)
		return training

if __name__ == "__main__":
	endpoint = os.environ["AZURE_OPENAI_ENDPOINT"]
	api_key = os.environ["AZURE_OPENAI_API_KEY"]

	t = Trainer(endpoint=endpoint, api_key=api_key)
	training = t.generate_training_file(10)
	print(training)


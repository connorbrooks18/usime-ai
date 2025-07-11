import text_extraction
import os
import sys
import json
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
		#self.prompt = self.get_prompt(file)
		self.prompt = "say cheese!"


	def get_prompt(self, file_name="summarize_prompt.txt"):
		# get developer prompt from a file
		prompt = ""
		with open(file_name, "r") as file:
			for line in file.readlines():
				prompt += line			
		return prompt


	
	#save training examples to a file in JSON for fine-tuning
	#using n cases stored in a folder called 'examples' in the current directory
	#f
	def generate_training_files(self, n):
		training = []
		for i in range(n):
			messages = []
			messages.append(f'{{"role": "developer", "content":"{self.prompt}"}}')
			messages.append(f'{{"role": "user", "content": {i}}}')
			messages.append(f'{{"role": "assistant", "content": "{i} response"}}')
			training.append(messages)
		with open("training_set.jsonl", "w") as file:
			for messages in training:
				file.write(f'{{"messages": [{", ".join(messages)}]}}\n')

	#submit request to start training based on local .jsonl files
	def start_fine_tuning_job(self):
		training_file_name = "training_set.jsonl"
		validation_file_name = "validation_set.jsonl"

		# upload the dataset files

		training_response = client.files.create(
			file = open(training_file_name, "rb"), purpose="fine-tune"
		)
		training_file_id = training_response.id

		validation_response = client.files.create(
			file = open(validation_file_name, "rb"), purpose="fine-tune"
		)
		validation_file_id = validation_reponse.id

		response = client.fine_tuning.jobs.create(
			training_file = training_file_id,
			validation_file = validation_file_id,
			model = "o4-mini",
			seed = 39
		)

		job_id = reponse.id
		print("*SAVE* Job ID:", job_id)
		print("Status:", response.status)
		print(response.model_dump_json(indent=2))



if __name__ == "__main__":
	endpoint = os.environ["AZURE_OPENAI_ENDPOINT"]
	api_key = os.environ["AZURE_OPENAI_API_KEY"]

	t = Trainer(endpoint=endpoint, api_key=api_key)
	t.generate_training_files(10)


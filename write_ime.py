import text_extraction
import os
import sys
from openai import AzureOpenAI

class Writer:

	def __init__(self, endpoint, api_key):
		self.client = AzureOpenAI(
			azure_endpoint = endpoint,
			api_key = api_key,
			api_version="2025-04-01-preview"
		)
		self.developer_prompt = self.get_developer_prompt()
		self.user_prompt = self.make_user_prompt()


	def get_developer_prompt(self, file_name="./prompts/write_ime_prompt.txt"):
		# get developer prompt from a file
		prompt = ""
		with open(file_name, "r") as file:
			for line in file.readlines():
				prompt += line			
		return prompt

	def make_user_prompt(self, records_file="./example/example.pdf", notes_file="./example/example.txt", questions_file="./example/questions.txt"):
		records = text_extraction.extract_all_text(records_file)
		with open(notes_file) as f:
			notes = f.read()
		with open(questions_file) as f:
			questions = f.read() 

		prompt = "{\n"
		prompt += f'"records": "{records}",\n'
		prompt += f'"interview_notes": "{notes}",\n'
		prompt += f'"questions": "{questions}"\n'
		prompt += "}"
		return prompt

	def write_ime(self):
		response = self.client.responses.create(
			model="o4-mini",
			instructions=self.developer_prompt,
			input=self.user_prompt
		)
	
		return response.output_text 


if __name__ == "__main__":
	endpoint = os.environ["AZURE_OPENAI_ENDPOINT"]
	api_key = os.environ["AZURE_OPENAI_API_KEY"]


#	if len(sys.argv) < 2 or sys.argv[1] == None or sys.argv[1] == "":
#		print("Insert pdf name or path to pdf after write_ime.py")
#		exit()
	


	w = Writer(endpoint=endpoint, api_key=api_key)
	ime = w.write_ime()
	print(ime)

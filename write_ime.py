import text_extraction
import os
import sys
from openai import AzureOpenAI

class Writer:

	def __init__(self, endpoint, api_key, records_file="./example/example.pdf", notes_file="./example/example.txt", questions_file="./example/questions.txt"):
		self.client = AzureOpenAI(
			azure_endpoint = endpoint,
			api_key = api_key,
			api_version="2025-04-01-preview"
		)
		self.developer_prompt = self.get_developer_prompt()
		self.user_prompt = self.make_user_prompt(records_file, notes_file, questions_file)


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
		response = self.client.chat.completions.create(
			model="gpt-4.1-mini",
			messages=[
				{"role": "system", "content": self.developer_prompt},
				{"role": "user", "content": self.user_prompt}
			],
			max_tokens=4096
		)
		return response.choices[0].message.content.strip()


if __name__ == "__main__":
	endpoint = os.environ["AZURE_OPENAI_ENDPOINT"]
	api_key = os.environ["AZURE_OPENAI_API_KEY"]

	# Accept file paths as command line arguments or use defaults
	records_file = sys.argv[1] if len(sys.argv) > 1 else "./example/example.pdf"
	notes_file = sys.argv[2] if len(sys.argv) > 2 else "./example/example.txt"
	questions_file = sys.argv[3] if len(sys.argv) > 3 else "./example/questions.txt"

	w = Writer(endpoint=endpoint, api_key=api_key, records_file=records_file, notes_file=notes_file, questions_file=questions_file)
	ime = w.write_ime()
	print(ime)

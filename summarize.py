import text_extraction
import os
import sys
from openai import AzureOpenAI

class Summarizer:

	def __init__(self, endpoint, api_key, file="prompt.txt"):
		self.client = AzureOpenAI(
			azure_endpoint = endpoint,
			api_key = api_key,
			api_version="2025-04-01-preview"
		)
		self.prompt = self.get_prompt(file)


	def get_prompt(self, file_name="prompt.txt"):
		# get developer prompt from a file
		prompt = ""
		with open(file_name, "r") as file:
			for line in file.readlines():
				prompt += line			
		return prompt

	def summarize_from_pdf(self, pdf): 
		text = text_extraction.extract_all_text(pdf)
		return self.summarize_from_text(text)
	def summarize_from_text(self, text):
		"""response = self.client.responses.create(
			model="o4-mini",
			input=[
				{"role": "developer", "content": self.prompt},
				{"role": "user", "content":text}
			],
			#max_completion_tokens = 10000,
		)"""
		response = self.client.responses.create(
			model="o4-mini",
			instructions=self.prompt,
			input=text
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

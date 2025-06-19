import text_extraction
import os
import sys
import json
from openai import AzureOpenAI

class Summarizer:

	def __init__(self, endpoint, api_key):
		self.client = AzureOpenAI(
			azure_endpoint = endpoint,
			api_key = api_key,
			api_version="2025-04-01-preview"
		)
		self.prompt = self.get_prompt()
		self.json_prompt = self.get_prompt("./prompts/summarize_json_prompt.txt")


	def get_prompt(self, file_name="./prompts/summarize_prompt.txt"):
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
	def summarize_from_pdf_as_json(self, pdf):
		"""Extract text from PDF and return a structured JSON summary"""
		text = text_extraction.extract_all_text(pdf)
		return self.summarize_from_text_as_json(text)
		
	def summarize_from_text_as_json(self, text):
		"""Generate a structured JSON summary from text"""
		try:
			# Using the existing API parameters but with the JSON prompt
			# Removed response_format parameter which isn't supported in your API version
			response = self.client.responses.create(
				model="o4-mini",
				instructions=self.json_prompt,
				input=text
			)
			
			# Try to extract JSON from the response if it's not already in JSON format
			output_text = response.output_text.strip()
			
			# If the response starts with ```json and ends with ```, extract just the JSON part
			if output_text.startswith("```json") and output_text.endswith("```"):
				output_text = output_text[7:-3].strip()
			# If the response starts with ``` and ends with ```, extract just the content
			elif output_text.startswith("```") and output_text.endswith("```"):
				output_text = output_text[3:-3].strip()
				
			# Parse the response to ensure it's valid JSON
			json_response = json.loads(output_text)
			return json_response
			
		except json.JSONDecodeError as e:
			# If JSON parsing fails, try a fallback approach - convert the summary to a simple JSON structure
			try:
				# Generate a regular summary as fallback
				fallback_summary = self.summarize_from_text(text)
				
				# Create a simple JSON structure
				fallback_json = {
					"patientInfo": {
						"name": "Not extracted",
						"dob": "Not extracted",
						"address": "Not extracted"
					},
					"summary": fallback_summary,
					"note": "This is a fallback summary due to JSON parsing issues"
				}
				
				return fallback_json
			except Exception:
				# If even the fallback fails, return an error object
				return {
					"error": "Failed to generate valid JSON",
					"details": str(e),
					"rawOutput": response.output_text if 'response' in locals() else "No response generated"
				}
				
		except Exception as e:
			return {
				"error": "An error occurred during summarization",
				"details": str(e)
			}
			
			
if __name__ == "__main__":
	endpoint = os.environ["AZURE_OPENAI_ENDPOINT"]
	api_key = os.environ["AZURE_OPENAI_API_KEY"]


	if len(sys.argv) < 2 or sys.argv[1] == None or sys.argv[1] == "":
		print("Insert pdf name or path to pdf after summarize.py")
		exit()
	
	pdf_name = sys.argv[1]


	s = Summarizer(endpoint=endpoint, api_key=api_key)
	summary = s.summarize_from_pdf(pdf_name)
	print(summary)

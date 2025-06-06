import json

# takes in name of json file 
# returns a basically formatted group of html text with headers and paragraphs
def json_to_html(json_file, header_tag="h1", header_class="", content_tag="p", content_class="", second_header_tag="h2", second_header_class=""):
	with open(json_file) as f:
		json_dict = json.load(f)
	html = ""
	for key in json_dict:
		html += f'<{header_tag} class="{header_class}">{key.upper()}</{header_tag}>\n'
		html += f'<{content_tag} class="{content_class}">{json_dict[key]}</{content_tag}>\n'

	html = html.replace("\n", "\n<br/>")

	return html



if __name__ == "__main__":

	json_file = "ime_output.txt"
	html = json_to_html(json_file)
	
	print(html)

# Add your utilities or helper functions to this file.

import os
from dotenv import load_dotenv, find_dotenv

# these expect to find a .env file at the directory above the lesson.                                                                                                                     # the format for that file is (without the comment)                                                                                                                                       #API_KEYNAME=AStringThatIsTheLongAPIKeyFromSomeService
def load_env():
    _ = load_dotenv(find_dotenv())

def get_openai_api_key():
    load_env()
    return os.getenv("OPENAI_API_KEY")

def get_serper_api_key():
    load_env()
    return os.getenv("SERPER_API_KEY")

def get_openrouter_deepseek_api_key():
    load_env()
    return os.getenv("OPENROUTER_API_KEY_DEEPSEEK")

def get_openrouter_qwen_api_key():
    load_env()
    return os.getenv("OPENROUTER_API_KEY_QWENLLM")

def pretty_print_result(result):
    parsed_result = []
    for line in result.split('\n'):
        if len(line) > 80:
            words = line.split(' ')
            new_line = ''
            for word in words:
                if len(new_line) + len(word) + 1 > 80:
                    parsed_result.append(new_line)
                    new_line = word
                else:
                    new_line = word if new_line == '' else new_line + ' ' + word
            parsed_result.append(new_line)
        else:
            parsed_result.append(line)
    return "\n".join(parsed_result)

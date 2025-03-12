from typing import List, Optional, Any, Dict
from langchain.callbacks.manager import CallbackManagerForLLMRun
from langchain.llms.base import LLM
from groq import Groq
from pydantic import Field

class GroqLLM(LLM):
    client: Any = Field(default=None)
    model_name: str = "qwen-2.5-32b"
    temperature: float = 0.6
    max_tokens: int = 4096
    
    def __init__(self, api_key: str, **kwargs):
        super().__init__(**kwargs)
        self.client = Groq(api_key=api_key)
        self.model_name = kwargs.get("model_name", self.model_name)
        self.temperature = kwargs.get("temperature", self.temperature)
        self.max_tokens = kwargs.get("max_tokens", self.max_tokens)

    @property
    def _llm_type(self) -> str:
        return "groq"

    def _call(
        self,
        prompt: str,
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs: Any,
    ) -> str:
        completion = self.client.chat.completions.create(
            model=self.model_name,
            messages=[{"role": "user", "content": prompt}],
            temperature=self.temperature,
            max_tokens=self.max_tokens,
            stop=stop
        )
        return completion.choices[0].message.content
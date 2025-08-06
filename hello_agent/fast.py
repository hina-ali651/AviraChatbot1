from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from agents import Agent, Runner, OpenAIChatCompletionsModel, AsyncOpenAI
from agents.run import RunConfig
from openai.types.responses import ResponseTextDeltaEvent
import os
from dotenv import load_dotenv

app = FastAPI(title="Agent API with FastAPI")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load API key
load_dotenv()
gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

# Setup OpenAI-compatible Gemini client
client = AsyncOpenAI(
    api_key=gemini_api_key,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)

model = OpenAIChatCompletionsModel(
    model="gemini-2.0-flash",
    openai_client=client
)

config = RunConfig(
    model=model,
    model_provider=client,
    tracing_disabled=True
)

agent = Agent(
    name="Assistant",
    instructions=(
        "You are a helpful assistant. Always try to remember the user's name and previous conversation context if provided in the message history. "
        "If the user asks about their name or something from earlier in the chat, use the history to answer."
    ),
    model=model
)

# Request and response schemas
class MessageRequest(BaseModel):
    content: str
    history: list = []

class MessageResponse(BaseModel):
    output: str

# POST endpoint to process streamed message
@app.post("/message", response_model=MessageResponse)
async def process_message(request: MessageRequest):
    try:
        # Combine content and history for context
        user_input = request.content
        history = request.history if hasattr(request, 'history') else []
        # Format history for the agent (as a string)
        history_text = "\n".join([
            f"{msg['sender']}: {msg['text']}" for msg in history
        ]) if history else ""
        if history_text:
            prompt = f"Previous conversation:\n{history_text}\nUser: {user_input}"
        else:
            prompt = user_input

        result = Runner.run_streamed(agent, prompt, run_config=config)

        final_output = ""

        async for event in result.stream_events():
            if event.type == "raw_response_event" and isinstance(event.data, ResponseTextDeltaEvent):
                final_output += event.data.delta  # collect deltas

        return MessageResponse(output=final_output)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing message: {str(e)}")

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

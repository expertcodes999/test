from crewai import Agent, Task, Crew, Process
from langchain_google_genai import ChatGoogleGenerativeAI

# llm = ChatGoogleGenerativeAI(model="gemini-pro")

research_agent = Agent(
    role="A researcher of topics using various credible sources",
    goal="Get detailed information on any topic you are asked to research",
    backstory="You're an experienced researcher in the area of science with multiple years of experience. Your principle is to always verify every piece of information",
    allow_delegation=True,
    # llm=llm
)

writer_agent = Agent(
    role="A Professional Writer of Technical Articles",
    goal = "Take research information given to you and write a detailed article",
    backstory="A writer with over a decade of experience writing articles for the top developer blogs",
    # llm=llm
)

research_task = Task(
    description="Conduct a thorough research on getting started with GraphQL",
    expected_output="Research information on the setup, configuration, example use and use cases of GraphQL",
    agent=research_agent
)

writing_task = Task(
    description="Write a 3-page article on 'Getting Started with GraphQL'",
    expected_output="A well formatted and structured article",
    agent=writer_agent,
    output_file="graphql.md"
)

writing_crew = Crew(
    agents=[research_agent, writer_agent],
    tasks=[research_task, writing_task],
    process=Process.sequential,
    verbose=True
)

writing_crew.kickoff()
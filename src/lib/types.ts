// State of the agent, make sure this aligns with your agent's state.
export type AgentState = {
  proverbs: string[];
  weather: {
    location: string;
    temperature: number;
    condition: string;
  }[];
}
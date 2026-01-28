"use client";

import { CopilotKitProvider, CopilotSidebar, useAgent } from "@copilotkitnext/react";
import { ProverbsCard } from "@/components/proverbs";
import { WeatherCard } from "@/components/weather";
import { useEffect } from "react";

const runtimeUrl =
  process.env.NEXT_PUBLIC_COPILOTKIT_RUNTIME_URL ??
  "http://localhost:4000/api/copilotkit";

type FieldMetadata = {
  field_name: string;
  field_type: string;
  description: string;
  field_prompt: string;
  schema: Record<string, unknown>;
  parser_strategy: "replace" | "merge" | "append";
};

type FrontendStateData = {
  proverbs: string[];
  weather: {
    location: string;
    temperature: number;
    condition: string;
  }[];
  todos: string[];
  campaigns: {
    sender: string;
    receiver: string;
    content: string;
  }[];
};

type MouseEvent ={
  checkedState: string | null;
  hoveredState: string | null;
  clickedState: string | null;
}

type FrontendConfig = {
  system_prompt: string;
  field_schemas: Record<string, FieldMetadata>;
  frontendState: FrontendStateData;
  mouseEvent: MouseEvent;
};

type RootAgentState = {
  agent_config: FrontendConfig;
};

export default function Home() {
  return (
    <CopilotKitProvider runtimeUrl={runtimeUrl} showDevConsole useSingleEndpoint>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white">
                CK
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Agentic UI Starter
              </h1>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              {runtimeUrl}
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-8 flex gap-8">
           <div className="flex-1">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-slate-400">
                  Try asking the assistant to &quot;add a proverb&quot; or &quot;check the weather in Tokyo&quot;.
                </p>
              </div>
              <YourMainContent />
           </div>
        </main>
        
        <CopilotSidebar
          defaultOpen
          width="400px"
          labels={{
            modalHeaderTitle: "Copilot Assistant",
            chatInputPlaceholder: "How can I help you today?",
          }}
        />
      </div>
    </CopilotKitProvider>
  );
}

function YourMainContent() {
  const {agent} = useAgent({
    name: "my_agent",
    initialState: {
      agent_config: {
         system_prompt: `
          You are managing a list of proverbs and weather records.
          1. 'proverbs': A list of insightful sayings.
          2. 'weather': Current weather conditions.
          3. 'todos': A list of tasks to do.
          4. 'campaigns': A list of SMS messages.
          
          When users ask to add/remove/change proverbs, update the 'proverbs' array.
          When users ask to set weather manually, update the 'weather' array.
          When users ask to add/remove/change todos, update the 'todos' array.
          When users ask to add/remove/change campaigns, update the 'campaigns' array.
        `,
        parser_strategy: "merge", 
        field_schemas: {
          proverbs: {
            field_name: "proverbs",
            field_type: "array",
            description: "A list of proverbs",
            field_prompt: `
            When updating proverbs:
            - Add new proverbs to the existing list
            - Keep the format as simple strings
            - Avoid duplicates
            - Make them insightful and relevant
            `.trim(),
            schema: {
              type: "array",
              items: { type: "string" },
            },
            parser_strategy: "replace",
          },
          weather: {
            field_name: "weather",
            field_type: "array",
            description: "Weather records by location",
            field_prompt: `
            When updating weather:
            - Each record must have: location, temperature, condition
            - Update existing location if found, otherwise append
            - Temperature should be numeric in Fahrenheit
            - Condition should be descriptive (e.g., Sunny, Cloudy, Rainy)
            `.trim(),
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  location: { type: "string" },
                  temperature: { type: "number" },
                  condition: { type: "string" },
                },
                required: ["location", "temperature", "condition"],
              },
            },
            parser_strategy: "replace",
          },
          todos: {
            field_name: "todos",
            field_type: "array",
            description: "Todo items",
            field_prompt: `
              When updating todos:
              - Add new items to the list
              - Mark completed items with [DONE] prefix
              - Keep tasks clear and actionable
            `.trim(),
            schema: {
              type: "array",
              items: { type: "string" },
            },
            parser_strategy: "replace",
          },
          campaigns: {
            field_name: "campaigns",
            field_type: "array",
            description: "SMS campaigns",
            field_prompt: `
              When updating campaigns:
              - Each campaign needs: id, content, status
              - Status must be one of: draft, scheduled, sent
              - Generate unique IDs if not provided (use timestamp-based format)
              - Content should be concise SMS-friendly text
                `.trim(),
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  sender: { type: "string" },
                  receiver: { type: "string" },
                  content: { type: "string" },
                },
              },
            },
            parser_strategy: "replace",
          },
        },

        frontendState: {
          proverbs: [
            "CopilotKit makes generic backends powerful.",
          ],
          weather: [
            {
              location: "San Francisco",
              temperature: 70,
              condition: "Partly Cloudy",
            },
          ],
          todos: [
            "Buy groceries",
            "Finish project report",
          ],
          campaigns: [
            {
              sender: "CopilotKit",
              receiver: "User",
              content: "Hello! How are you?",
            },
          ],
        },
      },
    },
  });

  const state = agent.state as RootAgentState;

  useEffect(() => {
    console.log('Current Backend Config:', state);
  }, [state]);

  const proverbs = state.agent_config?.frontendState?.proverbs || [];
  const weather = state.agent_config?.frontendState?.weather || [];
  
  const updateUserMouseEvent = (type: "click" | "hover" | "check", value: string | null) => {
    if(!state){
      return;
    }
    agent.setState({
      ...state,
      agent_config: {
        ...(state.agent_config || {}),
        mouseEvent: {
          ...(state.agent_config?.mouseEvent || {}),
          [type === "click" ? "clickedState" : type === "hover" ? "hoveredState" : "checkedState"]: value
        }
      }
    });
  };

  return (
    <div className="flex flex-col gap-8 pb-20">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Proverbs */}
        <div className="lg:col-span-2">
           <ProverbsCard 
              proverbs={proverbs} 
              updateUserMouseEvent={updateUserMouseEvent}
              onUpdateProverbs={(newProverbs) => {
                  agent.setState({
                      ...state,
                      agent_config: {
                          ...(state.agent_config || {}),
                          frontendState: {
                              ...(state.agent_config?.frontendState || {}),
                              proverbs: newProverbs
                          }
                      }
                  })
              }}
          />
        </div>

        {/* Right Column: Weather & Stats */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
             {weather.map((w, i) => (
                <WeatherCard key={i} data={w} />
             ))}
             {weather.length === 0 && (
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center text-slate-400">
                   No weather data available.
                </div>
             )}
          </div>
          
          {/* Example of another card for Todos or Stats could go here */}
        </div>
      </div>

      {/* Debug State */}
      <div className="mt-8 border-t border-white/10 pt-8">
        <details className="group">
          <summary className="cursor-pointer text-slate-500 hover:text-slate-300 transition-colors list-none flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Debug State</span>
            <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <pre className="mt-4 bg-black/40 p-4 rounded-xl text-xs text-emerald-400 font-mono overflow-auto max-h-96 border border-white/5">
              {JSON.stringify(state.agent_config?.frontendState, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}

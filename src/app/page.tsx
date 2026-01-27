"use client";

import { CopilotKitProvider, CopilotSidebar, useAgent, useFrontendTool, useRenderToolCall, } from "@copilotkitnext/react";
import { ProverbsCard } from "@/components/proverbs";
import { WeatherCard } from "@/components/weather";
import { useState, useEffect } from "react";
const runtimeUrl =
  process.env.NEXT_PUBLIC_COPILOTKIT_RUNTIME_URL ??
  "http://localhost:4000/api/copilotkit";




type FieldMetadata = {
  field_name: string;
  field_type: string;
  description: string;
  field_prompt: string;
  schema: Record<string, any>;
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
      <div className="page">
        <main className="content">
          <h1>CopilotKit v2 + Express (Single Route)</h1>
          <p>
            This client connects to the Express runtime at
            <code className="inline-code">{runtimeUrl}</code>.
          </p>
          <p>Try asking it to "roast my name" to trigger the server-side tool.</p>
        </main>
        <CopilotSidebar
          defaultOpen
          width="420px"
          labels={{
            modalHeaderTitle: "CopilotKit",
            chatInputPlaceholder: "Ask CopilotKit anything...",
          }}
        />
      </div>
      <YourMainContent />
    </CopilotKitProvider>
  );
}

const YourMainContent = () => {
  const agent = useAgent();
  console.log(agent.state);
  console.log(agent);
  return (
  <div className="main-content">
    <h2>Your Main Content</h2>
  </div>
  )
}

// function YourMainContent() {
//   // --- 2. 初始化 State (Payload) ---
//   // 這裡我們把 Prompt 和 Parser 策略都透過 initialState 傳給後端
//   const agent = useAgent<RootAgentState>({
//     name: "my_agent", // 必須對應後端 LlmAgent 的 name
//     initialState: {
//       agent_config: {
//         // [Prompt]: 這裡定義業務邏輯，後端會將其注入 System Prompt
//          system_prompt: `
//           You are managing a list of proverbs and weather records.
//           1. 'proverbs': A list of insightful sayings.
//           2. 'weather': Current weather conditions.
//           3. 'todos': A list of tasks to do.
//           4. 'campaigns': A list of SMS messages.
          
//           When users ask to add/remove/change proverbs, update the 'proverbs' array.
//           When users ask to set weather manually, update the 'weather' array.
//           When users ask to add/remove/change todos, update the 'todos' array.
//           When users ask to add/remove/change campaigns, update the 'campaigns' array.
//         `,
//         // [Parser]: 告訴後端用什麼策略合併資料
//         parser_strategy: "merge", 
//         // [FrontendState]: 實際的資料
//         field_schemas: {
//           proverbs: {
//             field_name: "proverbs",
//             field_type: "array",
//             description: "A list of proverbs",
//             field_prompt: `
//             When updating proverbs:
//             - Add new proverbs to the existing list
//             - Keep the format as simple strings
//             - Avoid duplicates
//             - Make them insightful and relevant
//             `.trim(),
//             schema: {
//               type: "array",
//               items: { type: "string" },
//             },
//             parser_strategy: "replace",
//           },
//           weather: {
//             field_name: "weather",
//             field_type: "array",
//             description: "Weather records by location",
//             field_prompt: `
//             When updating weather:
//             - Each record must have: location, temperature, condition
//             - Update existing location if found, otherwise append
//             - Temperature should be numeric in Fahrenheit
//             - Condition should be descriptive (e.g., Sunny, Cloudy, Rainy)
//             `.trim(),
//             schema: {
//               type: "array",
//               items: {
//                 type: "object",
//                 properties: {
//                   location: { type: "string" },
//                   temperature: { type: "number" },
//                   condition: { type: "string" },
//                 },
//                 required: ["location", "temperature", "condition"],
//               },
//             },
//             parser_strategy: "replace",
//           },
//           todos: {
//             field_name: "todos",
//             field_type: "array",
//             description: "Todo items",
//             field_prompt: `
//               When updating todos:
//               - Add new items to the list
//               - Mark completed items with [DONE] prefix
//               - Keep tasks clear and actionable
//             `.trim(),
//             schema: {
//               type: "array",
//               items: { type: "string" },
//             },
//             parser_strategy: "replace",
//           },
//           campaigns: {
//             field_name: "campaigns",
//             field_type: "array",
//             description: "SMS campaigns",
//             field_prompt: `
//               When updating campaigns:
//               - Each campaign needs: id, content, status
//               - Status must be one of: draft, scheduled, sent
//               - Generate unique IDs if not provided (use timestamp-based format)
//               - Content should be concise SMS-friendly text
//                 `.trim(),
//             schema: {
//               type: "array",
//               items: {
//                 type: "object",
//                 properties: {
//                   sender: { type: "string" },
//                   receiver: { type: "string" },
//                   content: { type: "string" },
//                 },
//               },
//             },
//             parser_strategy: "replace",
//           },
//         },

//         frontendState: {
//           proverbs: [
//             "CopilotKit makes generic backends powerful.",
//           ],
//           weather: [
//             {
//               location: "San Francisco",
//               temperature: 70,
//               condition: "Partly Cloudy",
//             },
//           ],
//           todos: [
//             "Buy groceries",
//             "Finish project report",
//           ],
//           campaigns: [
//             {
//               sender: "CopilotKit",
//               receiver: "User",
//               content: "Hello! How are you?",
//             },
//           ],
//         },
//       },
//     },
//   });
//   // agent.state;
//   // 監聽 State 變化 (Debug用)
//   useEffect(() => {
//     console.log('Current Backend Config:', agent.state);
//   }, [agent.state]);

//   // const stateRef = useRef(state);
//   // useEffect(() => {
//   //   stateRef.current = state;
//   // }, [state]);

//   // useEffect(() => {
//   //   const timer = setTimeout(() => {
//   //    const currentState = stateRef.current;
//   //    if (!currentState){
//   //     console.log('no currentState');
//   //     return;
//   //    } 

//   //    setState({
//   //       agent_config: {
//   //         ...(currentState.agent_config || {}),
//   //         frontendState: {
//   //           ...(currentState.agent_config?.frontendState || {}),
//   //           campaigns:[
//   //             ...(currentState.agent_config?.frontendState?.campaigns || []),
//   //             {
//   //               sender: "CopilotKit Hello",
//   //               receiver: "User hhhhhhhh",
//   //               content: "Hello! How are you?",
//   //             }
//   //           ],
//   //         },
//   //       },
//   //     });
//   //   }, 5000);
//   //   return () => clearTimeout(timer);
//   // }, []);

//   // Helper function: 為了讓下游組件比較好拿資料，我們可以做個解構
//   // 如果你的 ProverbsCard 預期的是舊的結構，這裡要做一點轉換
//   const proverbs = state.agent_config?.frontendState?.proverbs || [];
//   const weather = state.agent_config?.frontendState?.weather || [];

//   const updateUserMouseEvent = (type: "click" | "hover" | "check", value: string | null) => {
//     setState({
//       ...state,
//       agent_config: {
//         ...(state.agent_config || {}),
//         mouseEvent: {
//           ...(state.agent_config?.mouseEvent || {}),
//           [type === "click" ? "clickedState" : type === "hover" ? "hoveredState" : "checkedState"]: value
//         }
//       }
//     });
//   };

//   //🪁 Generative UI: 這裡沒有變，因為後端的 get_weather 工具介面沒變
//   useRenderToolCall(
//     {
//       name: "get_weather",
//       description: "Get the weather for a given location.",
//       parameters: [{ name: "location", type: "string", required: true }],
//       render: ({ args, result }) => {
//         return <WeatherCard location={args.location} themeColor={themeColor} />;
//       },
//     },
//     [themeColor],
//   );

//   return (
//     <div
//       style={{ backgroundColor: themeColor }}
//       className="h-screen flex justify-center items-center flex-col transition-colors duration-300"
//     >
//       {/* 注意：這裡傳給子元件的 state 需要適配。
//          如果 ProverbsCard 預期 { proverbs: [...] }，
//          我們需要改寫 ProverbsCard 或是只傳它需要的部分。
//          這裡假設 ProverbsCard 已經改為接收 raw list 或是我們在此處做 setState 的封裝 
//       */}
      
//       {/* 更進階的做法：封裝 setState 讓子元件不知道 agent_config 的存在 
//          但為了演示，這裡假設我們傳入整個 state 結構讓子元件處理，
//          或者你可以只傳 list 和一個專門更新 list 的 callback
//       */}
//       <div className="flex flex-col gap-4">
//         {/* 顯示 Proverbs (這裡做一個簡單的示意，你需要調整你的 ProverbsCard 接收 props 的方式) */}
//         <ProverbsCard 
//             // 這裡傳入解構後的數據
//             proverbs={proverbs} 
//             updateUserMouseEvent={updateUserMouseEvent}
//             // 如果 ProverbsCard 內部會呼叫 setState，你需要封裝一下
//             onUpdateProverbs={(newProverbs) => {
//                 setState({
//                     ...state,
//                     agent_config: {
//                         ...(state.agent_config || {}),
//                         frontendState: {
//                             ...(state.agent_config?.frontendState || {}),
//                             proverbs: newProverbs
//                         }
//                     }
//                 })
//             }}
//         />
        
//         {/* 用於 Debug 顯示目前 State */}
//         <pre className="bg-black/20 p-4 rounded text-xs text-white max-w-md overflow-auto">
//             {JSON.stringify(state.agent_config?.frontendState, null, 2)}
//         </pre>
//       </div>
//     </div>
//   );
// }
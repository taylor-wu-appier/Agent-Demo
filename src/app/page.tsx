"use client";

import { ProverbsCard } from "@/components/proverbs";
import { WeatherCard } from "@/components/weather";
// 假設你原本的 types 定義在這裡，我們需要稍微修改它，或者在檔案內重新定義
// import { AgentState } from "@/lib/types"; 
import {
  useCoAgent,
  useFrontendTool,
  useRenderToolCall,
} from "@copilotkit/react-core";
import { CopilotKitCSSProperties, CopilotSidebar } from "@copilotkit/react-ui";
import { useState, useEffect } from "react";

type SMSMessage = {
  sender: string;
  receiver: string;
  content: string;
};

// --- 1. 定義新的 State 結構 ---
// 這對應後端的 FrontendConfig
type FrontendStateData = {
  proverbs: string[];
  weather: {
    location: string;
    temperature: number;
    condition: string;
  }[];
  todos: string[];
  campaigns: SMSMessage[];
};

type AgentConfig = {
  prompt: string;
  frontendState: FrontendStateData;
  parser_strategy: "replace" | "merge" | "append_list_items";
};

// 這是 CopilotKit 傳輸的根狀態
type RootAgentState = {
  agent_config: AgentConfig;
};

export default function CopilotKitPage() {
  const [themeColor, setThemeColor] = useState("#6366f1");

  useFrontendTool({
    name: "setThemeColor",
    parameters: [
      {
        name: "themeColor",
        description: "The theme color to set.",
        required: true,
      },
    ],
    handler({ themeColor }) {
      setThemeColor(themeColor);
    },
  });

  return (
    <main
      style={
        { "--copilot-kit-primary-color": themeColor } as CopilotKitCSSProperties
      }
    >
      <CopilotSidebar
        disableSystemMessage={true}
        clickOutsideToClose={false}
        defaultOpen={true}
        labels={{
          title: "Dynamic Agent",
          initial: "👋 Hello! I am configured by your frontend state.",
        }}
        suggestions={[
            // ... suggestions 可以保持不變
            { title: "Add Proverb", message: "Add a proverb about coding." },
            { title: "Check Weather", message: "What's the weather in Tokyo?" }
        ]}
      >
        <YourMainContent themeColor={themeColor} />
      </CopilotSidebar>
    </main>
  );
}

function YourMainContent({ themeColor }: { themeColor: string }) {
  // --- 2. 初始化 State (Payload) ---
  // 這裡我們把 Prompt 和 Parser 策略都透過 initialState 傳給後端
  const { state, setState } = useCoAgent<RootAgentState>({
    name: "my_agent", // 必須對應後端 LlmAgent 的 name
    initialState: {
      agent_config: {
        // [Prompt]: 這裡定義業務邏輯，後端會將其注入 System Prompt
        prompt: `
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
        // [Parser]: 告訴後端用什麼策略合併資料
        parser_strategy: "merge", 
        // [FrontendState]: 實際的資料
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

  // Helper function: 為了讓下游組件比較好拿資料，我們可以做個解構
  // 如果你的 ProverbsCard 預期的是舊的結構，這裡要做一點轉換
  const proverbs = state.agent_config?.frontendState?.proverbs || [];
  const weather = state.agent_config?.frontendState?.weather || [];

  // 監聽 State 變化 (Debug用)
  useEffect(() => {
    console.log('Current Backend Config:', state.agent_config);
  }, [state]);

  // useEffect(() => {
  //   setTimeout(() => {
  //    setState({
  //       ...state,
  //       agent_config: {
  //         ...state.agent_config,
  //         frontendState: {
  //           ...state.agent_config?.frontendState,
  //           campaigns:[
  //             ...state.agent_config?.frontendState?.campaigns ,
  //             {
  //               sender: "CopilotKit Hello",
  //               receiver: "User hhhhhhhh",
  //               content: "Hello! How are you?",
  //             }
  //           ],
  //         },
  //       },
  //     });
  //   }, 20000);
  // }, []);

  //🪁 Generative UI: 這裡沒有變，因為後端的 get_weather 工具介面沒變
  useRenderToolCall(
    {
      name: "get_weather",
      description: "Get the weather for a given location.",
      parameters: [{ name: "location", type: "string", required: true }],
      render: ({ args, result }) => {
        return <WeatherCard location={args.location} themeColor={themeColor} />;
      },
    },
    [themeColor],
  );

  return (
    <div
      style={{ backgroundColor: themeColor }}
      className="h-screen flex justify-center items-center flex-col transition-colors duration-300"
    >
      {/* 注意：這裡傳給子元件的 state 需要適配。
         如果 ProverbsCard 預期 { proverbs: [...] }，
         我們需要改寫 ProverbsCard 或是只傳它需要的部分。
         這裡假設 ProverbsCard 已經改為接收 raw list 或是我們在此處做 setState 的封裝 
      */}
      
      {/* 更進階的做法：封裝 setState 讓子元件不知道 agent_config 的存在 
         但為了演示，這裡假設我們傳入整個 state 結構讓子元件處理，
         或者你可以只傳 list 和一個專門更新 list 的 callback
      */}
      <div className="flex flex-col gap-4">
        {/* 顯示 Proverbs (這裡做一個簡單的示意，你需要調整你的 ProverbsCard 接收 props 的方式) */}
        <ProverbsCard 
            // 這裡傳入解構後的數據
            state={proverbs} 
            // 如果 ProverbsCard 內部會呼叫 setState，你需要封裝一下
            setState={(newProverbs) => {
                setState({
                    ...state,
                    agent_config: {
                        ...state.agent_config,
                        frontendState: {
                            ...state.agent_config.frontendState,
                            proverbs: newProverbs
                        }
                    }
                })
            }}
        />
        
        {/* 用於 Debug 顯示目前 State */}
        <pre className="bg-black/20 p-4 rounded text-xs text-white max-w-md overflow-auto">
            {JSON.stringify(state.agent_config?.frontendState, null, 2)}
        </pre>
      </div>
    </div>
  );
}
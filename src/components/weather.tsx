
// Simple sun icon for the weather card
function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-14 h-14 text-yellow-200">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeWidth="2" stroke="currentColor" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-14 h-14 text-gray-200">
      <path d="M17 19h-6c-2.76 0-5-2.24-5-5 0-2.64 2.05-4.78 4.65-4.96A5.49 5.49 0 0 1 15 5c2.7 0 4.95 1.94 5.38 4.51A4 4 0 0 1 17 19z" />
    </svg>
  );
}

function RainIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-14 h-14 text-blue-200">
      <path d="M17 19h-6c-2.76 0-5-2.24-5-5 0-2.64 2.05-4.78 4.65-4.96A5.49 5.49 0 0 1 15 5c2.7 0 4.95 1.94 5.38 4.51A4 4 0 0 1 17 19z" />
      <path d="M10 20v2M14 20v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
}

const getConditionStyles = (condition: string) => {
  const lower = condition.toLowerCase();
  if (lower.includes('sunny') || lower.includes('clear')) {
    return {
      bg: 'bg-gradient-to-br from-amber-400 to-orange-500',
      icon: <SunIcon />
    };
  }
  if (lower.includes('cloud') || lower.includes('overcast')) {
    return {
      bg: 'bg-gradient-to-br from-slate-400 to-slate-600',
      icon: <CloudIcon />
    };
  }
  if (lower.includes('rain') || lower.includes('drizzle') || lower.includes('storm')) {
    return {
      bg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      icon: <RainIcon />
    };
  }
  if (lower.includes('snow')) {
    return {
      bg: 'bg-gradient-to-br from-blue-100 to-blue-300',
      icon: <CloudIcon />
    };
  }
  // Default
  return {
    bg: 'bg-gradient-to-br from-blue-500 to-purple-600',
    icon: <SunIcon />
  };
};

// Weather card component
export function WeatherCard({ data, themeColor }: { data: WeatherData, themeColor?: string }) {
  const style = getConditionStyles(data.condition);
  
  // If themeColor is explicitly provided (and not undefined), use it as a style override
  // Otherwise use the class based gradient
  const containerStyle = themeColor ? { backgroundColor: themeColor } : undefined;
  const containerClass = themeColor 
    ? "rounded-2xl shadow-lg overflow-hidden relative group transition-transform hover:scale-[1.02]" 
    : `rounded-2xl shadow-lg overflow-hidden relative group transition-transform hover:scale-[1.02] ${style.bg}`;

  return (
    <div
      style={containerStyle}
      className={containerClass}
    >
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="p-6 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white capitalize drop-shadow-sm">{data.location}</h3>
            <p className="text-white/80 text-sm font-medium tracking-wide uppercase">Current Weather</p>
          </div>
          <div className="drop-shadow-md transform transition-transform group-hover:rotate-12 duration-500">
             {style.icon}
          </div>
        </div>
        
        <div className="mt-6 flex items-end justify-between">
          <div className="text-5xl font-bold text-white drop-shadow-md">{data.temperature}°</div>
          <div className="text-lg text-white/90 font-medium">{data.condition}</div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-white/20">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-white/70 text-xs uppercase tracking-wider">Humidity</p>
              <p className="text-white font-semibold">45%</p>
            </div>
            <div>
              <p className="text-white/70 text-xs uppercase tracking-wider">Wind</p>
              <p className="text-white font-semibold">5 mph</p>
            </div>
            <div>
              <p className="text-white/70 text-xs uppercase tracking-wider">Feels Like</p>
              <p className="text-white font-semibold">{data.temperature + 2}°</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

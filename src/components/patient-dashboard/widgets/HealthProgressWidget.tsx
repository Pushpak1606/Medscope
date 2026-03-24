import { TrendingUp, Activity } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { day: 'Mon', value: 3 },
  { day: 'Tue', value: 4 },
  { day: 'Wed', value: 2 },
  { day: 'Thu', value: 5 },
  { day: 'Fri', value: 4 },
  { day: 'Sat', value: 6 },
  { day: 'Sun', value: 7 },
];

const HealthProgressWidget = () => {
  return (
    <div className="h-full flex flex-col rounded-[2.5rem] bg-card border border-border/50 shadow-sm p-6 sm:p-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full pointer-events-none"></div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" /> Health Progress
          </h3>
          <p className="text-xs text-muted-foreground font-medium mt-1">Weekly care activity</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
          <TrendingUp className="h-5 w-5" />
        </div>
      </div>

      <div className="h-32 w-full mt-2 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
              itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
              labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(var(--primary))" 
              strokeWidth={4} 
              dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "hsl(var(--background))" }}
              activeDot={{ r: 6, fill: "hsl(var(--primary))" }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-between bg-muted/30 p-3 rounded-xl border border-border/40">
        <span className="text-sm font-semibold text-foreground">5 of 7 days active</span>
        <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-md">Good</span>
      </div>
    </div>
  );
};

export default HealthProgressWidget;

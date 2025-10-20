import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface MoodChartProps {
  data: { day: string; value: number }[];
}

export const MoodChart = ({ data }: MoodChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data}>
        <XAxis
          dataKey="day"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis hide />
        <Line
          type="monotone"
          dataKey="value"
          stroke="hsl(var(--primary))"
          strokeWidth={3}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

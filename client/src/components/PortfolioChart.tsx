import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface PortfolioProject {
  name: string;
  value: number;
  change: number;
  ownership?: number;
}

interface PortfolioChartProps {
  projects: PortfolioProject[];
  showOwnership?: boolean;
  selectedProject?: string;
}

const PortfolioChart = ({ projects, showOwnership = false, selectedProject }: PortfolioChartProps) => {
  const COLORS = ['#c8956d', '#d4926f', '#e4a574', '#f4b97a', '#b8845e', '#a67c56'];

  // Portfolio value breakdown
  const portfolioData = projects.map((project, index) => ({
    ...project,
    color: COLORS[index % COLORS.length]
  }));

  // Ownership data for selected project
  const ownershipData = selectedProject ? [
    { name: 'Your Ownership', value: projects.find(p => p.name === selectedProject)?.ownership || 0 },
    { name: 'Other', value: 100 - (projects.find(p => p.name === selectedProject)?.ownership || 0) }
  ] : [];

  if (showOwnership && selectedProject) {
    return (
      <div className="bg-[var(--card-bg)] border border-[var(--subtle-border)] rounded-lg p-4">
        <h3 className="text-sm font-medium text-[var(--text-primary)] mb-4">
          {selectedProject} - Ownership
        </h3>
        <div className="h-32 w-32 mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ownershipData}
                cx="50%"
                cy="50%"
                innerRadius={20}
                outerRadius={60}
                dataKey="value"
              >
                {ownershipData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === 0 ? '#c8956d' : '#e1e5e9'} 
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center mt-2">
          <span className="text-lg font-semibold text-[var(--text-primary)]">
            {ownershipData[0]?.value}%
          </span>
          <p className="text-xs text-[var(--text-secondary)]">Your Share</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--subtle-border)] rounded-lg p-6">
      <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Portfolio Holdings</h3>
      
      {/* Bar chart showing value changes */}
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={portfolioData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-line)" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
              label={{ value: 'Change %', angle: -90, position: 'insideLeft' }}
            />
            <Bar 
              dataKey="change" 
              fill="#c8956d"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Project details */}
      <div className="space-y-2">
        {portfolioData.map((project, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-[var(--grid-line)] last:border-b-0">
            <div className="flex items-center space-x-3">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: project.color }}
              />
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {project.name}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                ${(project.value / 1000).toFixed(0)}K
              </div>
              <div className={`text-xs ${project.change >= 0 ? 'text-[var(--data-success)]' : 'text-[var(--data-danger)]'}`}>
                {project.change >= 0 ? '+' : ''}{project.change.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioChart;
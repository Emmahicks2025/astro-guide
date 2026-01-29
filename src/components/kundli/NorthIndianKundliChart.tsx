import { KundliData } from "@/lib/kundli";

interface NorthIndianKundliChartProps {
  data: KundliData;
  size?: number;
  showLabels?: boolean;
  className?: string;
}

const NorthIndianKundliChart = ({ 
  data, 
  size = 300, 
  showLabels = true,
  className = "" 
}: NorthIndianKundliChartProps) => {
  // House positions in North Indian chart (diamond layout)
  // Houses are numbered 1-12, starting from top and going clockwise
  const housePositions: Record<number, { x: number; y: number }> = {
    1: { x: 0.5, y: 0.15 },    // Top center (Lagna)
    2: { x: 0.25, y: 0.25 },   // Upper left
    3: { x: 0.12, y: 0.5 },    // Left upper
    4: { x: 0.25, y: 0.75 },   // Left lower
    5: { x: 0.5, y: 0.85 },    // Bottom center
    6: { x: 0.75, y: 0.75 },   // Right lower
    7: { x: 0.88, y: 0.5 },    // Right upper
    8: { x: 0.75, y: 0.25 },   // Upper right
    9: { x: 0.5, y: 0.5 },     // Center - actually house 9 is different
    10: { x: 0.5, y: 0.5 },    // Adjusted positions
    11: { x: 0.5, y: 0.5 },
    12: { x: 0.5, y: 0.5 },
  };

  // Correct North Indian house layout coordinates for placing planets
  const getHouseCenter = (house: number): { x: number; y: number } => {
    const positions: Record<number, { x: number; y: number }> = {
      1: { x: 0.5, y: 0.18 },
      2: { x: 0.25, y: 0.32 },
      3: { x: 0.18, y: 0.5 },
      4: { x: 0.25, y: 0.68 },
      5: { x: 0.5, y: 0.82 },
      6: { x: 0.75, y: 0.68 },
      7: { x: 0.82, y: 0.5 },
      8: { x: 0.75, y: 0.32 },
      9: { x: 0.5, y: 0.42 },   // Inner top
      10: { x: 0.42, y: 0.5 },  // Inner left
      11: { x: 0.5, y: 0.58 },  // Inner bottom
      12: { x: 0.58, y: 0.5 },  // Inner right
    };
    return positions[house] || { x: 0.5, y: 0.5 };
  };

  // Get planets for a specific house
  const getPlanetsInHouse = (house: number) => {
    return data.planets.filter(p => p.house === house);
  };

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="drop-shadow-lg"
      >
        {/* Outer square with gradient */}
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect
          x="5"
          y="5"
          width="90"
          height="90"
          fill="url(#chartGradient)"
          stroke="url(#borderGradient)"
          strokeWidth="1"
          rx="2"
        />

        {/* Outer diamond (rotated square) */}
        <polygon
          points="50,5 95,50 50,95 5,50"
          fill="none"
          stroke="url(#borderGradient)"
          strokeWidth="0.8"
        />

        {/* Inner diamond */}
        <polygon
          points="50,25 75,50 50,75 25,50"
          fill="none"
          stroke="url(#borderGradient)"
          strokeWidth="0.6"
        />

        {/* Cross lines for outer houses */}
        <line x1="50" y1="5" x2="50" y2="25" stroke="url(#borderGradient)" strokeWidth="0.5" />
        <line x1="95" y1="50" x2="75" y2="50" stroke="url(#borderGradient)" strokeWidth="0.5" />
        <line x1="50" y1="95" x2="50" y2="75" stroke="url(#borderGradient)" strokeWidth="0.5" />
        <line x1="5" y1="50" x2="25" y2="50" stroke="url(#borderGradient)" strokeWidth="0.5" />

        {/* Diagonal lines connecting diamonds */}
        <line x1="5" y1="5" x2="25" y2="25" stroke="url(#borderGradient)" strokeWidth="0.5" opacity="0.5" />
        <line x1="95" y1="5" x2="75" y2="25" stroke="url(#borderGradient)" strokeWidth="0.5" opacity="0.5" />
        <line x1="95" y1="95" x2="75" y2="75" stroke="url(#borderGradient)" strokeWidth="0.5" opacity="0.5" />
        <line x1="5" y1="95" x2="25" y2="75" stroke="url(#borderGradient)" strokeWidth="0.5" opacity="0.5" />

        {/* Inner cross */}
        <line x1="25" y1="25" x2="75" y2="75" stroke="url(#borderGradient)" strokeWidth="0.4" opacity="0.3" />
        <line x1="75" y1="25" x2="25" y2="75" stroke="url(#borderGradient)" strokeWidth="0.4" opacity="0.3" />

        {/* House numbers */}
        {showLabels && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((house) => {
          const pos = getHouseCenter(house);
          return (
            <text
              key={`house-${house}`}
              x={pos.x * 100}
              y={pos.y * 100 - 5}
              textAnchor="middle"
              fontSize="3"
              fill="hsl(var(--muted-foreground))"
              opacity="0.5"
            >
              {house}
            </text>
          );
        })}

        {/* Planets in houses */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((house) => {
          const planets = getPlanetsInHouse(house);
          const pos = getHouseCenter(house);
          
          return planets.map((planet, idx) => (
            <g key={`${planet.planet}-${house}`}>
              <text
                x={pos.x * 100 + (idx * 6) - (planets.length * 3)}
                y={pos.y * 100 + 3}
                textAnchor="middle"
                fontSize="5"
                fontWeight="bold"
                fill="hsl(var(--primary))"
                className="font-display"
              >
                {planet.symbol}
              </text>
              {planet.isRetrograde && (
                <text
                  x={pos.x * 100 + (idx * 6) - (planets.length * 3) + 3}
                  y={pos.y * 100}
                  textAnchor="middle"
                  fontSize="2.5"
                  fill="hsl(var(--destructive))"
                >
                  R
                </text>
              )}
            </g>
          ));
        })}

        {/* Lagna marker */}
        <text
          x="50"
          y="12"
          textAnchor="middle"
          fontSize="4"
          fontWeight="bold"
          fill="hsl(var(--accent))"
        >
          Asc
        </text>
      </svg>

      {/* Lagna sign label */}
      {showLabels && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground text-center">
          <span className="font-medium text-primary">{data.lagnaSign}</span> Lagna
        </div>
      )}
    </div>
  );
};

export default NorthIndianKundliChart;

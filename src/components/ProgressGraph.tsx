import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { colors, spacing, typography } from '../theme';

export interface ProgressDataPoint {
  date: string;
  value: number;
}

export interface ProgressGraphProps {
  data: ProgressDataPoint[];
  width?: number;
  height?: number;
  showLabels?: boolean;
  color?: string;
}

export const ProgressGraph: React.FC<ProgressGraphProps> = ({
  data,
  width = Dimensions.get('window').width - spacing.screenPadding * 2,
  height = 200,
  showLabels = true,
  color = colors.primary,
}) => {
  // Memoize expensive calculations
  const { maxValue, minValue, points } = useMemo(() => {
    if (!data || data.length === 0) {
      return { maxValue: 1, minValue: 0, points: [] };
    }

    // Find min and max in a single pass
    let max = data[0].value;
    let min = data[0].value;
    for (let i = 1; i < data.length; i++) {
      const value = data[i].value;
      if (value > max) max = value;
      if (value < min) min = value;
    }
    // Ensure we have a valid range
    max = Math.max(max, 1);
    min = Math.min(min, 0);
    const rangeVal = max - min || 1;

    const graphHeight = height - (showLabels ? 40 : 20);
    const graphWidth = width - 40;
    const pointWidth = graphWidth / Math.max(data.length - 1, 1);

    const getY = (value: number) => {
      const normalized = (value - min) / rangeVal;
      return graphHeight - normalized * graphHeight + 10;
    };

    const pts = data.map((point, index) => ({
      x: 20 + index * pointWidth,
      y: getY(point.value),
      value: point.value,
      date: point.date,
    }));

    return { maxValue: max, minValue: min, points: pts };
  }, [data, height, width, showLabels]);

  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { width, height }]}>
        <Text style={styles.noDataText}>No data available</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { width, height }]}>
      {/* Y-axis */}
      <View style={styles.yAxis}>
        <Text style={styles.axisLabel}>{maxValue.toFixed(0)}</Text>
        <Text style={styles.axisLabel}>{minValue.toFixed(0)}</Text>
      </View>

      {/* Graph area */}
      <View style={styles.graphArea}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
          <View
            key={`grid-${index}`}
            style={[
              styles.gridLine,
              {
                top: 10 + graphHeight * ratio,
                width: graphWidth,
              },
            ]}
          />
        ))}

        {/* Line graph */}
        {points.map((point, index) => {
          if (index === 0) {
            return null;
          }
          const prevPoint = points[index - 1];
          const angle = Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x);
          const length = Math.sqrt(
            Math.pow(point.x - prevPoint.x, 2) + Math.pow(point.y - prevPoint.y, 2),
          );

          return (
            <View
              key={`line-${index}`}
              style={[
                styles.line,
                {
                  position: 'absolute',
                  left: prevPoint.x,
                  top: prevPoint.y,
                  width: length,
                  transform: [{ rotate: `${angle}rad` }],
                  backgroundColor: color,
                },
              ]}
            />
          );
        })}

        {/* Data points */}
        {points.map((point, index) => (
          <View
            key={`point-${index}`}
            style={[
              styles.point,
              {
                left: point.x - 4,
                top: point.y - 4,
                backgroundColor: color,
                borderColor: colors.white,
              },
            ]}
          />
        ))}
      </View>

      {/* X-axis labels */}
      {showLabels && (
        <View style={styles.xAxis}>
          {data.map((point, index) => {
            if (data.length > 7 && index % 2 !== 0) {
              return null;
            }
            return (
              <Text
                key={`label-${index}`}
                style={[styles.axisLabel, { position: 'absolute', left: points[index].x - 20 }]}
              >
                {point.date}
              </Text>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radiusMedium,
    padding: spacing.sm,
    position: 'relative',
  },
  noDataText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: '40%',
  },
  yAxis: {
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 40,
    width: 20,
    justifyContent: 'space-between',
  },
  xAxis: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 30,
  },
  axisLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  graphArea: {
    marginLeft: 20,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    height: 1,
    backgroundColor: colors.borderLight,
  },
  line: {
    height: 2,
  },
  point: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
  },
});

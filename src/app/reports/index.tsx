import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ReportsScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Reports</Text>
          <Text style={styles.subtitle}>
            Track your gym performance
          </Text>
        </View>
      </View>

      {/* Revenue */}
      <Text style={styles.sectionTitle}>Revenue</Text>

      <View style={styles.revenueCard}>
        <Text style={styles.revenueLabel}>
          This Month
        </Text>

        <Text style={styles.revenueValue}>
          ₹0
        </Text>

        <View style={styles.revenueBottom}>
          <Text style={styles.revenueChange}>
            0% from last month
          </Text>

          <Text style={styles.revenueIcon}>₹</Text>
        </View>
      </View>

      {/* Statistics */}
      <Text style={styles.sectionTitle}>
        Statistics
      </Text>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, styles.blue]}>
            <Text style={styles.iconText}>👥</Text>
          </View>

          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>
            New Members
          </Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, styles.green]}>
            <Text style={styles.iconText}>✓</Text>
          </View>

          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>
            Renewals
          </Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, styles.orange]}>
            <Text style={styles.iconText}>⏰</Text>
          </View>

          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>
            Expired
          </Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, styles.purple]}>
            <Text style={styles.iconText}>★</Text>
          </View>

          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>
            Active Plans
          </Text>
        </View>
      </View>

      {/* Monthly Activity */}
      <Text style={styles.sectionTitle}>
        Monthly Activity
      </Text>

      <View style={styles.chartCard}>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartIcon}>▥</Text>

          <Text style={styles.chartTitle}>
            No activity data
          </Text>

          <Text style={styles.chartSubtitle}>
            Your monthly statistics will appear here.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },

  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 5,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
    marginTop: 4,
  },

  revenueCard: {
    backgroundColor: '#2563EB',
    borderRadius: 18,
    padding: 22,
    marginBottom: 26,
  },

  revenueLabel: {
    color: '#DBEAFE',
    fontSize: 14,
  },

  revenueValue: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
    marginTop: 5,
  },

  revenueBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
  },

  revenueChange: {
    color: '#BFDBFE',
    fontSize: 12,
  },

  revenueIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.18)',
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingTop: 8,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 12,
  },

  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  blue: {
    backgroundColor: '#DBEAFE',
  },

  green: {
    backgroundColor: '#DCFCE7',
  },

  orange: {
    backgroundColor: '#FFEDD5',
  },

  purple: {
    backgroundColor: '#F3E8FF',
  },

  iconText: {
    fontSize: 18,
  },

  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
  },

  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },

  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
  },

  chartPlaceholder: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },

  chartIcon: {
    fontSize: 34,
    color: '#94A3B8',
    marginBottom: 12,
  },

  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },

  chartSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
  },
});

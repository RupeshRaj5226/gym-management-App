import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import BottomNav from '@/components/bottom-nav';

const API_URL = 'http://localhost:5027';

type ApiMember = {
  id: number;
  fullName: string;
  phoneNumber: string;
  email?: string | null;
};

export default function DashboardScreen() {
  const [totalMembers, setTotalMembers] = useState(0);
  const [activeMembers, setActiveMembers] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/members`,
      );

      if (!response.ok) {
        const errorText = await response.text();

        console.log(
          'DASHBOARD MEMBERS ERROR:',
          response.status,
          errorText,
        );

        return;
      }

      const data = await response.json();

      console.log('DASHBOARD MEMBERS:', data);

      const apiMembers: ApiMember[] = Array.isArray(data)
        ? data
        : data.members ?? [];

      setTotalMembers(apiMembers.length);

      /*
       * Abhi tumhare Member model me membership status nahi hai.
       * Isliye jo members database me hain unko active count
       * ke roop me show kar rahe hain.
       *
       * Jab Membership module connect karenge tab
       * actual Active/Expired status yahan calculate hoga.
       */
      setActiveMembers(apiMembers.length);
    } catch (error) {
      console.log(
        'DASHBOARD LOAD ERROR:',
        error,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Welcome back 👋
            </Text>

            <Text style={styles.ownerName}>
              Gym Owner
            </Text>
          </View>

          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>
              G
            </Text>
          </View>
        </View>

        {/* Summary */}
        <Text style={styles.sectionTitle}>
          Overview
        </Text>

        <View style={styles.grid}>
          {/* Total Members */}
          <View style={styles.card}>
            <View
              style={[
                styles.iconBox,
                styles.blueIcon,
              ]}
            >
              <Text style={styles.iconText}>
                👥
              </Text>
            </View>

            {loading ? (
              <ActivityIndicator
                size="small"
                color="#2563EB"
              />
            ) : (
              <Text style={styles.cardValue}>
                {totalMembers}
              </Text>
            )}

            <Text style={styles.cardTitle}>
              Total Members
            </Text>
          </View>

          {/* Active Members */}
          <View style={styles.card}>
            <View
              style={[
                styles.iconBox,
                styles.greenIcon,
              ]}
            >
              <Text style={styles.iconText}>
                ✓
              </Text>
            </View>

            {loading ? (
              <ActivityIndicator
                size="small"
                color="#16A34A"
              />
            ) : (
              <Text style={styles.cardValue}>
                {activeMembers}
              </Text>
            )}

            <Text style={styles.cardTitle}>
              Active Members
            </Text>
          </View>

          {/* Expiring Soon */}
          <View style={styles.card}>
            <View
              style={[
                styles.iconBox,
                styles.orangeIcon,
              ]}
            >
              <Text style={styles.iconText}>
                ⏰
              </Text>
            </View>

            <Text style={styles.cardValue}>
              0
            </Text>

            <Text style={styles.cardTitle}>
              Expiring Soon
            </Text>
          </View>

          {/* This Month */}
          <View style={styles.card}>
            <View
              style={[
                styles.iconBox,
                styles.purpleIcon,
              ]}
            >
              <Text style={styles.iconText}>
                ₹
              </Text>
            </View>

            <Text style={styles.cardValue}>
              ₹0
            </Text>

            <Text style={styles.cardTitle}>
              This Month
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>
          Quick Actions
        </Text>

        <View style={styles.actionCard}>
          <View style={styles.actionIcon}>
            <Text style={styles.actionIconText}>
              +
            </Text>
          </View>

          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>
              Add New Member
            </Text>

            <Text style={styles.actionSubtitle}>
              Register a new gym member
            </Text>
          </View>

          <Text style={styles.arrow}>
            ›
          </Text>
        </View>

        <View style={styles.actionCard}>
          <View style={styles.actionIcon}>
            <Text style={styles.actionIconText}>
              ↻
            </Text>
          </View>

          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>
              Renew Membership
            </Text>

            <Text style={styles.actionSubtitle}>
              Renew an existing membership
            </Text>
          </View>

          <Text style={styles.arrow}>
            ›
          </Text>
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>
          Recent Activity
        </Text>

        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>
            📋
          </Text>

          <Text style={styles.emptyTitle}>
            No recent activity
          </Text>

          <Text style={styles.emptySubtitle}>
            Member and membership activity will
            appear here.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  container: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 30,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },

  greeting: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },

  ownerName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
  },

  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
    marginTop: 8,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  blueIcon: {
    backgroundColor: '#DBEAFE',
  },

  greenIcon: {
    backgroundColor: '#DCFCE7',
  },

  orangeIcon: {
    backgroundColor: '#FFEDD5',
  },

  purpleIcon: {
    backgroundColor: '#F3E8FF',
  },

  iconText: {
    fontSize: 19,
  },

  cardValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },

  cardTitle: {
    fontSize: 13,
    color: '#64748B',
  },

  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionIconText: {
    color: '#2563EB',
    fontSize: 24,
    fontWeight: '600',
  },

  actionContent: {
    flex: 1,
    marginLeft: 14,
  },

  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },

  actionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },

  arrow: {
    fontSize: 28,
    color: '#94A3B8',
    marginLeft: 8,
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  emptyIcon: {
    fontSize: 32,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },

  emptySubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
});

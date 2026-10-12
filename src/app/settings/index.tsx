import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function SettingsScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>
          Manage your gym settings
        </Text>
      </View>

      {/* Profile */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>G</Text>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            Gym Owner
          </Text>

          <Text style={styles.profileEmail}>
            Owner account
          </Text>
        </View>

        <Text style={styles.arrow}>›</Text>
      </View>

      {/* General */}
      <Text style={styles.sectionTitle}>
        General
      </Text>

      <View style={styles.menuCard}>
        <Pressable style={styles.menuItem}>
          <View style={[styles.menuIcon, styles.blueIcon]}>
            <Text style={styles.iconText}>🏢</Text>
          </View>

          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>
              Gym Profile
            </Text>

            <Text style={styles.menuSubtitle}>
              Gym name, address and contact
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <View style={styles.divider} />

        <Pressable style={styles.menuItem}>
          <View style={[styles.menuIcon, styles.greenIcon]}>
            <Text style={styles.iconText}>₹</Text>
          </View>

          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>
              Membership Plans
            </Text>

            <Text style={styles.menuSubtitle}>
              Manage prices and durations
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </Pressable>
      </View>

      {/* Preferences */}
      <Text style={styles.sectionTitle}>
        Preferences
      </Text>

      <View style={styles.menuCard}>
        <Pressable style={styles.menuItem}>
          <View style={[styles.menuIcon, styles.orangeIcon]}>
            <Text style={styles.iconText}>🔔</Text>
          </View>

          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>
              Notifications
            </Text>

            <Text style={styles.menuSubtitle}>
              Membership reminders and alerts
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <View style={styles.divider} />

        <Pressable style={styles.menuItem}>
          <View style={[styles.menuIcon, styles.purpleIcon]}>
            <Text style={styles.iconText}>◉</Text>
          </View>

          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>
              App Preferences
            </Text>

            <Text style={styles.menuSubtitle}>
              Appearance and app options
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </Pressable>
      </View>

      {/* Logout */}
      <Pressable style={styles.logoutButton}>
        <Text style={styles.logoutIcon}>↪</Text>

        <Text style={styles.logoutText}>
          Logout
        </Text>
      </Pressable>

      <Text style={styles.version}>
        Gym Management v1.0.0
      </Text>
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
    marginBottom: 22,
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

  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 26,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },

  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },

  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },

  profileEmail: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },

  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
    overflow: 'hidden',
  },

  menuItem: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 18,
  },

  menuContent: {
    flex: 1,
    marginLeft: 14,
  },

  menuTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },

  menuSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },

  arrow: {
    fontSize: 28,
    color: '#94A3B8',
    marginLeft: 8,
  },

  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 72,
  },

  logoutButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },

  logoutIcon: {
    fontSize: 20,
    color: '#DC2626',
    marginRight: 8,
  },

  logoutText: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: '700',
  },

  version: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 20,
  },
});

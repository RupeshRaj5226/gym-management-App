import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
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
      const response = await fetch(`${API_URL}/api/members`);

      if (!response.ok) {
        console.log('DASHBOARD MEMBERS ERROR:', response.status, await response.text());
        return;
      }

      const data = await response.json();
      const apiMembers: ApiMember[] = Array.isArray(data) ? data : data.members ?? [];
      setTotalMembers(apiMembers.length);

      // The current Member API does not expose membership status yet.
      // Keep the existing count behavior until the membership data is available.
      setActiveMembers(apiMembers.length);
    } catch (error) {
      console.log('DASHBOARD LOAD ERROR:', error);
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
        <View style={styles.topLine}>
          <View style={styles.brandMark}><Text style={styles.brandMarkText}>F</Text></View>
          <View style={styles.brandCopy}>
            <Text style={styles.brandTitle}>FORGE <Text style={styles.brandAccent}>FITNESS</Text></Text>
            <Text style={styles.brandSubtitle}>GYM MANAGEMENT</Text>
          </View>
          <View style={styles.profileCircle}><Text style={styles.profileText}>G</Text></View>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroGlow} />
          <View style={styles.heroContent}>
            <View style={styles.eyebrow}><View style={styles.liveDot} /><Text style={styles.eyebrowText}>YOUR FITNESS BUSINESS</Text></View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.ownerName}>Gym Owner<Text style={styles.orangeDot}>.</Text></Text>
            <Text style={styles.heroSubtitle}>Small steps. Stronger community.</Text>
            <Pressable style={styles.primaryButton} onPress={() => router.push('/members')}>
              <Text style={styles.primaryButtonText}>＋  Add member</Text>
              <Text style={styles.buttonArrow}>↗</Text>
            </Pressable>
          </View>
          <View style={styles.heroOrb}><Text style={styles.heroOrbText}>FIT</Text><View style={styles.orbRing} /></View>
          <Text style={styles.heroNumber}>01</Text>
        </View>

        <View style={styles.sectionHeading}>
          <View><Text style={styles.sectionKicker}>AT A GLANCE</Text><Text style={styles.sectionTitle}>Your overview</Text></View>
          <View style={styles.periodPill}><Text style={styles.periodText}>LIVE SNAPSHOT</Text></View>
        </View>

        <View style={styles.grid}>
          <Pressable accessibilityRole="button" accessibilityLabel="Open members" style={[styles.statCard, styles.statCardOrange]} onPress={() => router.push('/members')}>
            <View style={styles.statTop}><View style={[styles.iconBox, styles.iconOrange]}><Text style={styles.iconText}>♟</Text></View><Text style={styles.statArrow}>↗</Text></View>
            {loading ? <ActivityIndicator size="small" color="#FF8A32" /> : <Text style={styles.cardValue}>{totalMembers}</Text>}
            <Text style={styles.cardTitle}>Total members</Text><Text style={styles.cardHint}>Your community</Text>
          </Pressable>

          <Pressable accessibilityRole="button" accessibilityLabel="Open active members" style={styles.statCard} onPress={() => router.push('/members')}>
            <View style={styles.statTop}><View style={[styles.iconBox, styles.iconBlue]}><Text style={styles.iconText}>✓</Text></View><Text style={styles.statArrow}>↗</Text></View>
            {loading ? <ActivityIndicator size="small" color="#58A6FF" /> : <Text style={styles.cardValue}>{activeMembers}</Text>}
            <Text style={styles.cardTitle}>Active members*</Text><Text style={styles.cardHint}>Currently registered</Text>
          </Pressable>

          <Pressable accessibilityRole="button" accessibilityLabel="Open memberships" style={styles.statCard} onPress={() => router.push('/memberships')}>
            <View style={styles.statTop}><View style={[styles.iconBox, styles.iconPurple]}><Text style={styles.iconText}>◷</Text></View><Text style={styles.statArrow}>↗</Text></View>
            <Text style={styles.cardValue}>—</Text><Text style={styles.cardTitle}>Expiring soon</Text><Text style={styles.cardHint}>Membership tracking</Text>
          </Pressable>

          <Pressable accessibilityRole="button" accessibilityLabel="Open reports" style={styles.statCard} onPress={() => router.push('/reports')}>
            <View style={styles.statTop}><View style={[styles.iconBox, styles.iconGreen]}><Text style={styles.iconText}>₹</Text></View><Text style={styles.statArrow}>↗</Text></View>
            <Text style={styles.cardValue}>—</Text><Text style={styles.cardTitle}>This month</Text><Text style={styles.cardHint}>Revenue summary</Text>
          </Pressable>
        </View>
        <Text style={styles.disclaimer}>*Active count currently mirrors registered members until membership status is available from the API.</Text>

        <View style={styles.sectionHeading}>
          <View><Text style={styles.sectionKicker}>GET THINGS DONE</Text><Text style={styles.sectionTitle}>Quick actions</Text></View>
        </View>

        <Pressable style={styles.actionCard} onPress={() => router.push('/members')}>
          <View style={[styles.actionIcon, styles.actionIconOrange]}><Text style={styles.actionIconText}>＋</Text></View>
          <View style={styles.actionContent}><Text style={styles.actionTitle}>Add new member</Text><Text style={styles.actionSubtitle}>Register a new gym member</Text></View>
          <View style={styles.actionArrow}><Text style={styles.actionArrowText}>↗</Text></View>
        </Pressable>
        <Pressable style={styles.actionCard} onPress={() => router.push('/memberships')}>
          <View style={[styles.actionIcon, styles.actionIconBlue]}><Text style={styles.actionIconText}>↻</Text></View>
          <View style={styles.actionContent}><Text style={styles.actionTitle}>Renew membership</Text><Text style={styles.actionSubtitle}>Manage plans and payments</Text></View>
          <View style={styles.actionArrow}><Text style={styles.actionArrowText}>↗</Text></View>
        </Pressable>

        <View style={styles.sectionHeading}>
          <View><Text style={styles.sectionKicker}>LATEST UPDATES</Text><Text style={styles.sectionTitle}>Recent activity</Text></View>
          <Pressable onPress={() => router.push('/reports')}><Text style={styles.viewAll}>View reports ↗</Text></Pressable>
        </View>
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconWrap}><Text style={styles.emptyIcon}>↗</Text></View>
          <Text style={styles.emptyTitle}>Your activity starts here</Text>
          <Text style={styles.emptySubtitle}>New member registrations and membership updates will appear here when activity tracking is connected.</Text>
        </View>
        <View style={styles.footer}><Text style={styles.footerText}>BUILT FOR YOUR GYM</Text><View style={styles.footerLine} /><Text style={styles.footerVersion}>FITNESS • MEMBERS • PROGRESS</Text></View>
      </ScrollView>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#090D14' },
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28 },
  topLine: { flexDirection: 'row', alignItems: 'center', marginBottom: 22 },
  brandMark: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#FF812E', alignItems: 'center', justifyContent: 'center', shadowColor: '#FF812E', shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  brandMarkText: { color: '#11151D', fontSize: 24, fontWeight: '900', fontStyle: 'italic' },
  brandCopy: { marginLeft: 11, flex: 1 },
  brandTitle: { color: '#F6F7FB', fontSize: 15, fontWeight: '900', letterSpacing: 1.4 },
  brandAccent: { color: '#FF812E' },
  brandSubtitle: { color: '#778194', fontSize: 9, fontWeight: '700', letterSpacing: 2.1, marginTop: 3 },
  profileCircle: { width: 42, height: 42, borderRadius: 15, backgroundColor: '#172130', borderWidth: 1, borderColor: '#34445A', alignItems: 'center', justifyContent: 'center' },
  profileText: { color: '#69B6FF', fontSize: 18, fontWeight: '800' },
  hero: { minHeight: 214, borderRadius: 26, backgroundColor: '#151D2A', borderWidth: 1, borderColor: '#283448', padding: 20, marginBottom: 28, overflow: 'hidden' },
  heroGlow: { position: 'absolute', width: 190, height: 190, borderRadius: 95, right: -62, top: -54, backgroundColor: '#263C54', opacity: 0.8 },
  heroContent: { zIndex: 2, maxWidth: '75%' },
  eyebrow: { flexDirection: 'row', alignItems: 'center', marginBottom: 17 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF812E', marginRight: 7 },
  eyebrowText: { color: '#A5B0C1', fontSize: 9, fontWeight: '800', letterSpacing: 1.6 },
  greeting: { color: '#AAB4C4', fontSize: 14, fontWeight: '500' },
  ownerName: { color: '#FFFFFF', fontSize: 29, fontWeight: '900', letterSpacing: -0.7, marginTop: 2 },
  orangeDot: { color: '#FF812E' },
  heroSubtitle: { color: '#A3ADBD', fontSize: 12, marginTop: 7 },
  primaryButton: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF812E', paddingVertical: 11, paddingHorizontal: 14, borderRadius: 12, marginTop: 18 },
  primaryButtonText: { color: '#17191E', fontSize: 12, fontWeight: '900' },
  buttonArrow: { color: '#17191E', fontSize: 15, fontWeight: '900', marginLeft: 12 },
  heroOrb: { position: 'absolute', width: 116, height: 116, borderRadius: 58, right: 13, top: 46, backgroundColor: '#1D3043', borderWidth: 1, borderColor: '#3A5873', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-12deg' }] },
  heroOrbText: { color: '#8ECFFF', fontSize: 25, fontWeight: '900', fontStyle: 'italic', letterSpacing: 2 },
  orbRing: { position: 'absolute', width: 142, height: 142, borderRadius: 71, borderWidth: 1, borderColor: '#46627B', opacity: 0.7 },
  heroNumber: { position: 'absolute', right: 18, bottom: 12, color: '#64778B', fontSize: 10, fontWeight: '800', letterSpacing: 2 },
  sectionHeading: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14, marginTop: 2 },
  sectionKicker: { color: '#78869A', fontSize: 9, fontWeight: '800', letterSpacing: 1.8, marginBottom: 5 },
  sectionTitle: { color: '#F4F6FA', fontSize: 21, fontWeight: '800', letterSpacing: -0.4 },
  periodPill: { borderRadius: 20, borderWidth: 1, borderColor: '#293548', backgroundColor: '#111824', paddingHorizontal: 9, paddingVertical: 6, marginBottom: 3 },
  periodText: { color: '#9AA8BA', fontSize: 8, fontWeight: '800', letterSpacing: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 6 },
  statCard: { width: '48.2%', minHeight: 153, backgroundColor: '#111823', borderRadius: 20, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#263244' },
  statCardOrange: { borderColor: '#62412F', backgroundColor: '#191A20' },
  statTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 },
  iconBox: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  iconOrange: { backgroundColor: '#4A2B1D' },
  iconBlue: { backgroundColor: '#1B3047' },
  iconPurple: { backgroundColor: '#302844' },
  iconGreen: { backgroundColor: '#1C3933' },
  iconText: { color: '#FF9A55', fontSize: 18, fontWeight: '800' },
  statArrow: { color: '#69778A', fontSize: 15, fontWeight: '700' },
  cardValue: { color: '#F8FAFC', fontSize: 28, fontWeight: '900', letterSpacing: -0.8, marginBottom: 3 },
  cardTitle: { color: '#D8DEE8', fontSize: 11, fontWeight: '700', marginTop: 1 },
  cardHint: { color: '#758196', fontSize: 10, marginTop: 5 },
  disclaimer: { color: '#707D90', fontSize: 10, lineHeight: 15, marginBottom: 24, marginTop: 1 },
  actionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111823', borderRadius: 17, padding: 13, marginBottom: 10, borderWidth: 1, borderColor: '#263244' },
  actionIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  actionIconOrange: { backgroundColor: '#4A2B1D' },
  actionIconBlue: { backgroundColor: '#1B3047' },
  actionIconText: { color: '#FF9A55', fontSize: 24, fontWeight: '700' },
  actionContent: { flex: 1, marginLeft: 13 },
  actionTitle: { color: '#F2F5FA', fontSize: 13, fontWeight: '800' },
  actionSubtitle: { color: '#7F8CA0', fontSize: 11, marginTop: 4 },
  actionArrow: { width: 30, height: 30, borderRadius: 10, backgroundColor: '#1A2635', alignItems: 'center', justifyContent: 'center' },
  actionArrowText: { color: '#8EBFF0', fontSize: 15, fontWeight: '800' },
  viewAll: { color: '#FF9957', fontSize: 11, fontWeight: '800', marginBottom: 4 },
  emptyCard: { alignItems: 'center', backgroundColor: '#111823', borderRadius: 20, borderWidth: 1, borderColor: '#263244', padding: 23 },
  emptyIconWrap: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#1B3047', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  emptyIcon: { color: '#8ECFFF', fontSize: 25, fontWeight: '800' },
  emptyTitle: { color: '#E9EDF4', fontSize: 14, fontWeight: '800', marginBottom: 6 },
  emptySubtitle: { color: '#7F8CA0', fontSize: 11, lineHeight: 17, textAlign: 'center' },
  footer: { alignItems: 'center', marginTop: 27, marginBottom: 8 },
  footerText: { color: '#7C899B', fontSize: 8, fontWeight: '800', letterSpacing: 2.3 },
  footerLine: { width: 34, height: 2, backgroundColor: '#FF812E', borderRadius: 1, marginVertical: 9 },
  footerVersion: { color: '#4F5C6F', fontSize: 8, fontWeight: '700', letterSpacing: 1.2 },
});

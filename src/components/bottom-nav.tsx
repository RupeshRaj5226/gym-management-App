import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, usePathname } from 'expo-router';

type NavItem = {
  label: string;
  icon: string;
  route: '/dashboard' | '/members' | '/memberships' | '/reports' | '/settings';
};

const navItems: NavItem[] = [
  { label: 'Home', icon: '⌂', route: '/dashboard' },
  { label: 'Members', icon: '♟', route: '/members' },
  { label: 'Plans', icon: '▣', route: '/memberships' },
  { label: 'Reports', icon: '▥', route: '/reports' },
  { label: 'Settings', icon: '⚙', route: '/settings' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const active = pathname === item.route || (item.route === '/dashboard' && pathname === '/');

        return (
          <Pressable
            key={item.route}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={item.label}
            style={styles.item}
            onPress={() => router.push(item.route)}
          >
            <View style={[styles.iconContainer, active && styles.activeIconContainer]}>
              <Text style={[styles.icon, active && styles.activeIcon]}>{item.icon}</Text>
            </View>
            <Text style={[styles.label, active && styles.activeLabel]}>{item.label}</Text>
            {active && <View style={styles.activeIndicator} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 76,
    backgroundColor: '#0D131D',
    borderTopWidth: 1,
    borderTopColor: '#202C3B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 6,
    paddingTop: 7,
    paddingBottom: 8,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 56 },
  iconContainer: { width: 42, height: 30, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  activeIconContainer: { backgroundColor: '#392719', borderWidth: 1, borderColor: '#664128' },
  icon: { fontSize: 18, color: '#77869B' },
  activeIcon: { color: '#FF9146' },
  label: { marginTop: 4, fontSize: 9, fontWeight: '700', color: '#758297' },
  activeLabel: { color: '#FF9146' },
  activeIndicator: { position: 'absolute', bottom: -2, width: 16, height: 2, borderRadius: 2, backgroundColor: '#FF812E' },
});

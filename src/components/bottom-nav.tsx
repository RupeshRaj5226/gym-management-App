import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, usePathname } from 'expo-router';

type NavItem = {
  label: string;
  icon: string;
  route: '/dashboard' | '/members' | '/memberships' | '/reports' | '/settings';
};

const navItems: NavItem[] = [
  {
    label: 'Home',
    icon: '⌂',
    route: '/dashboard',
  },
  {
    label: 'Members',
    icon: '👥',
    route: '/members',
  },
  {
    label: 'Plans',
    icon: '▣',
    route: '/memberships',
  },
  {
    label: 'Reports',
    icon: '▥',
    route: '/reports',
  },
  {
    label: 'Settings',
    icon: '⚙',
    route: '/settings',
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  const handleNavigation = (route: NavItem['route']) => {
    router.push(route);
  };

  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const active = pathname === item.route;

        return (
          <Pressable
            key={item.route}
            style={styles.item}
            onPress={() => handleNavigation(item.route)}
          >
            <View
              style={[
                styles.iconContainer,
                active && styles.activeIconContainer,
              ]}
            >
              <Text
                style={[
                  styles.icon,
                  active && styles.activeIcon,
                ]}
              >
                {item.icon}
              </Text>
            </View>

            <Text
              style={[
                styles.label,
                active && styles.activeLabel,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 76,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },

  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconContainer: {
    width: 42,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  activeIconContainer: {
    backgroundColor: '#DBEAFE',
  },

  icon: {
    fontSize: 19,
    color: '#64748B',
  },

  activeIcon: {
    color: '#2563EB',
  },

  label: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },

  activeLabel: {
    color: '#2563EB',
  },
});

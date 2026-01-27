import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { colors, spacing, typography } from '../theme';
import { Button, Card } from '../components';
import { useAuth } from '../hooks/useAuth';

export const SettingsScreen: React.FC = () => {
  const { user, logout } = useAuth();

  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            // Navigation will be handled by auth state change
          } catch (error) {
            console.error('Logout failed:', error);
            Alert.alert('Error', 'Failed to logout. Please try again.');
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Not Implemented', 'Account deletion is not yet implemented');
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || 'U'}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || 'User'}</Text>
              <Text style={styles.profileEmail}>{user?.email || ''}</Text>
            </View>
          </View>
          <Button
            title="Edit Profile"
            onPress={() => Alert.alert('Not Implemented', 'Profile editing is not yet implemented')}
            variant="outline"
            size="small"
            style={styles.editButton}
          />
        </Card>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <Card style={styles.settingsCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingLabel}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingDescription}>Receive session reminders and updates</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={notifications ? colors.primary : colors.textDisabled}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLabel}>
              <Text style={styles.settingTitle}>Sound Effects</Text>
              <Text style={styles.settingDescription}>Play audio feedback during sessions</Text>
            </View>
            <Switch
              value={soundEffects}
              onValueChange={setSoundEffects}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={soundEffects ? colors.primary : colors.textDisabled}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLabel}>
              <Text style={styles.settingTitle}>Haptic Feedback</Text>
              <Text style={styles.settingDescription}>Vibrate on beat and step detection</Text>
            </View>
            <Switch
              value={hapticFeedback}
              onValueChange={setHapticFeedback}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={hapticFeedback ? colors.primary : colors.textDisabled}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLabel}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingDescription}>Switch to dark theme (coming soon)</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              disabled={true}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={colors.textDisabled}
            />
          </View>
        </Card>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Card style={styles.settingsCard}>
          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => Alert.alert('Not Implemented', 'Help center is not yet implemented')}
          >
            <Text style={styles.linkText}>Help Center</Text>
            <Text style={styles.linkArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => Alert.alert('Not Implemented', 'Privacy policy is not yet implemented')}
          >
            <Text style={styles.linkText}>Privacy Policy</Text>
            <Text style={styles.linkArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkItem}
            onPress={() =>
              Alert.alert('Not Implemented', 'Terms of service is not yet implemented')
            }
          >
            <Text style={styles.linkText}>Terms of Service</Text>
            <Text style={styles.linkArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.linkItem}>
            <Text style={styles.linkText}>Version</Text>
            <Text style={styles.versionText}>1.0.0</Text>
          </View>
        </Card>
      </View>

      {/* Account Actions */}
      <View style={styles.section}>
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          size="large"
          style={styles.logoutButton}
        />
        <TouchableOpacity onPress={handleDeleteAccount} style={styles.deleteButton}>
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.screenPadding,
    paddingTop: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  section: {
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  profileCard: {
    padding: spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  profileEmail: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  editButton: {
    alignSelf: 'flex-start',
  },
  settingsCard: {
    padding: 0,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  settingLabel: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.xs / 2,
  },
  settingDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  linkText: {
    fontSize: typography.fontSize.md,
    color: colors.text,
  },
  linkArrow: {
    fontSize: typography.fontSize.xl,
    color: colors.textSecondary,
  },
  versionText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  logoutButton: {
    marginBottom: spacing.md,
  },
  deleteButton: {
    alignItems: 'center',
    padding: spacing.md,
  },
  deleteText: {
    fontSize: typography.fontSize.md,
    color: colors.error,
    fontWeight: typography.fontWeight.medium,
  },
  spacer: {
    height: spacing.xxl,
  },
});

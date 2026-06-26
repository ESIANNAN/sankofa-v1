import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, Image, Modal, Pressable, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '@/services/firebase';
import { ChevronLeft, Camera, Trash2, Calendar, X, User } from 'lucide-react-native';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150',
];

export default function PersonalInfoScreen() {
  const insets = useSafeAreaInsets();
  const backgroundColor = '#FFFFFF';
  const textColor = '#000000';
  const mutedTextColor = '#71717a';

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  // Errors state
  const [fullNameError, setFullNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [dobError, setDobError] = useState('');

  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const [pickerDay, setPickerDay] = useState(18);
  const [pickerMonth, setPickerMonth] = useState(3); // April
  const [pickerYear, setPickerYear] = useState(2004);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const getDaysInMonth = (monthIndex: number, year: number) => {
    return new Date(year, monthIndex + 1, 0).getDate();
  };

  const handleConfirmDate = () => {
    const dayStr = pickerDay.toString().padStart(2, '0');
    const monthStr = (pickerMonth + 1).toString().padStart(2, '0');
    const yearStr = pickerYear.toString();
    setDob(`${dayStr}-${monthStr}-${yearStr}`);
    setDatePickerVisible(false);
  };

  useEffect(() => {
    if (dob && /^\d{2}-\d{2}-\d{4}$/.test(dob)) {
      const [d, m, y] = dob.split('-').map(Number);
      setPickerDay(d);
      setPickerMonth(m - 1);
      setPickerYear(y);
    }
  }, [datePickerVisible, dob]);

  useEffect(() => {
    const loadProfileData = async () => {
      // 1. Initial load from Firebase if available
      if (auth.currentUser) {
        setFullName(auth.currentUser.displayName || '');
        setEmail(auth.currentUser.email || '');
        setPhotoUri(auth.currentUser.photoURL || null);
      }

      // 2. Load other details from AsyncStorage
      try {
        const storedPhone = await AsyncStorage.getItem('user_phone');
        if (storedPhone) setPhoneNumber(storedPhone);

        const storedDob = await AsyncStorage.getItem('user_dob');
        if (storedDob) setDob(storedDob);

        // Fallbacks for profile details if Firebase auth data is empty or unauthenticated
        if (!auth.currentUser) {
          const storedName = await AsyncStorage.getItem('user_name');
          if (storedName) setFullName(storedName);

          const storedEmail = await AsyncStorage.getItem('user_email');
          if (storedEmail) setEmail(storedEmail);

          const storedPhoto = await AsyncStorage.getItem('user_photo');
          if (storedPhoto) setPhotoUri(storedPhoto);
        }
      } catch (error) {
        console.warn('Error loading profile data:', error);
      }
    };
    loadProfileData();
  }, []);

  const handleSave = async () => {
    setFullNameError('');
    setPhoneError('');
    setEmailError('');
    setDobError('');
    setSaveSuccessMessage('');

    let isValid = true;

    if (!fullName.trim()) {
      setFullNameError('Full name is required');
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email format');
      isValid = false;
    }

    if (phoneNumber && !/^\+?\d{7,15}$/.test(phoneNumber.replace(/\s+/g, ''))) {
      setPhoneError('Invalid phone number format');
      isValid = false;
    }

    if (!dob.trim()) {
      setDobError('Date of birth is required');
      isValid = false;
    } else if (!/^\d{2}-\d{2}-\d{4}$/.test(dob)) {
      setDobError('Format must be DD-MM-YYYY');
      isValid = false;
    }

    if (!isValid) return;

    setSaving(true);
    try {
      if (auth.currentUser) {
        const { updateProfile } = await import('firebase/auth');

        // 1. Update Firebase profile displayName and photoURL
        await updateProfile(auth.currentUser, {
          displayName: fullName.trim(),
          photoURL: photoUri,
        });

        // 2. Update Firebase email if it changed
        if (email.trim() !== auth.currentUser.email) {
          const { updateEmail } = await import('firebase/auth');
          try {
            await updateEmail(auth.currentUser, email.trim());
          } catch (emailErr: any) {
            console.warn('Firebase Email Update Error:', emailErr);
            if (emailErr.code === 'auth/requires-recent-login') {
              Alert.alert(
                'Reauthentication Required',
                'For security reasons, changing your email requires a recent login. Please log out, log back in, and try again.'
              );
              // Revert input email back to active email
              setEmail(auth.currentUser.email || '');
              setSaving(false);
              return;
            } else {
              throw emailErr;
            }
          }
        }
      }

      // 3. Save locally in AsyncStorage
      await AsyncStorage.setItem('user_name', fullName.trim());
      await AsyncStorage.setItem('user_phone', phoneNumber.trim());
      await AsyncStorage.setItem('user_email', email.trim());
      await AsyncStorage.setItem('user_dob', dob.trim());
      if (photoUri) {
        await AsyncStorage.setItem('user_photo', photoUri);
      } else {
        await AsyncStorage.removeItem('user_photo');
      }

      setSaveSuccessMessage('Profile updated successfully');

      setTimeout(() => {
        setSaveSuccessMessage('');
      }, 3000);
    } catch (error: any) {
      console.warn('Error saving profile changes:', error);
      Alert.alert('Error', error.message || 'Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoUri(null);
    setAvatarModalVisible(false);
  };

  const handleSelectPreset = (uri: string) => {
    setPhotoUri(uri);
    setAvatarModalVisible(false);
  };

  const handleApplyCustomUrl = () => {
    if (customPhotoUrl.trim()) {
      if (!customPhotoUrl.startsWith('http://') && !customPhotoUrl.startsWith('https://')) {
        Alert.alert('Invalid URL', 'Image URL must start with http:// or https://');
        return;
      }
      setPhotoUri(customPhotoUrl.trim());
      setCustomPhotoUrl('');
      setAvatarModalVisible(false);
    }
  };

  const getFirstLetter = (name: string) => {
    return name ? name.trim().charAt(0).toUpperCase() : 'P';
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          paddingTop: Math.max(insets.top, 16),
          paddingBottom: Math.max(insets.bottom, 16),
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name={ChevronLeft} color={textColor} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Personal Info</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Main Content */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        
        {/* Profile Image Section */}
        <View style={styles.profileImageContainer}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>
                {getFirstLetter(fullName)}
              </Text>
            </View>
          )}

          <View style={styles.avatarActions}>
            <TouchableOpacity
              style={styles.avatarActionButton}
              onPress={() => setAvatarModalVisible(true)}
              activeOpacity={0.7}
            >
              <Icon name={Camera} color="#000000" size={14} />
              <Text style={styles.avatarActionText}>Change Photo</Text>
            </TouchableOpacity>

            {photoUri && (
              <TouchableOpacity
                style={[styles.avatarActionButton, styles.removeButton]}
                onPress={handleRemovePhoto}
                activeOpacity={0.7}
              >
                <Icon name={Trash2} color="#EF4444" size={14} />
                <Text style={[styles.avatarActionText, { color: '#EF4444' }]}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Input Fields */}
        <View style={styles.formContainer}>
          
          {/* Full Name */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <Input
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              error={fullNameError}
              variant="outline"
              icon={User}
            />
          </View>

          {/* Phone Number */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.phoneInputContainer}>
              <View style={styles.phonePrefix}>
                <Text style={styles.phonePrefixText}>🇬🇭 +233</Text>
              </View>
              <TextInput
                style={styles.phoneTextInput}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="20 123 4567"
                keyboardType="phone-pad"
                placeholderTextColor={mutedTextColor}
              />
            </View>
            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
          </View>

          {/* Email */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Email</Text>
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="annanesi875@gmail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailError}
              variant="outline"
            />
          </View>

          {/* Date of Birth */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Date of Birth</Text>
            <Pressable onPress={() => setDatePickerVisible(true)}>
              <View pointerEvents="none">
                <Input
                  value={dob}
                  placeholder="DD-MM-YYYY"
                  error={dobError}
                  variant="outline"
                  rightComponent={<Icon name={Calendar} color={mutedTextColor} size={18} />}
                  editable={false}
                />
              </View>
            </Pressable>
          </View>

        </View>

        {/* Success Banner */}
        {saveSuccessMessage ? (
          <View style={styles.successBanner}>
            <Text style={styles.successBannerText}>✓ {saveSuccessMessage}</Text>
          </View>
        ) : null}

        {/* Save Changes Button */}
        <TouchableOpacity
          style={[styles.saveButton, saving && { opacity: 0.6 }]}
          onPress={handleSave}
          activeOpacity={0.8}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Avatar Picker Modal */}
      <Modal
        visible={avatarModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAvatarModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setAvatarModalVisible(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.pullTab} />

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Profile Photo</Text>
              <TouchableOpacity
                onPress={() => setAvatarModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name={X} color={textColor} size={20} />
              </TouchableOpacity>
            </View>

            {/* Presets Grid */}
            <Text style={styles.modalSectionTitle}>Choose Character Avatar</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.presetsList}
            >
              {PRESET_AVATARS.map((uri, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelectPreset(uri)}
                  activeOpacity={0.7}
                >
                  <Image source={{ uri }} style={styles.presetImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.divider} />

            {/* Custom URL Option */}
            <Text style={styles.modalSectionTitle}>Or enter custom Image URL</Text>
            <View style={styles.urlInputRow}>
              <TextInput
                style={styles.urlTextInput}
                placeholder="https://example.com/photo.jpg"
                value={customPhotoUrl}
                onChangeText={setCustomPhotoUrl}
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor={mutedTextColor}
              />
              <TouchableOpacity
                style={styles.applyUrlButton}
                onPress={handleApplyCustomUrl}
                activeOpacity={0.7}
              >
                <Text style={styles.applyUrlButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Date Picker Modal */}
      <Modal
        visible={datePickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDatePickerVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setDatePickerVisible(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.pullTab} />

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date of Birth</Text>
              <TouchableOpacity
                onPress={() => setDatePickerVisible(false)}
                style={styles.closeButton}
              >
                <Icon name={X} color={textColor} size={20} />
              </TouchableOpacity>
            </View>

            {/* Calendar Scrollers Container */}
            <View style={styles.datePickerContainer}>
              
              {/* Day Column */}
              <View style={styles.datePickerCol}>
                <Text style={styles.datePickerColHeader}>Day</Text>
                <ScrollView 
                  style={styles.datePickerScrollView} 
                  showsVerticalScrollIndicator={false}
                >
                  {Array.from({ length: getDaysInMonth(pickerMonth, pickerYear) }, (_, i) => i + 1).map((d) => {
                    const isSelected = d === pickerDay;
                    return (
                      <TouchableOpacity
                        key={`day-${d}`}
                        style={[styles.datePickerItem, isSelected && styles.datePickerItemSelected]}
                        onPress={() => setPickerDay(d)}
                      >
                        <Text style={[styles.datePickerItemText, isSelected && styles.datePickerItemTextSelected]}>
                          {d.toString().padStart(2, '0')}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Month Column */}
              <View style={styles.datePickerCol}>
                <Text style={styles.datePickerColHeader}>Month</Text>
                <ScrollView 
                  style={styles.datePickerScrollView} 
                  showsVerticalScrollIndicator={false}
                >
                  {[
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                  ].map((m, index) => {
                    const isSelected = index === pickerMonth;
                    return (
                      <TouchableOpacity
                        key={`month-${index}`}
                        style={[styles.datePickerItem, isSelected && styles.datePickerItemSelected]}
                        onPress={() => {
                          setPickerMonth(index);
                          const maxDays = getDaysInMonth(index, pickerYear);
                          if (pickerDay > maxDays) {
                            setPickerDay(maxDays);
                          }
                        }}
                      >
                        <Text style={[styles.datePickerItemText, isSelected && styles.datePickerItemTextSelected]}>
                          {m.substring(0, 3)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Year Column */}
              <View style={styles.datePickerCol}>
                <Text style={styles.datePickerColHeader}>Year</Text>
                <ScrollView 
                  style={styles.datePickerScrollView} 
                  showsVerticalScrollIndicator={false}
                >
                  {Array.from({ length: 87 }, (_, i) => 2026 - i).map((y) => {
                    const isSelected = y === pickerYear;
                    return (
                      <TouchableOpacity
                        key={`year-${y}`}
                        style={[styles.datePickerItem, isSelected && styles.datePickerItemSelected]}
                        onPress={() => {
                          setPickerYear(y);
                          const maxDays = getDaysInMonth(pickerMonth, y);
                          if (pickerDay > maxDays) {
                            setPickerDay(maxDays);
                          }
                        }}
                      >
                        <Text style={[styles.datePickerItemText, isSelected && styles.datePickerItemTextSelected]}>
                          {y}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

            </View>

            {/* Action Buttons */}
            <View style={styles.datePickerActions}>
              <TouchableOpacity
                style={styles.datePickerCancelButton}
                onPress={() => setDatePickerVisible(false)}
              >
                <Text style={styles.datePickerCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.datePickerConfirmButton}
                onPress={handleConfirmDate}
              >
                <Text style={styles.datePickerConfirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>

          </Pressable>
        </Pressable>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    height: 64,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4F4F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 28,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FAF9F6',
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    fontSize: 40,
    fontWeight: '800',
    color: '#000000',
  },
  avatarActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  avatarActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
  },
  removeButton: {
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
  },
  avatarActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  formContainer: {
    gap: 20,
  },
  inputWrapper: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    height: 56,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    overflow: 'hidden',
  },
  phonePrefix: {
    backgroundColor: '#F4F4F5',
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRightWidth: 1,
    borderColor: '#E5E5E5',
  },
  phonePrefixText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  phoneTextInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000000',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    marginLeft: 4,
    marginTop: 2,
  },
  successBanner: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 12,
    padding: 14,
    marginTop: 24,
    alignItems: 'center',
  },
  successBannerText: {
    color: '#047857',
    fontWeight: '600',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#000000',
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 48,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  pullTab: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#E5E5EA',
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F4F4F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#71717a',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  presetsList: {
    gap: 12,
    paddingBottom: 4,
  },
  presetImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 20,
  },
  urlInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  urlTextInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#000000',
  },
  applyUrlButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyUrlButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  datePickerContainer: {
    flexDirection: 'row',
    height: 200,
    gap: 12,
    marginBottom: 24,
  },
  datePickerCol: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#FAF9F6',
  },
  datePickerColHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#71717a',
    textTransform: 'uppercase',
    textAlign: 'center',
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
  },
  datePickerScrollView: {
    flex: 1,
  },
  datePickerItem: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePickerItemSelected: {
    backgroundColor: '#000000',
  },
  datePickerItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#71717a',
  },
  datePickerItemTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  datePickerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  datePickerCancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  datePickerCancelButtonText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '700',
  },
  datePickerConfirmButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  datePickerConfirmButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

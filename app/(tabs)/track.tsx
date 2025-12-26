import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, SIZES } from '../../src/constants/theme';
import { MoodChip, MoodType } from '../../src/components/ui/MoodChip';

const MOODS: { type: MoodType; icon: keyof typeof MaterialIcons.glyphMap }[] = [
  { type: 'Great', icon: 'sentiment-very-satisfied' },
  { type: 'Good', icon: 'sentiment-satisfied' },
  { type: 'Meh', icon: 'sentiment-neutral' },
  { type: 'Tired', icon: 'battery-alert' },
  { type: 'Stressed', icon: 'mood-bad' }
];

export default function TrackScreen() {
  const { width } = useWindowDimensions();
  const [selectedMood, setSelectedMood] = useState<MoodType>('Great');
  const [entryText, setEntryText] = useState('');
  
  // Responsive calculation for tablet support
  const isTablet = width > 768;
  const contentWidth = isTablet ? SIZES.containerMaxWidth : '100%';
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.responsiveContainer, { width: contentWidth }]}>
            
            {/* Header Section */}
            <View style={styles.headerSection}>
              <View style={styles.headerRow}>
                <TouchableOpacity style={styles.iconButton}>
                  <MaterialIcons name="arrow-back-ios" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Journal</Text>
                <TouchableOpacity style={styles.iconButton}>
                  <MaterialIcons name="calendar-today" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
              
              {/* Date Navigation */}
              <View style={styles.dateNav}>
                <TouchableOpacity style={styles.navButton}>
                  <MaterialIcons name="chevron-left" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
                <Text style={styles.dateText}>Today, Oct 26</Text>
                <TouchableOpacity style={styles.navButton}>
                  <MaterialIcons name="chevron-right" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            {/* Mood Section */}
            <Text style={styles.sectionTitle}>How are you feeling today?</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.moodScroll}
            >
              {MOODS.map((mood) => (
                <MoodChip
                  key={mood.type}
                  mood={mood.type}
                  icon={mood.icon}
                  isSelected={selectedMood === mood.type}
                  onSelect={setSelectedMood}
                />
              ))}
            </ScrollView>
            
            {/* Text Input Section */}
            <View style={styles.composerContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  placeholder="What's on your mind? How was your workout?"
                  placeholderTextColor={COLORS.textSecondary}
                  multiline
                  textAlignVertical="top"
                  value={entryText}
                  onChangeText={setEntryText}
                  maxLength={1000}
                />
                
                {/* Toolbar */}
                <View style={styles.toolbar}>
                  <View style={styles.toolbarActions}>
                    <TouchableOpacity style={styles.toolButton}>
                      <MaterialIcons name="image" size={24} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.toolButton}>
                      <MaterialIcons name="bar-chart" size={24} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.toolButton}>
                      <MaterialIcons name="location-on" size={24} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.charCount}>{entryText.length}/1000</Text>
                </View>
              </View>
            </View>
            
          </View>
        </ScrollView>
        
        {/* Footer with Save Button */}
        <View style={styles.footerContainer}>
          <View style={[styles.footer, { maxWidth: contentWidth }]}>
            <TouchableOpacity style={styles.saveButton} activeOpacity={0.8}>
              <Text style={styles.saveButtonText}>Save Journal Entry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: SPACING.m,
  },
  responsiveContainer: {
    width: '100%',
    paddingHorizontal: SPACING.m,
  },
  headerSection: {
    width: '100%',
    paddingTop: SPACING.l,
    paddingBottom: SPACING.m,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.m,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: COLORS.text,
    fontSize: 20,
    fontFamily: FONTS.bold,
  },
  dateNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  navButton: {
    padding: SPACING.xs,
  },
  dateText: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    width: '100%',
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: FONTS.bold,
    marginBottom: SPACING.m,
    width: '100%',
  },
  moodScroll: {
    paddingVertical: SPACING.s,
    gap: SPACING.s,
    paddingBottom: SPACING.l,
  },
  composerContainer: {
    width: '100%',
    marginTop: SPACING.s,
    minHeight: 350,
  },
  inputWrapper: {
    backgroundColor: '#1C1C1E',
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    minHeight: 350,
  },
  textInput: {
    minHeight: 280,
    color: COLORS.text,
    fontFamily: FONTS.regular,
    fontSize: 16,
    padding: SPACING.m,
    lineHeight: 24,
    textAlignVertical: 'top',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.m,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    minHeight: 56,
  },
  toolbarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
  },
  toolButton: {
    padding: SPACING.s,
    minWidth: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  charCount: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontFamily: FONTS.medium,
    marginLeft: SPACING.m,
  },
  footerContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footer: {
    width: '100%',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.m,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: SIZES.radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.bold,
    letterSpacing: 0.5,
  },
});

// This screen is now ready for journal/track tab usage.

import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Habit } from '../../types/habit';

const ICONS = [
  'water-drop',
  'menu-book',
  'directions-run',
  'self-improvement',
  'fitness-center',
  'restaurant',
  'nights-stay',
  'work'
];

interface AddHabitModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (habit: Habit) => void;
}

const AddHabitModal: React.FC<AddHabitModalProps> = ({ visible, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);

  const handleSubmit = () => {
    if (!title) return;
    const newHabit: Habit = {
      id: Date.now().toString(),
      title,
      subtitle: subtitle || 'Daily Goal',
      icon: selectedIcon,
      type: 'checkbox',
      completed: false,
    };
    onAdd(newHabit);
    setTitle('');
    setSubtitle('');
    setSelectedIcon(ICONS[0]);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>New Habit</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Title (e.g. Read 30 mins)"
            placeholderTextColor={colors.textSecondary}
            autoFocus
          />
          <TextInput
            style={styles.input}
            value={subtitle}
            onChangeText={setSubtitle}
            placeholder="Subtitle (e.g. Keep learning!)"
            placeholderTextColor={colors.textSecondary}
          />
          <Text style={styles.iconLabel}>Icon</Text>
          <FlatList
            data={ICONS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            contentContainerStyle={{ gap: spacing.sm }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedIcon(item)}
                style={[
                  styles.iconSelector,
                  selectedIcon === item && styles.iconSelectorSelected
                ]}
              >
                <MaterialIcons
                  name={item as any}
                  size={28}
                  color={selectedIcon === item ? '#fff' : colors.textSecondary}
                />
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={[styles.submitBtn, !title && { opacity: 0.5 }]}
            onPress={handleSubmit}
            disabled={!title}
            activeOpacity={0.85}
          >
            <Text style={styles.submitLabel}>Create Habit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)', // Darker overlay for better contrast
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: '#1C1C1E', // Solid dark background instead of transparent
    borderRadius: spacing.xl,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 380,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)', // Subtle border
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    elevation: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.text,
  },
  input: {
    backgroundColor: '#2C2C2E', // Solid input background
    borderRadius: spacing.lg,
    color: colors.text,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)', // More visible border
    marginBottom: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    fontSize: 16,
  },
  iconLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    marginVertical: spacing.sm,
    fontWeight: '600',
  },
  iconSelector: {
    padding: spacing.md,
    borderRadius: 14,
    backgroundColor: '#2C2C2E', // Solid icon selector background
    marginRight: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconSelectorSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  submitBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.32,
    shadowRadius: 6,
    elevation: 5,
  },
  submitLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddHabitModal;

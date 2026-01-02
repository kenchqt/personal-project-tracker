import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { STATUS_ORDER } from '@/constants/project';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Project, ProjectStatus } from '@/types/project';
import { addProject } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// For web date input
declare global {
  namespace JSX {
    interface IntrinsicElements {
      input: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
    }
  }
}

export default function AddProjectModal() {
  const colorScheme = useColorScheme();
  const [name, setName] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('Planned');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  const handleAddTech = () => {
    const trimmed = techInput.trim();
    if (trimmed && !techStack.some((tech) => tech.toLowerCase() === trimmed.toLowerCase())) {
      setTechStack([...techStack, trimmed]);
      setTechInput('');
      setShowErrors(false);
    }
  };

  const handleRemoveTech = (tech: string) => {
    setTechStack(techStack.filter((t) => t !== tech));
  };

  const handleSubmit = async () => {
    setShowErrors(true);

    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a project name');
      return;
    }

    if (!deadline) {
      Alert.alert('Error', 'Please select a deadline');
      return;
    }

    if (techStack.length === 0) {
      Alert.alert('Error', 'Please add at least one technology to the tech stack');
      return;
    }

    try {
      // Firestore will generate the ID automatically
      const project: Omit<Project, 'id'> = {
        name: name.trim(),
        status,
        deadline: deadline.toISOString(),
        techStack,
        createdAt: new Date().toISOString(),
      };

      await addProject(project);
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to create project. Please try again.');
      console.error('Error creating project:', error);
    }
  };

  const handleDatePickerOpen = () => {
    setTempDate(deadline || new Date());
    setShowDatePicker(true);
  };

  const handleDatePickerConfirm = () => {
    setDeadline(tempDate);
    setShowDatePicker(false);
    setShowErrors(false);
  };

  const handleDatePickerCancel = () => {
    setShowDatePicker(false);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={Colors[colorScheme ?? 'light'].text} />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.title}>
          New Project
        </ThemedText>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Project Name *
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                color: Colors[colorScheme ?? 'light'].text,
                backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#F5F5F5',
                borderColor: colorScheme === 'dark' ? '#3A3A3A' : '#E0E0E0',
              },
            ]}
            placeholder="Enter project name"
            placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
            value={name}
            onChangeText={setName}
            autoFocus
          />
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Status *
          </ThemedText>
          <View style={styles.statusContainer}>
            {STATUS_ORDER.map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.statusOption,
                  status === s && styles.statusOptionActive,
                  {
                    backgroundColor:
                      status === s
                        ? '#3B82F6'
                        : colorScheme === 'dark'
                          ? '#2A2A2A'
                          : '#F5F5F5',
                  },
                ]}
                onPress={() => setStatus(s)}>
                <ThemedText
                  style={[
                    styles.statusText,
                    { color: status === s ? '#fff' : Colors[colorScheme ?? 'light'].text },
                  ]}>
                  {s}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Deadline *
          </ThemedText>
          {Platform.OS === 'web' ? (
            <View
              style={[
                styles.dateButton,
                {
                  backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#F5F5F5',
                  borderColor:
                    showErrors && !deadline
                      ? '#EF4444'
                      : colorScheme === 'dark'
                        ? '#3A3A3A'
                        : '#E0E0E0',
                },
              ]}>
              <Ionicons name="calendar-outline" size={20} color={Colors[colorScheme ?? 'light'].icon} />
              <input
                type="date"
                value={deadline ? deadline.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  if (e.target.value) {
                    setDeadline(new Date(e.target.value));
                    setShowErrors(false);
                  }
                }}
                style={{
                  flex: 1,
                  fontSize: 16,
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                  color: Colors[colorScheme ?? 'light'].text,
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
                placeholder="Select deadline (required)"
              />
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={[
                  styles.dateButton,
                  {
                    backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#F5F5F5',
                    borderColor:
                      showErrors && !deadline
                        ? '#EF4444'
                        : colorScheme === 'dark'
                          ? '#3A3A3A'
                          : '#E0E0E0',
                  },
                ]}
                onPress={handleDatePickerOpen}>
                <Ionicons name="calendar-outline" size={20} color={Colors[colorScheme ?? 'light'].icon} />
                <ThemedText style={styles.dateText}>
                  {deadline ? deadline.toLocaleDateString() : 'Select deadline (required)'}
                </ThemedText>
              </TouchableOpacity>
              {showDatePicker && (
                <>
                  <DateTimePicker
                    value={tempDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                      if (Platform.OS === 'android') {
                        if (event.type === 'set' && selectedDate) {
                          setDeadline(selectedDate);
                        }
                        setShowDatePicker(false);
                      } else {
                        // iOS: only update temp date, don't save until Done is clicked
                        if (selectedDate) {
                          setTempDate(selectedDate);
                        }
                      }
                    }}
                  />
                  {Platform.OS === 'ios' && (
                    <View style={styles.datePickerActions}>
                      <TouchableOpacity
                        style={[
                          styles.datePickerCancelButton,
                          {
                            backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#F5F5F5',
                          },
                        ]}
                        onPress={handleDatePickerCancel}>
                        <ThemedText style={styles.datePickerCancelText}>Cancel</ThemedText>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.datePickerButton}
                        onPress={handleDatePickerConfirm}>
                        <ThemedText style={styles.datePickerButtonText}>Done</ThemedText>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </>
          )}
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Tech Stack *
          </ThemedText>
          {showErrors && techStack.length === 0 && (
            <ThemedText style={styles.requiredHint}>At least one technology is required</ThemedText>
          )}
          <View style={styles.techInputContainer}>
            <TextInput
              style={[
                styles.techInput,
                {
                  color: Colors[colorScheme ?? 'light'].text,
                  backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#F5F5F5',
                  borderColor:
                    showErrors && techStack.length === 0
                      ? '#EF4444'
                      : colorScheme === 'dark'
                        ? '#3A3A3A'
                        : '#E0E0E0',
                },
              ]}
              placeholder="Add technology"
              placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
              value={techInput}
              onChangeText={setTechInput}
              onSubmitEditing={handleAddTech}
            />
            <TouchableOpacity
              style={styles.addTechButton}
              onPress={handleAddTech}
              disabled={!techInput.trim()}>
              <Ionicons
                name="add"
                size={20}
                color={techInput.trim() ? '#3B82F6' : Colors[colorScheme ?? 'light'].icon}
              />
            </TouchableOpacity>
          </View>
          {techStack.length > 0 && (
            <View style={styles.techStack}>
              {techStack.map((tech) => (
                <View key={tech} style={styles.techTag}>
                  <ThemedText style={styles.techTagText}>{tech}</ThemedText>
                  <TouchableOpacity onPress={() => handleRemoveTech(tech)}>
                    <Ionicons name="close" size={16} color={Colors[colorScheme ?? 'light'].text} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <ThemedText style={styles.submitButtonText}>Create Project</ThemedText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  requiredHint: {
    fontSize: 12,
    marginBottom: 8,
    opacity: 0.7,
    color: '#EF4444',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  statusOptionActive: {
    backgroundColor: '#3B82F6',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
  },
  keyboardAvoid: {
    flex: 1,
  },
  datePickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 12,
  },
  datePickerCancelButton: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  datePickerCancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  datePickerButton: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  datePickerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  techInputContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  techInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  addTechButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  techStack: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  techTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    gap: 6,
  },
  techTagText: {
    fontSize: 14,
    color: '#3B82F6',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StatusSection } from '@/components/status-section';
import { Colors } from '@/constants/theme';
import { STATUS_ORDER } from '@/constants/project';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Project, ProjectStatus } from '@/types/project';
import { deleteProject, getProjects, updateProject } from '@/utils/storage';
import { router } from 'expo-router';

export default function ProjectsScreen() {
  const colorScheme = useColorScheme();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadProjects = useCallback(async () => {
    const data = await getProjects();
    setProjects(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProjects();
    }, [loadProjects])
  );

  const handleStatusChange = async (id: string, newStatus: ProjectStatus) => {
    try {
      await updateProject(id, { status: newStatus });
      loadProjects();
    } catch (error) {
      Alert.alert('Error', 'Failed to update project status. Please try again.');
      console.error('Error updating project:', error);
    }
  };

  const handleDelete = (project: Project) => {
    if (project.status !== 'Cancelled') {
      Alert.alert('Error', 'Only cancelled projects can be deleted.');
      return;
    }

    Alert.alert('Delete Project', `Are you sure you want to delete "${project.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteProject(project.id);
            loadProjects();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete project. Please try again.');
            console.error('Error deleting project:', error);
          }
        },
      },
    ]);
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  const groupedProjects = useMemo(() => {
    return STATUS_ORDER.reduce((acc, status) => {
      acc[status] = filteredProjects.filter((p) => p.status === status);
      return acc;
    }, {} as Record<ProjectStatus, Project[]>);
  }, [filteredProjects]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Projects
        </ThemedText>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/modal')}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#F5F5F5',
            borderColor: colorScheme === 'dark' ? '#3A3A3A' : '#E0E0E0',
          },
        ]}>
        <Ionicons
          name="search"
          size={20}
          color={Colors[colorScheme ?? 'light'].icon}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: Colors[colorScheme ?? 'light'].text }]}
          placeholder="Search projects..."
          placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={Colors[colorScheme ?? 'light'].icon} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content}>
        {STATUS_ORDER.map((status) => (
          <StatusSection
            key={status}
            status={status}
            projects={groupedProjects[status]}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        ))}

        {filteredProjects.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons
              name="folder-open-outline"
              size={64}
              color={Colors[colorScheme ?? 'light'].icon}
            />
            <ThemedText style={styles.emptyText}>
              {searchQuery ? 'No projects found' : 'No projects yet'}
            </ThemedText>
            {!searchQuery && (
              <TouchableOpacity style={styles.emptyButton} onPress={() => router.push('/modal')}>
                <ThemedText style={styles.emptyButtonText}>Add Your First Project</ThemedText>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
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
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  searchIcon: {
    marginRight: 12,
    opacity: 0.7,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
    fontWeight: '500',
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    marginTop: 16,
    opacity: 0.6,
  },
  emptyButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

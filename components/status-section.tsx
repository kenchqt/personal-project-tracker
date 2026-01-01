import { View, StyleSheet, FlatList } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { STATUS_COLORS } from '@/constants/project';
import { Project, ProjectStatus } from '@/types/project';
import { ProjectCard } from './project-card';

interface StatusSectionProps {
  status: ProjectStatus;
  projects: Project[];
  onStatusChange: (id: string, newStatus: ProjectStatus) => void;
  onDelete: (project: Project) => void;
}

export function StatusSection({ status, projects, onStatusChange, onDelete }: StatusSectionProps) {
  if (projects.length === 0) return null;

  return (
    <View style={styles.statusSection}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIndicator, { backgroundColor: STATUS_COLORS[status] }]} />
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {status}
        </ThemedText>
        <ThemedText style={styles.sectionCount}>({projects.length})</ThemedText>
      </View>
      <FlatList
        data={projects}
        renderItem={({ item }) => (
          <ProjectCard project={item} onStatusChange={onStatusChange} onDelete={onDelete} />
        )}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  statusSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginRight: 8,
  },
  sectionCount: {
    fontSize: 16,
    opacity: 0.6,
  },
});


import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { STATUS_COLORS, STATUS_ORDER } from '@/constants/project';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Project, ProjectStatus } from '@/types/project';

interface ProjectCardProps {
  project: Project;
  onStatusChange: (id: string, newStatus: ProjectStatus) => void;
  onDelete: (project: Project) => void;
}

export function ProjectCard({ project, onStatusChange, onDelete }: ProjectCardProps) {
  const colorScheme = useColorScheme();
  const statusIndex = STATUS_ORDER.indexOf(project.status);
  const nextStatus = statusIndex < STATUS_ORDER.length - 1 ? STATUS_ORDER[statusIndex + 1] : null;
  const canDelete = project.status === 'Cancelled';

  return (
    <ThemedView style={styles.projectCard}>
      <View style={styles.projectHeader}>
        <ThemedText type="defaultSemiBold" style={styles.projectName}>
          {project.name}
        </ThemedText>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: STATUS_COLORS[project.status] + '20' },
          ]}>
          <ThemedText style={[styles.statusText, { color: STATUS_COLORS[project.status] }]}>
            {project.status}
          </ThemedText>
        </View>
      </View>

      {project.techStack.length > 0 && (
        <View style={styles.techStack}>
          {project.techStack.map((tech) => (
            <View key={tech} style={styles.techTag}>
              <ThemedText style={styles.techText}>{tech}</ThemedText>
            </View>
          ))}
        </View>
      )}

      <View style={styles.projectMeta}>
        {project.deadline && (
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={14} color={Colors[colorScheme ?? 'light'].icon} />
            <ThemedText style={styles.metaText}>
              {(() => {
                try {
                  return new Date(project.deadline).toLocaleDateString();
                } catch {
                  return 'Invalid date';
                }
              })()}
            </ThemedText>
          </View>
        )}
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={14} color={Colors[colorScheme ?? 'light'].icon} />
          <ThemedText style={styles.metaText}>
            {(() => {
              try {
                return new Date(project.createdAt).toLocaleDateString();
              } catch {
                return 'Invalid date';
              }
            })()}
          </ThemedText>
        </View>
      </View>

      <View style={styles.projectActions}>
        {nextStatus && (
          <TouchableOpacity
            style={[styles.actionButton, styles.updateButton]}
            onPress={() => onStatusChange(project.id, nextStatus)}>
            <Ionicons name="arrow-forward" size={16} color={STATUS_COLORS[nextStatus]} />
            <ThemedText style={[styles.actionText, { color: STATUS_COLORS[nextStatus] }]}>
              Move to {nextStatus}
            </ThemedText>
          </TouchableOpacity>
        )}
        {canDelete && (
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => onDelete(project)}>
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
            <ThemedText style={[styles.actionText, { color: '#EF4444' }]}>Delete</ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  projectCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectName: {
    flex: 1,
    fontSize: 18,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  techStack: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  techTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  techText: {
    fontSize: 12,
  },
  projectMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    opacity: 0.7,
  },
  projectActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  updateButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  deleteButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});


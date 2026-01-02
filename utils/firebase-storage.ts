import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Project, ProjectStatus } from '@/types/project';

const PROJECTS_COLLECTION = 'projects';

// Convert Firestore timestamp to ISO string
const timestampToISO = (timestamp: any): string => {
  if (timestamp instanceof Timestamp || timestamp?.toDate) {
    return timestamp.toDate().toISOString();
  }
  if (typeof timestamp === 'string') {
    return timestamp;
  }
  return new Date().toISOString();
};

// Convert Project to Firestore format (without id, as Firestore generates it)
const projectToFirestore = (project: Omit<Project, 'id'>) => {
  return {
    name: project.name,
    status: project.status,
    deadline: project.deadline,
    techStack: project.techStack,
    createdAt: Timestamp.fromDate(new Date(project.createdAt)),
  };
};

// Convert Firestore document to Project
const firestoreToProject = (docId: string, data: any): Project => {
  // Validate and normalize deadline
  let deadline: string | null = null;
  if (data.deadline) {
    if (typeof data.deadline === 'string') {
      deadline = data.deadline;
    } else if (data.deadline instanceof Timestamp || data.deadline?.toDate) {
      // If deadline was stored as Timestamp, convert to ISO string
      deadline = data.deadline.toDate().toISOString();
    }
  }

  // Validate status
  const validStatuses: ProjectStatus[] = ['Planned', 'In Progress', 'Done', 'Cancelled'];
  const status = validStatuses.includes(data.status) ? data.status : 'Planned';

  return {
    id: docId,
    name: data.name || '',
    status,
    deadline,
    techStack: Array.isArray(data.techStack) ? data.techStack : [],
    createdAt: timestampToISO(data.createdAt),
  };
};

export const getProjects = async (): Promise<Project[]> => {
  try {
    const projectsRef = collection(db, PROJECTS_COLLECTION);
    const q = query(projectsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const projects: Project[] = [];
    querySnapshot.forEach((docSnapshot) => {
      const project = firestoreToProject(docSnapshot.id, docSnapshot.data());
      // Validate project structure
      if (project.id && project.name && project.status && project.createdAt) {
        projects.push(project);
      }
    });

    return projects;
  } catch (error) {
    console.error('Error loading projects from Firebase:', error);
    throw error;
  }
};

export const addProject = async (project: Omit<Project, 'id'>): Promise<void> => {
  try {
    const projectsRef = collection(db, PROJECTS_COLLECTION);
    const projectData = projectToFirestore(project);
    await addDoc(projectsRef, projectData);
  } catch (error) {
    console.error('Error adding project to Firebase:', error);
    throw error;
  }
};

export const updateProject = async (id: string, updates: Partial<Project>): Promise<void> => {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, id);
    const updateData: Record<string, any> = {};

    // Only include fields that are being updated
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.deadline !== undefined) updateData.deadline = updates.deadline;
    if (updates.techStack !== undefined) updateData.techStack = updates.techStack;

    if (Object.keys(updateData).length > 0) {
      await updateDoc(projectRef, updateData);
    }
  } catch (error) {
    console.error('Error updating project in Firebase:', error);
    throw error;
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, id);
    await deleteDoc(projectRef);
  } catch (error) {
    console.error('Error deleting project from Firebase:', error);
    throw error;
  }
};


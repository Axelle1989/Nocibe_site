import { useState, useEffect } from 'react';
import { PROJECTS, Project } from '../data/projects';

export function useProjects() {
  const [projects] = useState<Project[]>(PROJECTS);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return { projects, loading, isFallback: true };
}

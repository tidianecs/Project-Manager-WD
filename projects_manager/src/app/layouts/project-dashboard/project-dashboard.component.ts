import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/project.model';
import { SupabaseService } from 'src/app/services/supabase.service';
import { ProjectService } from 'src/app/services/project.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-dashboard',
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.css']
})
export class ProjectDashboardComponent implements OnInit {

  projects: Project[] = [];
  newProject: Project = {
    title: '',
    description: '',
  };

  loading = false;
  userId: string | null = null;

  constructor(
    private supabaseService: SupabaseService,
    private projectService: ProjectService,
    private router: Router
  ) {}

  async ngOnInit() {
    // Récupérer l'utilisateur connecté
    const { data } = await this.supabaseService.getUser();
    this.userId = data.user?.id ?? null;

    if (!this.userId) {
      this.router.navigate(['/']);
      return;
    }

    await this.loadProjects();
  }

  async loadProjects() {
    if (!this.userId) return;

    this.projects = await this.projectService.getProjects(this.userId);
  }

  async addProject() {
    if (!this.newProject.title || !this.userId) return;

    this.loading = true;

    const payload: Project = {
      ...this.newProject,
      user_id: this.userId,
    };

    const project = await this.projectService.addProject(payload);

    this.loading = false;

    this.projects.unshift(project as any);
    this.newProject = { title: '', description: '' };
  }

  async deleteProject(id: number) {
    await this.projectService.deleteProject(id);
    this.projects = this.projects.filter(p => p.id !== id);
  }

  goToProjectTasks(id: number | undefined) {
    console.log("clicked project with id:", id);
    if (!id) return;
    //this.router.navigate(['/tasks', id]);
  }
}

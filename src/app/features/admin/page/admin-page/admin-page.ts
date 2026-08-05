import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';

import { AdminNavComponent } from '../../components/admin-nav/admin-nav';
import { ReportType, PetReport, ReportFilters } from '../../../reports/data-access/report-models';

import { getAllColombianCities } from '../../../../core/services/colombia-locations';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, AdminNavComponent],
  templateUrl: './admin-page.html',
})
export class AdminPage {
  constructor(private router: Router) {}

  reports = signal<PetReport[]>([
    {
      id: '1',
      type: 'LOST',
      petName: 'Max',
      species: 'Perro',
      speciesId: 'dog',
      breed: 'Labrador',
      sex: 'MALE',
      color: 'Amarillo',
      size: 'LARGE',
      reporterName: 'Carlos Pérez',
      reporterPhone: '3001234567',
      city: 'barranquilla',
      reportedAt: '2026-06-10T10:00:00Z',
      description: 'Se perdió en el parque',
    },
    {
      id: '2',
      type: 'FOUND',
      petName: 'Luna',
      species: 'Gato',
      speciesId: 'cat',
      sex: 'FEMALE',
      color: 'Gris',
      size: 'SMALL',
      reporterName: 'María López',
      reporterPhone: '3109876543',
      city: 'bogota',
      reportedAt: '2026-06-12T15:30:00Z',
      description: 'Encontrada cerca al centro comercial',
    },
  ]);

  filterType = signal<ReportType | 'ALL'>('ALL');
  searchTerm = signal('');

  showModal = signal(false);
  editingReport = signal<PetReport | null>(null);
  showDeleteConfirm = signal<string | null>(null);

  cities = getAllColombianCities();

  filteredReports = computed(() => {
    return this.reports().filter((r) => {
      const matchType = this.filterType() === 'ALL' || r.type === this.filterType();

      const term = this.searchTerm().toLowerCase();

      const matchSearch =
        !term ||
        r.petName?.toLowerCase().includes(term) ||
        r.reporterName.toLowerCase().includes(term) ||
        r.city.toLowerCase().includes(term);

      return matchType && matchSearch;
    });
  });

  emptyForm(): PetReport {
    return {
      id: crypto.randomUUID(),
      type: 'LOST',
      species: '',
      speciesId: '',
      color: '',
      reporterName: '',
      city: '',
      reportedAt: new Date().toISOString(),
    };
  }

  openCreate(): void {
    this.editingReport.set(this.emptyForm());
    this.showModal.set(true);
  }

  openEdit(report: PetReport): void {
    this.editingReport.set({ ...report });
    this.showModal.set(true);
  }

  saveReport(): void {
    const report = this.editingReport();

    if (!report) return;

    const exists = this.reports().find((r) => r.id === report.id);

    if (exists) {
      this.reports.update((list) => list.map((r) => (r.id === report.id ? report : r)));
    } else {
      this.reports.update((list) => [...list, report]);
    }

    this.closeModal();
  }

  confirmDelete(id: string): void {
    this.showDeleteConfirm.set(id);
  }

  deleteReport(id: string): void {
    this.reports.update((list) => list.filter((r) => r.id !== id));

    this.showDeleteConfirm.set(null);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingReport.set(null);
  }

  cityLabel(value: string): string {
    return this.cities.find((c) => c.value === value)?.label ?? value;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('usuario');

    this.router.navigate(['/home']);
  }
}

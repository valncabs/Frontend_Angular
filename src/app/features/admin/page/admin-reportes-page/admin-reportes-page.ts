import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PetReport, ReportType, COLOMBIAN_CITIES } from '../../../dash/page/pet-reports/report-models';

@Component({
  selector: 'app-admin-reportes-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-reportes-page.html',
})
export class AdminReportesPage {


  reports = signal<PetReport[]>([
    {
      id: '1', type: 'LOST', petName: 'Max', species: 'Perro', speciesId: 'dog',
      breed: 'Labrador', sex: 'MALE', size: 'MEDIUM', color: 'Amarillo',
      reporterName: 'Carlos Pérez', reporterPhone: '3001234567',
      city: 'barranquilla', reportedAt: '2026-06-10T10:00:00Z',
      description: 'Se perdió en el parque'
    },
    {
      id: '2', type: 'FOUND', petName: 'Luna', species: 'Gato', speciesId: 'cat',
      sex: 'FEMALE', size: 'SMALL', color: 'Gris',
      reporterName: 'María López', reporterPhone: '3109876543',
      city: 'bogota', reportedAt: '2026-06-12T15:30:00Z',
      description: 'Encontrada cerca al centro comercial'
    }
  ]);

  filterType = signal<ReportType | 'ALL'>('ALL');
  searchTerm = signal('');
  showModal = signal(false);
  editingReport = signal<PetReport | null>(null);
  showDeleteConfirm = signal<string | null>(null);
  cities = COLOMBIAN_CITIES;

  filteredReports = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const type = this.filterType();
    return this.reports().filter(r =>
      (type === 'ALL' || r.type === type) &&
      (!term ||
        r.petName?.toLowerCase().includes(term) ||
        r.reporterName.toLowerCase().includes(term) ||
        r.city.toLowerCase().includes(term))
    );
  });

  openCreate() {
    this.editingReport.set({
      id: crypto.randomUUID(), type: 'LOST', petName: '', species: '',
      speciesId: '', breed: '', sex: 'MALE', size: 'MEDIUM', color: '',
      reporterName: '', reporterPhone: '', city: '',
      reportedAt: new Date().toISOString(), description: ''
    });
    this.showModal.set(true);
  }

  openEdit(r: PetReport) {
    this.editingReport.set({ ...r });
    this.showModal.set(true);
  }

  saveReport() {
    const report = this.editingReport();
    if (!report) return;
    const exists = this.reports().find(r => r.id === report.id);
    if (exists) {
      this.reports.update(list => list.map(r => r.id === report.id ? report : r));
    } else {
      this.reports.update(list => [...list, report]);
    }
    this.closeModal();
  }

  confirmDelete(id: string) { this.showDeleteConfirm.set(id); }

  deleteReport(id: string) {
    this.reports.update(list => list.filter(r => r.id !== id));
    this.showDeleteConfirm.set(null);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingReport.set(null);
  }

  cityLabel(value: string) {
    return this.cities.find(c => c.value === value)?.label ?? value;
  }
}
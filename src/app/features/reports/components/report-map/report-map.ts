import {
  Component,
  OnChanges,
  OnDestroy,
  AfterViewInit,
  SimpleChanges,
  ElementRef,
  ViewChild,
  signal,
  computed,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnifiedReportItem } from '../../data-access/report-models';
import { loadExternalScript, loadExternalStylesheet } from '../../../../core/utils/external-scripts';

declare const maplibregl: any;

/** Estilo vectorial gratuito de OpenFreeMap, sin API key ni límite de uso.
 * https://openfreemap.org */
const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

/** Centro aproximado de Colombia continental, usado antes de que existan
 * reportes con los que hacer fitBounds. */
const COLOMBIA_CENTER: [number, number] = [-74.2973, 4.5709];

const MARKER_COLORS: Record<string, string> = {
  LOST: '#f59e0b',
  FOUND: '#10b981',
};

/** Color de los grupos (clusters): azul para no confundirse con el verde de
 * los reportes "Encontrada" en la pestaña de perdidas. */
const CLUSTER_COLOR = '#2563eb';

/** Tamaño del marcador circular compuesto (canvas 64x64) sobre el terreno. */
const MARKER_SIZE = 0.75;

/**
 * Pinta en un mapa MapLibre los reportes recibidos por @Input(), agrupados
 * en clusters cuando están cerca entre sí. No decide qué datos mostrar —
 * el padre (pet-reports) ya le pasa exactamente la página/filtro activos.
 * Al hacer click en un punto individual, emite el reporte correspondiente
 * para que el padre reutilice su propio modal de detalle (openDetail).
 */
@Component({
  selector: 'app-report-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-map.html',
})
export class ReportMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef<HTMLDivElement>;

  readonly reports = input<UnifiedReportItem[]>([]);

  readonly markerClick = output<UnifiedReportItem>();

  mapReady = signal(false);
  mapLoadError = signal(false);

  private map: any = null;
  private viewInitialized = false;
  private renderToken = 0;
  private defaultPinsReady = false;

  /** Filtro memorizado (computed) para no re-iterar `reports` en cada ciclo
   * de detección de cambios. */
  readonly pointsWithLocation = computed(() =>
    this.reports().filter((r) => r.latitude != null && r.longitude != null),
  );

  /** Tipo visual del marcador: un perdido que ya fue encontrado (status FOUND)
   * se pinta como encontrado (verde), no como perdido (ámbar). */
  private markerKind(r: UnifiedReportItem): string {
    return r.kind === 'FOUND' || r.status === 'FOUND' || r.status === 'Encontrada'
      ? 'FOUND'
      : 'LOST';
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.loadMapLibreAndInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.viewInitialized || !this.map) return;
    if (changes['reports']) this.renderMarkers();
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.map = null;
  }

  private async loadMapLibreAndInit(): Promise<void> {
    if (typeof maplibregl === 'undefined') {
      loadExternalStylesheet('https://unpkg.com/maplibre-gl@4/dist/maplibre-gl.css');
      try {
        await loadExternalScript('https://unpkg.com/maplibre-gl@4/dist/maplibre-gl.js');
      } catch {
        // CDN caído o bloqueado: mostrar el error en vez de un spinner infinito.
        this.mapLoadError.set(true);
        return;
      }
    }
    this.initMap();
  }

  private initMap(): void {
    if (!this.mapContainer?.nativeElement) return;

    this.map = new maplibregl.Map({
      container: this.mapContainer.nativeElement,
      style: MAP_STYLE,
      center: COLOMBIA_CENTER,
      zoom: 5,
    });

    this.map.addControl(new maplibregl.NavigationControl(), 'top-right');

    this.map.on('load', () => {
      this.setupSourceAndLayers();
      this.renderMarkers();
      this.mapReady.set(true);
    });
  }

  private setupSourceAndLayers(): void {
    this.map.addSource('reports', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });

    this.map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'reports',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': CLUSTER_COLOR,
        'circle-radius': ['step', ['get', 'point_count'], 18, 10, 24, 30, 30],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
      },
    });

    this.map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'reports',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': ['get', 'point_count_abbreviated'],
        'text-font': ['Noto Sans Bold'],
        'text-size': 13,
      },
      paint: { 'text-color': '#ffffff' },
    });

    // Marcadores individuales: un símbolo por reporte, con la foto de la
    // mascota recortada en círculo.
    this.map.addLayer({
      id: 'report-pin',
      type: 'symbol',
      source: 'reports',
      filter: ['!', ['has', 'point_count']],
      layout: {
        'icon-image': ['get', 'icon'],
        'icon-size': MARKER_SIZE,
        'icon-anchor': 'center',
        'icon-allow-overlap': true,
      },
    });

    this.map.on('click', 'clusters', (e: any) => {
      const features = this.map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
      const clusterId = features[0].properties['cluster_id'];
      this.map.getSource('reports').getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
        if (err) return;
        this.map.easeTo({ center: features[0].geometry.coordinates, zoom });
      });
    });

    this.map.on('click', 'report-pin', (e: any) => {
      const feature = e.features[0];
      const id = feature.properties['id'];
      const item = this.reports().find((r) => r.id === id);
      if (item) this.markerClick.emit(item);
    });

    ['clusters', 'report-pin'].forEach((layer) => {
      this.map.on('mouseenter', layer, () => (this.map.getCanvas().style.cursor = 'pointer'));
      this.map.on('mouseleave', layer, () => (this.map.getCanvas().style.cursor = ''));
    });
  }

  private async renderMarkers(): Promise<void> {
    if (!this.map || !this.map.getSource('reports')) return;

    const token = ++this.renderToken;
    const points = this.pointsWithLocation();

    // Pines por defecto (sin foto o si la foto no se puede cargar).
    this.ensureDefaultPins();

    // Registra cada foto única como imagen de MapLibre (pin compuesto).
    const uniquePhotos = [
      ...new Set(points.map((p) => p.photoUrl).filter((u): u is string => !!u)),
    ];
    const kindByUrl = new Map<string, string>();
    points.forEach((p) => {
      if (p.photoUrl) kindByUrl.set(p.photoUrl, this.markerKind(p));
    });
    const iconByUrl = new Map<string, string>();

    const photoTasks = uniquePhotos.map(async (url, index) => {
      const kind = kindByUrl.get(url) ?? 'LOST';
      const id = `rpt-photo-${kind}-${index}`;
      if (this.map.hasImage(id)) {
        iconByUrl.set(url, id);
        return;
      }
      try {
        const loaded = await this.map.loadImage(url);
        const img = loaded?.data ?? loaded;
        this.map.addImage(id, this.composeCircle(img, kind));
        iconByUrl.set(url, id);
      } catch {
        // Sin foto usable: se usa el marcador por defecto de su tipo.
      }
    });
    await Promise.all(photoTasks);

    if (token !== this.renderToken || !this.map || !this.map.getSource('reports')) return;

    const geojson = {
      type: 'FeatureCollection' as const,
      features: points.map((r) => {
        const photoId = r.photoUrl ? iconByUrl.get(r.photoUrl) : undefined;
        return {
          type: 'Feature' as const,
          geometry: { type: 'Point' as const, coordinates: [r.longitude!, r.latitude!] },
          properties: {
            id: r.id,
            kind: r.kind,
            title: r.title,
            icon: photoId ?? this.defaultCircleId(this.markerKind(r)),
          },
        };
      }),
    };

    this.map.getSource('reports').setData(geojson);

    if (points.length > 0) {
      const bounds = new maplibregl.LngLatBounds();
      points.forEach((p) => bounds.extend([p.longitude!, p.latitude!]));
      this.map.fitBounds(bounds, { padding: 60, maxZoom: 13, duration: 500 });
    }
  }

  // ---------- Generación de marcadores ----------

  private ensureDefaultPins(): void {
    if (this.defaultPinsReady) return;
    if (!this.map.hasImage('marker-lost')) {
      this.map.addImage('marker-lost', this.defaultCircle('LOST'));
    }
    if (!this.map.hasImage('marker-found')) {
      this.map.addImage('marker-found', this.defaultCircle('FOUND'));
    }
    this.defaultPinsReady = true;
  }

  private defaultCircleId(kind: string): string {
    return kind === 'FOUND' ? 'marker-found' : 'marker-lost';
  }

  /** Círculo de color de respaldo (sin foto): usado cuando el reporte no tiene
   * imagen o esta no pudo cargarse. */
  private defaultCircle(kind: string): ImageData {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new ImageData(64, 64);
    this.drawCircleBase(ctx, kind);
    return ctx.getImageData(0, 0, 64, 64);
  }

  /** Círculo con la foto del reporte recortada, bordeado por el color del tipo. */
  private composeCircle(photo: HTMLImageElement | ImageBitmap, kind: string): ImageData {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new ImageData(64, 64);

    try {
      this.drawCircleBase(ctx, kind);

      // Foto recortada en círculo (cubrir).
      ctx.save();
      ctx.beginPath();
      ctx.arc(32, 32, 18, 0, Math.PI * 2);
      ctx.clip();
      const d = 36;
      const w = (photo as any).width ?? d;
      const h = (photo as any).height ?? d;
      const scale = Math.max(d / w, d / h);
      const dw = w * scale;
      const dh = h * scale;
      ctx.drawImage(photo as CanvasImageSource, 32 - dw / 2, 32 - dh / 2, dw, dh);
      ctx.restore();

      return ctx.getImageData(0, 0, 64, 64);
    } catch {
      return this.defaultCircle(kind);
    }
  }

  /** Dibuja el disco de color (borde del marcador) con anillo blanco. */
  private drawCircleBase(ctx: CanvasRenderingContext2D, kind: string): void {
    const color = MARKER_COLORS[kind] ?? '#6b7280';

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(32, 32, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(32, 32, 21, 0, Math.PI * 2);
    ctx.fill();
  }
}

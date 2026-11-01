import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Navigation,
  Clock,
  Phone,
  Star,
  ExternalLink,
  Store,
  Compass,
  Filter,
} from 'lucide-react';
import { StoreLocation } from '../types';
import { POPULAR_CITIES, getMapsNavigationUrl } from '../data/stores';

interface StoreMapProps {
  currentCityName: string;
  onSelectStore?: (store: StoreLocation) => void;
}

export const StoreMap: React.FC<StoreMapProps> = ({ currentCityName, onSelectStore }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [activeStore, setActiveStore] = useState<StoreLocation | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [mapService, setMapService] = useState<'yandex' | 'gis' | 'google'>('yandex');

  // Find current city stores or fallback to Moscow / first city
  const currentCityData =
    POPULAR_CITIES.find(
      (c) =>
        c.name.toLowerCase() === (currentCityName || '').trim().toLowerCase() ||
        c.id === (currentCityName || '').trim().toLowerCase() ||
        (currentCityName || '').toLowerCase().includes(c.name.toLowerCase()) ||
        c.name.toLowerCase().includes((currentCityName || '').toLowerCase())
    ) || POPULAR_CITIES[0];

  const stores = currentCityData?.stores || [];

  const filteredStores = stores.filter((store) => {
    if (filterType === 'all') return true;
    return store.type === filterType;
  });

  const [isMapReady, setIsMapReady] = useState(false);

  // Lazy-load map container using IntersectionObserver to prevent tile requests during initial AI analysis
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsMapReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    observer.observe(mapContainerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isMapReady || !mapContainerRef.current) return;

    try {
      // Clean up previous map instance and DOM state
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (mapContainerRef.current) {
        (mapContainerRef.current as any)._leaflet_id = null;
        mapContainerRef.current.innerHTML = '';
      }

      const lat = typeof currentCityData?.lat === 'number' ? currentCityData.lat : 55.7558;
      const lng = typeof currentCityData?.lng === 'number' ? currentCityData.lng : 37.6173;
      const cityCenter: [number, number] = [lat, lng];

      // Initialize Leaflet map safely
      const map = L.map(mapContainerRef.current, {
        center: cityCenter,
        zoom: 12,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    } catch (mapInitErr) {
      console.warn('Leaflet map initialization caught gracefully:', mapInitErr);
    }

    return () => {
      try {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
        if (mapContainerRef.current) {
          (mapContainerRef.current as any)._leaflet_id = null;
          mapContainerRef.current.innerHTML = '';
        }
      } catch (cleanupErr) {
        console.warn('Leaflet cleanup caught gracefully:', cleanupErr);
      }
    };
  }, [isMapReady, currentCityData?.id, currentCityData?.lat, currentCityData?.lng]);

  // Update markers when filtered stores change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    try {
      // Clear old markers
      markersRef.current.forEach((marker) => {
        try {
          marker.remove();
        } catch {}
      });
      markersRef.current = [];

      const bounds = L.latLngBounds([]);

      filteredStores.forEach((store) => {
        if (typeof store.lat !== 'number' || typeof store.lng !== 'number') return;
        const isSelected = activeStore?.id === store.id;

        // Custom SVG icon marker
        const customIcon = L.divIcon({
          className: 'custom-store-pin',
          html: `
            <div style="
              display: flex;
              align-items: center;
              justify-content: center;
              width: ${isSelected ? '36px' : '28px'};
              height: ${isSelected ? '36px' : '28px'};
              background: ${isSelected ? '#ea580c' : '#0284c7'};
              border: 2px solid #ffffff;
              border-radius: 50%;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              color: #ffffff;
              font-size: ${isSelected ? '14px' : '11px'};
              font-weight: bold;
              transition: all 0.2s ease;
            ">
              🛠️
            </div>
          `,
          iconSize: [isSelected ? 36 : 28, isSelected ? 36 : 28],
          iconAnchor: [isSelected ? 18 : 14, isSelected ? 18 : 14],
        });

        const marker = L.marker([store.lat, store.lng], { icon: customIcon }).addTo(map);

        marker.on('click', () => {
          setActiveStore(store);
          if (onSelectStore) onSelectStore(store);
        });

        markersRef.current.push(marker);
        bounds.extend([store.lat, store.lng]);
      });

      if (bounds.isValid() && filteredStores.length > 0) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }
    } catch (markerErr) {
      console.warn('Leaflet markers update caught gracefully:', markerErr);
    }
  }, [filteredStores, activeStore, onSelectStore]);

  const handleStoreCardClick = (store: StoreLocation) => {
    setActiveStore(store);
    try {
      if (mapInstanceRef.current && typeof store.lat === 'number' && typeof store.lng === 'number') {
        mapInstanceRef.current.flyTo([store.lat, store.lng], 15, { duration: 0.8 });
      }
    } catch (err) {
      console.warn('Leaflet flyTo caught gracefully:', err);
    }
  };

  return (
    <div className="space-y-3 bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Store className="w-5 h-5 text-orange-600" />
            <span>Ближайшие строительные и хоз. магазины</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Где прямо сейчас купить крепеж, расходники, инструменты и сантехнику в г. {currentCityData.name}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
              filterType === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Все ({stores.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('hypermarket')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
              filterType === 'hypermarket'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Гипермаркеты
          </button>
          <button
            type="button"
            onClick={() => setFilterType('tools')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
              filterType === 'tools'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Инструменты & Экспресс
          </button>
          <button
            type="button"
            onClick={() => setFilterType('neighborhood')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
              filterType === 'neighborhood'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            У дома
          </button>
        </div>
      </div>

      {/* Interactive Map Container */}
      <div className="relative rounded-xl overflow-hidden border border-slate-200 h-64 sm:h-80 z-10">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Map Legend Overlay */}
        <div className="absolute top-2 right-2 z-20 bg-white/90 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px] shadow-sm flex items-center gap-2">
          <span className="flex items-center gap-1 text-slate-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block" /> Магазины ({filteredStores.length})
          </span>
        </div>
      </div>

      {/* Store Cards Carousel / List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 pt-1">
          <span>Список точек с адресами и графиком работы:</span>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-normal">
            <span>Маршрут в:</span>
            <button
              onClick={() => setMapService('yandex')}
              className={`px-1.5 py-0.5 rounded ${mapService === 'yandex' ? 'bg-orange-100 text-orange-800 font-semibold' : 'hover:bg-slate-100'}`}
            >
              Яндекс
            </button>
            <button
              onClick={() => setMapService('gis')}
              className={`px-1.5 py-0.5 rounded ${mapService === 'gis' ? 'bg-orange-100 text-orange-800 font-semibold' : 'hover:bg-slate-100'}`}
            >
              2ГИС
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filteredStores.map((store) => {
            const isSelected = activeStore?.id === store.id;
            return (
              <div
                key={store.id}
                onClick={() => handleStoreCardClick(store)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20 shadow-xs'
                    : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold text-xs sm:text-sm text-slate-900 leading-snug">
                    {store.name}
                  </div>
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 shrink-0">
                    <Star className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600" /> {store.rating}
                  </span>
                </div>

                <div className="mt-1.5 space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span className="truncate">{store.address}</span>
                    <span className="text-[10px] text-slate-400 font-normal shrink-0">
                      (~{store.distanceKm} км)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{store.workingHours}</span>
                  </div>
                </div>

                {/* Features tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {store.features.slice(0, 3).map((feat, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600"
                    >
                      {feat}
                    </span>
                  ))}
                </div>

                {/* Navigation CTA button */}
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> {store.phone}
                  </span>
                  <a
                    href={getMapsNavigationUrl(store, mapService)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Построить маршрут</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

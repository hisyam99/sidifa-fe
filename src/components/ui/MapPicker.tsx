import {
  component$,
  useSignal,
  useVisibleTask$,
  $,
  type QRL,
} from "@builder.io/qwik";
import type * as L from "leaflet";
import { LuMapPin, LuX } from "~/components/icons/lucide-optimized";

interface MapPickerProps {
  initialLat?: number;
  initialLng?: number;
  onLocationSelect$: QRL<(lat: number, lng: number) => void>;
  currentValue?: string;
}

export const MapPicker = component$<MapPickerProps>(
  ({
    initialLat = -7.9666,
    initialLng = 112.6326,
    onLocationSelect$,
    currentValue,
  }) => {
    const isOpen = useSignal(false);
    const mapContainer = useSignal<HTMLElement>();
    const selectedLat = useSignal(initialLat);
    const selectedLng = useSignal(initialLng);
    const mapInstance = useSignal<L.Map | null>(null);

    // Parse current value if exists
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ track }) => {
      track(() => currentValue);
      if (currentValue && currentValue.includes(",")) {
        const [lat, lng] = currentValue
          .split(",")
          .map((v) => parseFloat(v.trim()));
        if (!isNaN(lat) && !isNaN(lng)) {
          selectedLat.value = lat;
          selectedLng.value = lng;
        }
      }
    });

    // Initialize map when modal opens
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(async ({ track, cleanup }) => {
      track(() => isOpen.value);

      if (!isOpen.value || !mapContainer.value) return;

      // Dynamically import Leaflet
      const L = (await import("leaflet")).default;

      // Add Leaflet CSS
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Initialize map
      const map = L.map(mapContainer.value).setView(
        [selectedLat.value, selectedLng.value],
        13,
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Create custom icon using Lucide MapPin
      const customIcon = L.divIcon({
        className: "custom-map-marker",
        html: `
        <div style="position: relative;">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #127FBE; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      // Add marker with custom icon
      const marker = L.marker([selectedLat.value, selectedLng.value], {
        draggable: true,
        icon: customIcon,
      }).addTo(map);

      // Update coordinates when marker is dragged
      marker.on("dragend", function () {
        const position = marker.getLatLng();
        selectedLat.value = position.lat;
        selectedLng.value = position.lng;
      });

      // Update marker position when clicking on map
      map.on("click", function (e: L.LeafletMouseEvent) {
        marker.setLatLng(e.latlng);
        selectedLat.value = e.latlng.lat;
        selectedLng.value = e.latlng.lng;
      });

      mapInstance.value = map;

      // Try to get user's current location
      if (navigator.geolocation && !currentValue) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            selectedLat.value = latitude;
            selectedLng.value = longitude;
            map.setView([latitude, longitude], 13);
            marker.setLatLng([latitude, longitude]);
          },
          (error) => {
            console.log("Location access denied:", error);
          },
        );
      }

      cleanup(() => {
        if (mapInstance.value) {
          mapInstance.value.remove();
          mapInstance.value = null;
        }
      });
    });

    const handleConfirm = $(() => {
      onLocationSelect$(selectedLat.value, selectedLng.value);
      isOpen.value = false;
    });

    return (
      <>
        <button
          type="button"
          class="btn btn-outline btn-sm gap-2"
          onClick$={() => (isOpen.value = true)}
        >
          <LuMapPin class="w-4 h-4" />
          Pilih dari Peta
        </button>

        {isOpen.value && (
          <div class="modal modal-open">
            <div class="modal-box max-w-4xl">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-bold text-lg">Pilih Lokasi dari Peta</h3>
                <button
                  type="button"
                  class="btn btn-sm btn-circle btn-ghost"
                  onClick$={() => (isOpen.value = false)}
                >
                  <LuX class="w-5 h-5" />
                </button>
              </div>

              <div class="alert alert-info mb-4">
                <LuMapPin class="w-5 h-5" />
                <span class="text-sm">
                  Klik pada peta atau seret marker untuk memilih lokasi. Lokasi
                  awal akan menggunakan posisi Anda saat ini jika memungkinkan.
                </span>
              </div>

              <div
                ref={mapContainer}
                style="height: 400px; width: 100%; border-radius: 8px;"
                class="mb-4"
              />

              <div class="bg-base-200 p-3 rounded-lg mb-4">
                <p class="text-sm font-semibold mb-1">Koordinat Terpilih:</p>
                <p class="font-mono text-sm">
                  {selectedLat.value.toFixed(6)}, {selectedLng.value.toFixed(6)}
                </p>
              </div>

              <div class="modal-action">
                <button
                  type="button"
                  class="btn btn-ghost"
                  onClick$={() => (isOpen.value = false)}
                >
                  Batal
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  onClick$={handleConfirm}
                >
                  Konfirmasi Lokasi
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  },
);

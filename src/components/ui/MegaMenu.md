# MegaMenu Component

Komponen MegaMenu yang dapat digunakan ulang dengan fitur hover delay untuk navigasi admin dan kader.

## Fitur

- ✅ Hover delay yang dapat dikustomisasi
- ✅ Animasi smooth saat muncul/hilang
- ✅ Kompatibel dengan DaisyUI v5
- ✅ Best practice untuk Qwik
- ✅ Responsive design
- ✅ Accessibility support

## Penggunaan

### Basic Usage

```tsx
import { MegaMenu } from "~/components/ui";

<MegaMenu delayMs={300}>
  <div q:slot="trigger">
    <button class="btn btn-primary">Menu</button>
  </div>
  <div q:slot="content">
    <div class="bg-base-100 border rounded-lg p-4">
      Menu content here
    </div>
  </div>
</MegaMenu>
```

### Dengan Custom Delay

```tsx
<MegaMenu delayMs={500}>
  <div q:slot="trigger">
    <button class="btn btn-secondary">Menu dengan 500ms delay</button>
  </div>
  <div q:slot="content">
    <div class="bg-base-100 border rounded-lg p-4">
      Content dengan delay lebih lama
    </div>
  </div>
</MegaMenu>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `delayMs` | `number` | `300` | Delay dalam milidetik sebelum menu hilang |
| `class` | `string` | `""` | CSS class tambahan |

## Slots

| Slot | Description |
|------|-------------|
| `trigger` | Elemen yang akan di-hover |
| `content` | Konten mega menu yang akan ditampilkan |

## Implementasi di Navigation

### NavigationAdmin.tsx
```tsx
<MegaMenu delayMs={300} class="dropdown-end">
  <div q:slot="trigger">
    {/* Trigger button */}
  </div>
  <div q:slot="content">
    {/* Admin submenu content */}
  </div>
</MegaMenu>
```

### NavigationKader.tsx
```tsx
<MegaMenu delayMs={300} class="dropdown-end">
  <div q:slot="trigger">
    {/* Trigger button */}
  </div>
  <div q:slot="content">
    {/* Kader submenu content */}
  </div>
</MegaMenu>
```

## CSS Classes

Komponen menggunakan CSS custom untuk animasi:

- `.mega-menu-enter` - Animasi saat menu muncul
- `.mega-menu-exit` - Animasi saat menu hilang
- `.mega-menu-content` - Styling untuk konten menu

## Best Practices

1. **Delay yang Tepat**: Gunakan delay 300-500ms untuk UX yang optimal
2. **Z-index**: Pastikan z-index cukup tinggi untuk overlay
3. **Responsive**: Test pada berbagai ukuran layar
4. **Accessibility**: Pastikan keyboard navigation berfungsi
5. **Performance**: Gunakan `useVisibleTask$` untuk cleanup

## Contoh Demo

Lihat `MegaMenuDemo.tsx` untuk contoh lengkap penggunaan komponen ini. 
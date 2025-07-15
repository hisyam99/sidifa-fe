import type { DisabilityType } from "./ibk";

// ========== Educational Content Types ==========

export type ContentType = "artikel" | "video" | "pdf" | "modul";
export type ContentCategory =
  | "jenis_disabilitas"
  | "stimulasi_dini"
  | "pola_asuh"
  | "hak_regulasi"
  | "pelatihan_kader";

export interface EducationalContent {
  id: string;
  judul: string;
  deskripsi: string;
  konten: string; // HTML content or markdown
  kategori: ContentCategory;
  tipe: ContentType;

  // Media files
  thumbnail?: string;
  file_url?: string; // For PDF/video files

  // Metadata
  penulis: string;
  tanggal_publikasi: string;
  tags: string[];
  durasi_baca?: number; // in minutes
  tingkat_kesulitan?: "pemula" | "menengah" | "lanjut";

  // Engagement
  views: number;
  likes: number;
  downloads?: number;

  // Status
  status: "draft" | "published" | "archived";
  featured: boolean;

  created_at: string;
  updated_at: string;
}

export interface ContentCategoryData {
  id: string;
  nama: string;
  deskripsi: string;
  icon: string;
  warna: string;
  jumlah_konten: number;
}

// ========== Job Opportunities Types ==========

export type JobType =
  | "full_time"
  | "part_time"
  | "internship"
  | "freelance"
  | "volunteer";
export type DisabilityFriendlyLevel =
  | "sangat_ramah"
  | "ramah"
  | "cukup_ramah"
  | "perlu_adaptasi";

export interface JobOpportunity {
  id: string;
  judul: string;
  deskripsi: string;
  persyaratan: string[];

  // Company Information
  nama_perusahaan: string;
  logo_perusahaan?: string;
  alamat_perusahaan: string;
  kontak_perusahaan: {
    email: string;
    telepon?: string;
    website?: string;
  };

  // Job Details
  tipe_pekerjaan: JobType;
  gaji_min?: number;
  gaji_max?: number;
  mata_uang: string;
  lokasi: string;
  remote_friendly: boolean;

  // Disability Accommodation
  tingkat_ramah_disabilitas: DisabilityFriendlyLevel;
  jenis_disabilitas_cocok: DisabilityType[];
  fasilitas_pendukung: string[];
  aksesibilitas_kantor: string[];

  // Application
  cara_melamar: string;
  deadline_aplikasi?: string;
  kontak_aplikasi: {
    email: string;
    pic_name?: string;
    telepon?: string;
  };

  // Metadata
  tanggal_posting: string;
  status: "active" | "closed" | "expired";
  views: number;
  aplikasi_diterima: number;

  created_at: string;
  updated_at: string;
}

export interface DisabilityFriendlyCompany {
  id: string;
  nama: string;
  deskripsi: string;
  logo?: string;
  website: string;
  alamat: string;

  // Contact
  kontak: {
    email: string;
    telepon?: string;
    pic_name?: string;
  };

  // Disability Support
  tingkat_ramah_disabilitas: DisabilityFriendlyLevel;
  sertifikasi_inklusif?: string[];
  program_magang: boolean;
  pelatihan_tersedia: boolean;

  // Facilities
  fasilitas_aksesibilitas: string[];
  teknologi_pendukung: string[];

  // Jobs & Stats
  total_lowongan_aktif: number;
  total_karyawan_disabilitas: number;

  status: "verified" | "pending" | "rejected";
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  ibk_id: string;
  kader_id: string; // Kader yang mengajukan

  // Application Details
  cv_url: string;
  cover_letter?: string;
  portfolio_url?: string;

  // Recommendation from Kader
  rekomendasi_kader: string;
  keterampilan_ibk: string[];
  pengalaman_ibk?: string;

  // Status Tracking
  status:
    | "submitted"
    | "reviewed"
    | "shortlisted"
    | "interviewed"
    | "accepted"
    | "rejected";
  catatan_hr?: string;
  tanggal_interview?: string;
  feedback?: string;

  applied_at: string;
  updated_at: string;
}

// ========== Training & Skills Types ==========

export interface SkillTraining {
  id: string;
  nama_pelatihan: string;
  deskripsi: string;
  kategori:
    | "keterampilan_teknis"
    | "keterampilan_sosial"
    | "keterampilan_hidup"
    | "keterampilan_kerja";

  // Training Details
  durasi: number; // in hours
  metode: "online" | "offline" | "hybrid";
  tingkat: "pemula" | "menengah" | "lanjut";

  // Content
  materi: string[];
  sertifikat_tersedia: boolean;

  // Targeting
  cocok_untuk_disabilitas: DisabilityType[];
  usia_target_min: number;
  usia_target_max: number;

  // Provider
  penyelenggara: string;
  instruktur: string[];
  kontak_pendaftaran: {
    email: string;
    telepon?: string;
    website?: string;
  };

  // Schedule
  jadwal_mulai?: string;
  jadwal_selesai?: string;
  biaya?: number;
  kuota_peserta?: number;
  peserta_terdaftar: number;

  status: "open" | "ongoing" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}

// ========== Posyandu Schedule & Activities Types ==========

export type ActivityType =
  | "pemeriksaan_rutin"
  | "vaksinasi"
  | "konseling"
  | "edukasi"
  | "rujukan"
  | "home_visit";
export type ActivityStatus =
  | "scheduled"
  | "ongoing"
  | "completed"
  | "cancelled"
  | "postponed";

export interface PosyanduActivity {
  id: string;
  posyandu_id: string;

  // Activity Details
  nama_kegiatan: string;
  deskripsi?: string;
  tipe_kegiatan: ActivityType;

  // Schedule
  tanggal: string;
  waktu_mulai: string;
  waktu_selesai: string;
  lokasi?: string;

  // Participants
  target_peserta: "semua_ibk" | "ibk_tertentu" | "kader" | "keluarga";
  ibk_yang_diundang?: string[]; // IBK IDs
  estimasi_peserta: number;
  peserta_hadir: number;

  // Resources
  kader_penanggung_jawab: string[];
  peralatan_dibutuhkan?: string[];
  materi_edukasi?: string[];

  // Documentation
  foto_kegiatan?: string[];
  catatan_hasil?: string;
  kendala_yang_dihadapi?: string[];

  status: ActivityStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface PosyanduSchedule {
  id: string;
  posyandu_id: string;

  // Regular Schedule
  hari_kegiatan: string; // "senin", "selasa", etc.
  waktu_mulai: string;
  waktu_selesai: string;
  frekuensi: "mingguan" | "bulanan" | "harian";

  // Location
  lokasi_tetap: string;
  alamat_detail?: string;

  // Activities
  kegiatan_rutin: ActivityType[];

  // Participants
  kapasitas_maksimal: number;
  rata_rata_kehadiran: number;

  // Status
  aktif: boolean;
  catatan?: string;

  created_at: string;
  updated_at: string;
}

export interface AttendanceRecord {
  id: string;
  activity_id: string;

  // Kader Attendance
  kader_hadir: Array<{
    kader_id: string;
    nama: string;
    waktu_hadir: string;
    peran: string;
  }>;

  // IBK Attendance
  ibk_hadir: Array<{
    ibk_id: string;
    nama: string;
    waktu_hadir: string;
    didampingi_oleh?: string;
    kondisi_saat_hadir?: string;
  }>;

  // Summary
  total_kader_hadir: number;
  total_ibk_hadir: number;
  total_pendamping_hadir: number;

  recorded_by: string;
  recorded_at: string;
}

// ========== Content Statistics & Analytics ==========

export interface ContentAnalytics {
  content_id: string;

  // Engagement Metrics
  views_per_day: Array<{
    date: string;
    views: number;
  }>;

  downloads_per_day: Array<{
    date: string;
    downloads: number;
  }>;

  // User Engagement
  avg_reading_time: number;
  bounce_rate: number;
  likes: number;
  shares: number;

  // Demographics
  viewers_by_role: {
    kader: number;
    psikolog: number;
    keluarga: number;
  };

  viewers_by_region: Array<{
    kecamatan: string;
    views: number;
  }>;

  last_updated: string;
}

// ========== API Response Types ==========

export interface GetContentListResponse {
  success: boolean;
  data: EducationalContent[];
  meta: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    categories: ContentCategoryData[];
  };
}

export interface GetJobListResponse {
  success: boolean;
  data: JobOpportunity[];
  meta: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    featured_companies: DisabilityFriendlyCompany[];
  };
}

export interface GetScheduleResponse {
  success: boolean;
  data: {
    regular_schedule: PosyanduSchedule;
    upcoming_activities: PosyanduActivity[];
    recent_activities: PosyanduActivity[];
  };
}

// ========== IBK (Individu Berkebutuhan Khusus) Types ==========

export type Gender = "laki-laki" | "perempuan";
export type DisabilityType = "fisik" | "intelektual" | "mental" | "sensorik";
export type MaritalStatus = "single" | "married" | "divorced" | "widowed";

// Development status type alias
export type DevelopmentStatus = "sesuai" | "terlambat" | "tidak_sesuai";

// Severity level type aliases
export type SeverityLevel = "ringan" | "sedang" | "berat";
export type ExtendedSeverityLevel = "ringan" | "sedang" | "berat" | "parah";
export type CognitiveSeverity = "normal" | "ringan" | "sedang" | "berat";

// Capability levels
export type MobilityCapability =
  | "mandiri"
  | "bantuan_sebagian"
  | "bantuan_total";
export type CommunicationCapability = "normal" | "terbatas" | "sangat_terbatas";
export type SocialCapability = "baik" | "cukup" | "kurang";

// Status types
export type ReferralStatus = "pending" | "completed" | "cancelled";

// Base IBK Personal Data
export interface IBKPersonalData {
  id?: string;
  nama_lengkap: string;
  nik: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  gender: Gender;
  agama: string;
  alamat_lengkap: string;
  rt_rw: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kode_pos: string;
  no_telp?: string;
  email?: string;
  nama_ayah?: string;
  nama_ibu?: string;
  pekerjaan_ayah?: string;
  pekerjaan_ibu?: string;
  pendidikan_terakhir?: string;
  status_pernikahan?: MaritalStatus;
  created_at?: string;
  updated_at?: string;
}

// Psychological Assessment Types
export interface PsychologicalAssessment {
  id?: string;
  ibk_id: string;
  psikolog_id: string;
  tanggal_asesmen: string;

  // IQ Assessment
  iq_score?: number;
  iq_kategori?:
    | "sangat_rendah"
    | "rendah"
    | "rata_rata_bawah"
    | "rata_rata"
    | "rata_rata_atas"
    | "tinggi"
    | "sangat_tinggi";

  // Personality Assessment
  kepribadian_tipe?: string;
  kepribadian_deskripsi?: string;

  // Interest & Potential
  minat_utama?: string[];
  potensi_akademik?: string[];
  potensi_non_akademik?: string[];

  // Recommendations
  rekomendasi_intervensi?: string;
  rekomendasi_terapi?: string;
  rekomendasi_pendidikan?: string;

  // Assessment Files
  dokumen_asesmen?: string[]; // File URLs

  catatan_psikolog?: string;
  status: "draft" | "completed" | "reviewed";
  created_at?: string;
  updated_at?: string;
}

// Disability Information
export interface DisabilityInfo {
  id?: string;
  ibk_id: string;
  jenis_disabilitas: DisabilityType[];

  // Specific disability details
  deskripsi_kondisi: string;
  tingkat_keparahan?: SeverityLevel;
  sejak_kapan?: string;
  penyebab?: string;

  // Functional capabilities
  kemampuan_mobilitas?: MobilityCapability;
  kemampuan_komunikasi?: CommunicationCapability;
  kemampuan_kognitif?: CognitiveSeverity;
  kemampuan_sosial?: SocialCapability;

  // Support needs
  kebutuhan_alat_bantu?: string[];
  kebutuhan_terapi?: string[];

  created_at?: string;
  updated_at?: string;
}

// Visit History & Development Tracking
export interface VisitHistory {
  id?: string;
  ibk_id: string;
  kader_id: string;
  tanggal_kunjungan: string;

  // Complaints & Issues
  keluhan_utama?: string;
  keluhan_tambahan?: string[];

  // Development Checklist
  perkembangan_motorik_kasar?: DevelopmentStatus;
  perkembangan_motorik_halus?: DevelopmentStatus;
  perkembangan_bahasa?: DevelopmentStatus;
  perkembangan_sosial?: DevelopmentStatus;
  perkembangan_kognitif?: DevelopmentStatus;

  // Interventions & Activities
  intervensi_diberikan?: string[];
  aktivitas_stimulasi?: string[];
  respon_anak?: string;

  // Referrals
  rujukan_ke?: string;
  alasan_rujukan?: string;
  status_rujukan?: ReferralStatus;

  // Documentation
  foto_dokumentasi?: string[]; // File URLs
  catatan_kader?: string;

  // Follow-up
  rencana_follow_up?: string;
  tanggal_kunjungan_berikutnya?: string;

  created_at?: string;
  updated_at?: string;
}

// Complete IBK Record
export interface IBKRecord {
  personal_data: IBKPersonalData;
  psychological_assessment?: PsychologicalAssessment;
  disability_info?: DisabilityInfo;
  visit_history: VisitHistory[];

  // Metadata
  posyandu_id: string;
  status: "active" | "inactive" | "referred" | "graduated";
  total_kunjungan: number;
  last_visit?: string;
  next_scheduled_visit?: string;
}

// ========== Form Types for Multi-Step IBK Registration ==========

// Step 1: Personal Data Form
export type IBKPersonalDataForm = Omit<
  IBKPersonalData,
  "id" | "created_at" | "updated_at"
>;

// Step 2: Psychological Assessment Form (filled by Kader based on Psychologist's report)
export type PsychologicalAssessmentForm = Omit<
  PsychologicalAssessment,
  "id" | "ibk_id" | "created_at" | "updated_at"
>;

// Step 3: Disability Selection Form
export type DisabilitySelectionForm = Omit<
  DisabilityInfo,
  "id" | "ibk_id" | "created_at" | "updated_at"
>;

// Step 4: Initial Visit Form
export type InitialVisitForm = Omit<
  VisitHistory,
  "id" | "ibk_id" | "created_at" | "updated_at"
>;

// Complete Multi-Step Form
export interface IBKRegistrationForm {
  step1: IBKPersonalDataForm;
  step2?: PsychologicalAssessmentForm;
  step3: DisabilitySelectionForm;
  step4: InitialVisitForm;
  uploaded_documents?: File[];
}

// ========== Search & Filter Types ==========

export interface IBKSearchFilters {
  nama?: string;
  nik?: string;
  kecamatan?: string;
  jenis_disabilitas?: DisabilityType[];
  usia_min?: number;
  usia_max?: number;
  status?: IBKRecord["status"];
  periode_kunjungan_terakhir?: {
    dari: string;
    sampai: string;
  };
}

export interface IBKSearchResult {
  data: IBKRecord[];
  meta: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

// ========== Statistics & Reports Types ==========

export interface IBKStatistics {
  total_ibk: number;
  total_aktif: number;
  total_tidak_aktif: number;

  // By disability type
  by_disability_type: {
    fisik: number;
    intelektual: number;
    mental: number;
    sensorik: number;
  };

  // By age group
  by_age_group: {
    "0-5": number;
    "6-12": number;
    "13-18": number;
    "19-25": number;
    "25+": number;
  };

  // By region
  by_kecamatan: Array<{
    kecamatan: string;
    jumlah: number;
  }>;

  // Visit statistics
  visit_stats: {
    total_kunjungan_bulan_ini: number;
    rata_rata_kunjungan_per_ibk: number;
    ibk_butuh_follow_up: number;
  };
}

export interface MonthlyReport {
  periode: string; // "YYYY-MM"
  posyandu_id: string;

  // Summary
  total_ibk_terdaftar: number;
  total_kunjungan: number;
  ibk_baru: number;
  ibk_dirujuk: number;

  // Details
  detail_kunjungan: VisitHistory[];
  ibk_membutuhkan_perhatian: IBKRecord[];

  // Statistics
  statistik: IBKStatistics;

  generated_at: string;
  generated_by: string;
}

// ========== API Response Types ==========

export interface CreateIBKResponse {
  success: boolean;
  data: IBKRecord;
  message: string;
}

export interface UpdateIBKResponse {
  success: boolean;
  data: IBKRecord;
  message: string;
}

export interface GetIBKListResponse {
  success: boolean;
  data: IBKRecord[];
  meta: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface GetIBKDetailResponse {
  success: boolean;
  data: IBKRecord;
}

// ========== IBK Detail View API Response Types ==========

// Health information from API
export interface IBKHealthInfo {
  hasil_diagnosa?: string;
  odgj?: boolean;
  jenis_bantuan?: string;
  riwayat_terapi?: string;
}

// Detail information from API
export interface IBKDetailInfo {
  pekerjaan?: string;
  pendidikan?: string;
  status_perkawinan?: string;
  titik_koordinat?: string;
  keterangan_tambahan?: string;
  [key: string]: string | undefined;
}

// Complete IBK form data type used in create/edit routes
export interface IBKFormData {
  // Step 1: Personal Data
  nama: string;
  nik: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  file: string;
  jenis_kelamin: string;
  agama: string;
  umur: string;
  alamat: string;
  no_telp: string;
  nama_wali: string;
  no_telp_wali: string;

  // Step 2: Assessment
  total_iq: string;
  kategori_iq: string;
  tipe_kepribadian: string;
  deskripsi_kepribadian: string;
  catatan_psikolog: string;
  rekomendasi_intervensi: string;
  potensi: string;
  minat: string;
  bakat: string;
  keterampilan: string;

  // Step 3: Health
  hasil_diagnosa: string;
  jenis_bantuan: string;
  riwayat_terapi: string;

  // Step 4: Detail
  pekerjaan: string;
  pendidikan: string;
  status_perkawinan: string;
  titik_koordinat: string;
  keterangan_tambahan: string;

  // Index signature for modular-forms compatibility
  [key: string]: string;
}

// Assessment information from API
export interface IBKAssessmentInfo {
  total_iq?: number | string;
  kategori_iq?: string;
  tipe_kepribadian?: string;
  potensi?: string;
  minat?: string;
  bakat?: string;
  keterampilan?: string;
  deskripsi_kepribadian?: string;
  catatan_psikolog?: string;
  rekomendasi_intervensi?: string;
}

// Disability type from API
export interface APIDisabilityType {
  id: number | string;
  nama: string;
  deskripsi?: string;
}

// Disability information from API
export interface IBKDisabilityInfo {
  id: number | string;
  jenis_difasilitas?: APIDisabilityType;
  tingkat_keparahan?: ExtendedSeverityLevel;
  sejak_kapan?: string;
  keterangan?: string;
}

// Complete IBK Detail View data structure as returned by API
export interface IBKDetailViewData {
  // Photo
  file_foto?: string;
  file?: string;

  // Personal data (can be flattened or nested)
  nama?: string;
  nik?: string | number;
  alamat?: string;
  no_telp?: string;
  jenis_kelamin?: string;
  umur?: string | number;
  agama?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;

  // Guardian information
  nama_wali?: string;
  no_telp_wali?: string;

  // Nested personal data (alternative structure)
  personal_data?: {
    nama_lengkap?: string;
    nik?: string | number;
    alamat_lengkap?: string;
    no_telp?: string;
    gender?: string;
  };

  // Health information
  kesehatan_ibk?: IBKHealthInfo;

  // Detail information
  detail_ibk?: IBKDetailInfo;

  // Assessment information
  assesmen_ibk?: IBKAssessmentInfo;

  // Disability information array
  disabilitasIbk?: IBKDisabilityInfo[];
}

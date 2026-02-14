import api from "./api";
import type {
  StatistikLaporanData,
  StatistikLaporanResponse,
  PeriodeFilter,
} from "~/types/statistik-laporan";

export class StatistikLaporanService {
  private static instance: StatistikLaporanService;
  private constructor() {}

  static getInstance() {
    if (!StatistikLaporanService.instance) {
      StatistikLaporanService.instance = new StatistikLaporanService();
    }
    return StatistikLaporanService.instance;
  }

  async getStatistikLaporan(
    posyanduId: string,
    periode: PeriodeFilter = "semua",
  ): Promise<StatistikLaporanData> {
    const query = new URLSearchParams();
    query.append("posyandu_id", posyanduId);
    query.append("periode", periode);

    const response = await api.get<StatistikLaporanResponse>(
      `/kader/dashboard/statistik-laporan?${query.toString()}`,
    );

    return response.data.data;
  }
}

export const statistikLaporanService = StatistikLaporanService.getInstance();

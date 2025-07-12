import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div>
      <h1 class="text-3xl font-bold mb-6">
        Pendataan Individu Berkebutuhan Khusus (IBK)
      </h1>

      <form class="space-y-4">
        <div class="collapse collapse-arrow bg-base-200">
          <input type="radio" name="my-accordion-2" checked />
          <div class="collapse-title text-xl font-medium">Data Diri IBK</div>
          <div class="collapse-content">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Nama Lengkap</span>
                </label>
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  class="input input-bordered"
                />
              </div>
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Nomor Induk Kependudukan (NIK)</span>
                </label>
                <input
                  type="text"
                  placeholder="NIK"
                  class="input input-bordered"
                />
              </div>
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Tempat, Tanggal Lahir</span>
                </label>
                <div class="flex gap-2">
                  <input
                    type="text"
                    placeholder="Tempat Lahir"
                    class="input input-bordered w-1/2"
                  />
                  <input type="date" class="input input-bordered w-1/2" />
                </div>
              </div>
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Jenis Kelamin</span>
                </label>
                <select class="select select-bordered">
                  <option disabled selected>
                    Pilih Jenis Kelamin
                  </option>
                  <option>Laki-laki</option>
                  <option>Perempuan</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="collapse collapse-arrow bg-base-200">
          <input type="radio" name="my-accordion-2" />
          <div class="collapse-title text-xl font-medium">
            Data Orang Tua / Wali
          </div>
          <div class="collapse-content">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Nama Ayah</span>
                </label>
                <input
                  type="text"
                  placeholder="Nama Ayah"
                  class="input input-bordered"
                />
              </div>
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Nama Ibu</span>
                </label>
                <input
                  type="text"
                  placeholder="Nama Ibu"
                  class="input input-bordered"
                />
              </div>
              <div class="form-control md:col-span-2">
                <label class="label">
                  <span class="label-text">Alamat</span>
                </label>
                <textarea
                  class="textarea textarea-bordered"
                  placeholder="Alamat Lengkap"
                ></textarea>
              </div>
              <div class="form-control">
                <label class="label">
                  <span class="label-text">No. Telepon</span>
                </label>
                <input
                  type="tel"
                  placeholder="Nomor Telepon"
                  class="input input-bordered"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="collapse collapse-arrow bg-base-200">
          <input type="radio" name="my-accordion-2" />
          <div class="collapse-title text-xl font-medium">
            Informasi Kebutuhan Khusus
          </div>
          <div class="collapse-content">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Jenis Disabilitas</span>
                </label>
                <select class="select select-bordered">
                  <option disabled selected>
                    Pilih Jenis Disabilitas
                  </option>
                  <option>Tuna Netra</option>
                  <option>Tuna Rungu</option>
                  <option>Tuna Wicara</option>
                  <option>Tuna Daksa</option>
                  <option>Tuna Grahita</option>
                  <option>Autisme</option>
                  <option>Lainnya</option>
                </select>
              </div>
              <div class="form-control md:col-span-2">
                <label class="label">
                  <span class="label-text">Keterangan Tambahan</span>
                </label>
                <textarea
                  class="textarea textarea-bordered"
                  placeholder="Jelaskan kondisi atau kebutuhan khusus lainnya"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-4">
          <button type="submit" class="btn btn-primary">
            Simpan Data
          </button>
        </div>
      </form>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Pendataan IBK - Si-DIFA",
  meta: [
    {
      name: "description",
      content: "Halaman pendataan IBK untuk Kader Posyandu Si-DIFA",
    },
  ],
};

import { 
    UserStar,
    PartyPopper,
    MessageSquareText,
    CircleCheckBig,
    Clock,
    CircleAlert,
    ChartColumn,
    ChartSpline,
    ClipboardPlus,
    MessageSquare,
    Download,
    Headset,
    Gift,
    User,
    Mail,
    ChartBarStacked,
    CircleGauge,
    ReceiptText,
    Link2,
    FileUser,
    Send

} from "lucide-react"
import { useState,useRef } from "react";

function DokumenPendukung() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };


  const addFiles = (newFiles) => {
    setFiles((prev) => [...prev, ...Array.from(newFiles)]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };


  return (
    <div id="dokumen-pendukung" className="flex flex-col gap-3">
      <header className="flex gap-2 items-center">
        <Link2 className="w-5 text-[#deb735]" />
        <span className="font-semibold">Dokumen Pendukung</span>
        <span className="opacity-65">{"(opsional)"}</span>
      </header>

      <div
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer
          ${isDragging
            ? "border-[#D4AF37] bg-yellow-50"
            : "border-gray-300 hover:border-[#D4AF37] hover:bg-gray-50"
          }`}
      >

        <input
          ref={inputRef}
          type="file"
          name="files[]"
          multiple
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={(e) => addFiles(e.target.files)}
        />
        <div className="w-11 h-11 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-3">
    
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
          </svg>
        </div>
        <p className="font-medium text-sm text-gray-700">Klik atau seret file ke sini</p>
        <p className="text-xs text-gray-400 mt-1">PDF, DOC, JPG, PNG — maks. 10MB per file</p>
      </div>

      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-8 h-8 rounded-md bg-yellow-100 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-semibold text-yellow-700">
                  {file.name.split(".").pop().toUpperCase()}
                </span>
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
              </div>
              <button
                onClick={() => removeFile(i)}
                className="text-gray-400 hover:text-red-500 transition-colors text-sm px-1"
              >✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CreateComplaint(){
    const username = 'ahmad';
    const emailUser = 'daiyanmuslim2@gmail.com'

    return (
        <div className="p-5.5 xl:ml-70 xl:mt-14">
            <div id="form-komplain" className="flex flex-col gap-5">
                <div id="form-komplain-header" className="bg-gradient-to-r from-[#0A1628] to-[#1B2B4A] rounded-xl">
                    <div id="form-komplain-header" className="px-5 py-4 flex flex-col gap-4">
                        <div id="dhc-p1" className="text-3xl text-white font-bold">
                            <span>Form Komplain</span> 
                        </div>

                        <div id="dhc-p2" className="text-white/70">
                            <span>Laporkan masalah Anda dengan jelas dan lengkap</span>
                        </div>
                    </div>
                </div>

                <main className="bg-white pt-5 px-5 rounded-xl">
                    <form action="" method="" className="flex flex-col gap-11 pb-5 rounded-b-xl">
                        <div id="Informasi-Pelapor" className="flex flex-col gap-3">
                            <header className="flex gap-2">
                                <User className="w-5 text-[#deb735]"/>
                                <span className="font-semibold ">Informasi Pelapor</span>
                            </header>

                            <div className="pelapor-container flex flex-col gap-4 xl:flex-row xl:gap-12">
                                <div id="pc-1" className="xl:flex-1">
                                    <label htmlFor="" className="flex items-center gap-2">
                                        <User className="w-4 opacity-75"/>
                                        <span className="opacity-75 text-sm font-semibold">Nama Lengkap</span>
                                    </label>
                                    <input type="text" className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#D4AF37] transition-all duration-200" value={username}/>
                                </div>
                                <div id="pc-2"  className="xl:flex-1">
                                    <label htmlFor="" className="flex items-center gap-2">
                                        <Mail className="w-4 opacity-75"/>
                                        <span className="opacity-75 text-sm font-semibold">Email</span>
                                    </label>
                                    <input type="text" className="w-full px-4 py-2 bg-white border-2 border-gray-300  00 rounded-xl focus:outline-none focus:border-[#D4AF37] transition-all duration-200" value={emailUser}/>
                                </div>
                            </div>
                        </div>
                        
                        <div id="kategori-komplain" className="flex flex-col gap-3">
                            <header className="flex gap-2">
                                <ChartBarStacked className="w-5 text-[#deb735]"/>
                                <span className="font-semibold ">Kategori Komplain</span>
                            </header>

                            <div className="kategori-container flex flex-col gap-4 xl:flex-row xl:gap-12">
                                <div id="pc-1" className="xl:flex-1">
                                    <label htmlFor="" className="flex items-center gap-2">
                                        <User className="w-4 opacity-75"/>
                                        <span className="opacity-75 text-sm font-semibold">Kategori</span>
                                    </label>
                                    <select name="" id="" className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#D4AF37] disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer">
                                        <option value>pilih kategori komplain</option>
                                        <option value="">konsumsi</option>
                                        <option value="">pelayanan</option>
                                        <option value="">kesantrian</option>
                                        <option value="">administrasi</option>
                                    </select>
                                </div>
                                <div id="pc-2"  className="xl:flex-1">
                                    <label htmlFor="" className="flex items-center gap-2">
                                        <CircleGauge className="w-4 opacity-75"/>
                                        <span className="opacity-75 text-sm font-semibold">Priority Level</span>
                                    </label>
                                    <select name="" id="" className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#D4AF37] disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer">
                                        <option value>pilih level prioritas</option>
                                        <option value="">low - rendah</option>
                                        <option value="">medium - sedang</option>
                                        <option value="">high - tinggi</option>
                                        <option value="">critical - kritis</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div id="detail-komplain" className="flex flex-col gap-3">
                            <header className="flex gap-2">
                                <ReceiptText className="w-5 text-[#deb735]"/>
                                <span className="font-semibold ">Detail Komplain</span>
                            </header>

                            <div className="detail-container flex flex-col gap-4 xl:flex-row xl:gap-12">
                                <textarea name="" id="" rows={6} placeholder="Jelaskan masalah Anda secara detail... (minimal 20 karakter)" className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#D4AF37] resize-none transition-all duration-200"></textarea>
                            </div>
                        </div>

                        <DokumenPendukung/>

                        <button type="submit" className="w-full bg-gradient-to-r from-[#0A1628] to-[#1B2B4A] text-white py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group">
                            <Send className="w-5 text-white"/>
                            <span className="text-white font-semibold">Kirim Komplain</span>
                        </button>
                    </form>
                </main>
            </div>
        </div>
    )
}

export default CreateComplaint
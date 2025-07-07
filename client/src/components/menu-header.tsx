export function MenuHeader() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-rose-50 to-blue-50 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Datça Café
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
              Kağıthane'nin kalbinde, hızlı tempolu iş hayatınıza uygun 
              <span className="text-rose-600 font-semibold"> sağlıklı ve lezzetli</span> çözümler
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center text-gray-700">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Hızlı Servis</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>Sıcak Aile Ortamı</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
                <span>Taze Malzeme</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              İSKİ Genel Müdürlüğü Karşısında
            </h2>
            <p className="text-gray-600 text-sm">
              Sabah mesai öncesi kahveniz, öğlen arası doyurucu yemekleriniz için ideal konum. 
              Çalışan dostlarımız için özel hazırlanmış menümüzle, gününüze enerji katıyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* Menu Section Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Menümüz</h2>
          <p className="text-gray-600 text-center mt-2">Günün her saati için lezzetli seçenekler</p>
        </div>
      </header>
    </>
  );
}
